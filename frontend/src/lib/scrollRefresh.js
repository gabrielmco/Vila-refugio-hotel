import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resizeSmoothScroll, scrollToTarget } from "./smoothScroll";

let refreshToken = 0;
let refreshTimer = null;

export function updateViewportMetrics() {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const root = document.documentElement;
    root.style.setProperty("--app-vh", `${window.innerHeight}px`);
    root.style.setProperty("--app-vw", `${root.clientWidth}px`);
}

function isScrollBusy() {
    return typeof ScrollTrigger.isScrolling === "function" && ScrollTrigger.isScrolling();
}

function isActivePinnedScroll() {
    if (typeof ScrollTrigger.getAll !== "function") return false;
    return ScrollTrigger.getAll().some((trigger) => trigger?.vars?.pin && trigger.isActive);
}

export function requestScrollRefresh(options = {}) {
    if (typeof window === "undefined") return;

    const { force = false, delay = 0, allowDuringPin = false } = options;

    if (refreshTimer) {
        window.clearTimeout(refreshTimer);
        refreshTimer = null;
    }

    const run = () => {
        if (!allowDuringPin && isScrollBusy() && isActivePinnedScroll()) {
            refreshTimer = window.setTimeout(() => requestScrollRefresh({ ...options, force: false }), 220);
            return;
        }

        if (!force && isScrollBusy()) {
            refreshTimer = window.setTimeout(() => requestScrollRefresh(options), 180);
            return;
        }

        const token = ++refreshToken;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (token !== refreshToken) return;

                updateViewportMetrics();
                resizeSmoothScroll();
                ScrollTrigger.refresh(force);
            });
        });
    };

    if (delay > 0) {
        refreshTimer = window.setTimeout(run, delay);
        return;
    }

    run();
}

export function waitForFonts() {
    if (typeof document === "undefined" || !document.fonts?.ready) {
        return Promise.resolve();
    }

    return document.fonts.ready.catch(() => {});
}

export function waitForFrames(count = 2) {
    if (typeof window === "undefined") return Promise.resolve();

    return new Promise((resolve) => {
        let remaining = Math.max(1, count);
        const tick = () => {
            remaining -= 1;
            if (remaining <= 0) {
                resolve();
                return;
            }
            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    });
}

function decodeImage(img) {
    if (!img || !img.decode) return Promise.resolve();
    return img.decode().catch(() => {});
}

export function waitForElementImages(root = document) {
    if (!root?.querySelectorAll) return Promise.resolve();

    const imgs = Array.from(root.querySelectorAll("img"));
    return Promise.all(
        imgs.map((img) => {
            if (img.complete) return decodeImage(img);

            return new Promise((resolve) => {
                const done = () => {
                    img.removeEventListener("load", done);
                    img.removeEventListener("error", done);
                    decodeImage(img).then(resolve);
                };

                img.addEventListener("load", done, { once: true });
                img.addEventListener("error", done, { once: true });
            });
        })
    );
}

export function waitForImageSources(sources = []) {
    if (typeof window === "undefined") return Promise.resolve();

    return Promise.all(
        sources.filter(Boolean).map((src) => new Promise((resolve) => {
            const img = new Image();
            img.onload = () => decodeImage(img).then(resolve);
            img.onerror = resolve;
            img.src = src;
        }))
    );
}

export async function waitForStableLayout(root = document, options = {}) {
    const { imageSources = [], delay = 0, frames = 2, includeDomImages = true } = options;

    await Promise.all([
        waitForFonts(),
        includeDomImages ? waitForElementImages(root) : Promise.resolve(),
        waitForImageSources(imageSources)
    ]);

    if (delay > 0 && typeof window !== "undefined") {
        await new Promise((resolve) => window.setTimeout(resolve, delay));
    }

    await waitForFrames(frames);
}

export function requestSettledScrollRefresh(options = {}) {
    const { delays = [0, 120, 450], force = true } = options;

    delays.forEach((delay) => {
        if (delay <= 0 || typeof window === "undefined") {
            requestScrollRefresh({ force });
            return;
        }

        window.setTimeout(() => {
            requestScrollRefresh({ force });
        }, delay);
    });
}

export async function refreshAfterAssetsReady(root = document) {
    await waitForStableLayout(root);
    requestSettledScrollRefresh();
}

export function alignPinnedSection(section) {
    if (typeof window === "undefined" || !section) return;

    let attempts = 0;
    const align = () => {
        requestAnimationFrame(() => {
            const rect = section.getBoundingClientRect();
            const offset = rect.top;

            if (Math.abs(offset) < 2 || Math.abs(offset) > window.innerHeight * 0.5) {
                return;
            }

            const targetY = Math.max(0, window.scrollY + offset);
            scrollToTarget(targetY, { immediate: true, force: true });

            requestScrollRefresh();

            attempts += 1;
            if (attempts < 3) {
                requestAnimationFrame(align);
            }
        });
    };

    requestAnimationFrame(align);
}
