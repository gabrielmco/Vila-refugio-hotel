import { Outlet } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar/Navbar";
import PreloaderII from "../components/Preloader/PreloaderII";
import ReserveBtn from "../components/Buttons/ReserveBtn";
import Logo from "../components/Buttons/Logo";
import Footer from "../components/Footer/Footer";
import FooterTitle from "../components/Footer/FooterTitle";
import { refreshAfterAssetsReady, requestScrollRefresh, requestSettledScrollRefresh, updateViewportMetrics, waitForFonts } from "../lib/scrollRefresh";
import { destroySmoothScroll, scrollToTarget, setLenisInstance, startSmoothScroll, stopSmoothScroll } from "../lib/smoothScroll";
import { useEffect, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const MainLayout = () => {
    const [preloaderComplete, setPreloaderComplete] = useState(false);

    useEffect(() => {
        const preventScroll = (event) => {
            event.preventDefault();
        };
        const preventScrollKeys = (event) => {
            const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
            if (scrollKeys.includes(event.key)) {
                event.preventDefault();
            }
        };

        if (preloaderComplete) {
            startSmoothScroll();
            requestSettledScrollRefresh({ force: true, delays: [0, 160, 520, 900] });
            return;
        }

        window.scrollTo(0, 0);
        scrollToTarget(0, { immediate: true, force: true });
        stopSmoothScroll();

        window.addEventListener("wheel", preventScroll, { passive: false });
        window.addEventListener("touchmove", preventScroll, { passive: false });
        window.addEventListener("keydown", preventScrollKeys);

        return () => {
            window.removeEventListener("wheel", preventScroll);
            window.removeEventListener("touchmove", preventScroll);
            window.removeEventListener("keydown", preventScrollKeys);
            startSmoothScroll();
        };
    }, [preloaderComplete]);

    useEffect(() => {
        updateViewportMetrics();

        const lenis = new Lenis({
            duration: 1.65,
            easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
            smoothWheel: true,
            syncTouch: false,
            wheelMultiplier: 0.78,
            touchMultiplier: 1,
            autoResize: true,
        });
        setLenisInstance(lenis);
        lenis.stop();
        lenis.scrollTo(0, { immediate: true, force: true });
        lenis.on("scroll", ScrollTrigger.update);

        const updateLenis = (time) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(updateLenis);
        gsap.ticker.lagSmoothing(0);

        let cancelled = false;
        const refreshWhenReady = () => refreshAfterAssetsReady(document);

        const handleLoad = () => refreshWhenReady();
        let resizeTimer = null;
        const handleResize = () => {
            updateViewportMetrics();
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                if (!cancelled) requestScrollRefresh({ force: true });
            }, 180);
        };

        window.addEventListener("load", handleLoad);
        window.addEventListener("resize", handleResize);

        if (document.readyState === "complete") {
            refreshWhenReady();
        }

        waitForFonts().then(() => {
            if (!cancelled) requestScrollRefresh();
        });

        return () => {
            cancelled = true;
            window.removeEventListener("load", handleLoad);
            window.removeEventListener("resize", handleResize);
            window.clearTimeout(resizeTimer);
            lenis.off("scroll", ScrollTrigger.update);
            gsap.ticker.remove(updateLenis);
            destroySmoothScroll(lenis);
        };
    }, []);

    return (
        <>
            <PreloaderII onComplete={() => setPreloaderComplete(true)} />
            {preloaderComplete && (
                <>
                    <Logo />
                    <ReserveBtn />
                    <Navbar />
                </>
            )}
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <main>
                        <Outlet /> {/* Hero, About, Contact, etc. */}
                        <Footer />
                        <FooterTitle />
                    </main>
                </div>
            </div>
        </>
    );
};

export default MainLayout;
