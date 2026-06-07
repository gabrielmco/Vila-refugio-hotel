let lenisInstance = null;

export function setLenisInstance(instance) {
    lenisInstance = instance;
}

export function getLenisInstance() {
    return lenisInstance;
}

export function startSmoothScroll() {
    lenisInstance?.start();
}

export function stopSmoothScroll() {
    lenisInstance?.stop();
}

export function resizeSmoothScroll() {
    lenisInstance?.resize();
}

export function destroySmoothScroll(instance = lenisInstance) {
    if (instance && instance === lenisInstance) {
        lenisInstance = null;
    }
    instance?.destroy();
}

export function scrollToTarget(target, options = {}) {
    const lenis = getLenisInstance();

    if (lenis) {
        lenis.scrollTo(target, {
            duration: 1.45,
            easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
            ...options
        });
        return;
    }

    if (typeof window === "undefined") return;

    if (typeof target === "number") {
        window.scrollTo({
            top: target,
            behavior: options.immediate ? "auto" : "smooth"
        });
        return;
    }

    const element = typeof target === "string"
        ? document.querySelector(target)
        : target;

    element?.scrollIntoView({
        behavior: options.immediate ? "auto" : "smooth",
        block: "start"
    });
}
