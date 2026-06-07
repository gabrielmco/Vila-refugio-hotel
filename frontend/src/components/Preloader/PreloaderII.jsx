import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import "./preloaderII.css";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function PreloaderII({ onComplete }) {
    const mountedRef = useRef(true);
    const onCompleteRef = useRef(onComplete);
    const completeCalledRef = useRef(false);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useGSAP(() => {
        let splitsObj = null;
        let timeline = null;
        let failSafeTimer = null;

        const notifyComplete = () => {
            if (completeCalledRef.current) return;
            completeCalledRef.current = true;
            if (failSafeTimer) {
                window.clearTimeout(failSafeTimer);
                failSafeTimer = null;
            }
            onCompleteRef.current?.();
        };

        const forceComplete = () => {
            if (!mountedRef.current) return;
            notifyComplete();
            gsap.to(".preloader-root", {
                autoAlpha: 0,
                display: "none",
                duration: 0.35,
                ease: "power2.out",
            });
        };

        failSafeTimer = window.setTimeout(forceComplete, 6500);

        document.fonts.ready.then(() => {
            if (!mountedRef.current) return;

            try {
                const createSplitTexts = (elements) => {
                    const splits = {};
                    elements.forEach(({ key, selector, type }) => {
                        const config = { type, mask: type };
                        if (type === "chars") config.charsClass = "char";
                        if (type === "lines") config.linesClass = "line";
                        splits[key] = SplitText.create(selector, config);
                    });
                    return splits;
                };

                const splits = createSplitTexts([
                    { key: "logoChars", selector: ".preloader-logo h1", type: "chars" },
                    { key: "footerLines", selector: ".preloader-footer p", type: "lines" },
                ]);
                splitsObj = splits;

                if (!splits.logoChars?.chars?.length || !splits.footerLines?.lines?.length) {
                    forceComplete();
                    return;
                }

                gsap.set(splits.logoChars.chars, { x: "100%" });
                gsap.set(splits.footerLines.lines, { y: "100%" });
                gsap.set(".preloader-progress-bar", { scaleX: 0 });

                const animateProgress = (duration = 2.8) => {
                    const tl = gsap.timeline();
                    const counterSteps = 3;
                    let currentProgress = 0;

                    for (let i = 0; i < counterSteps; i += 1) {
                        const finalStep = i === counterSteps - 1;
                        const targetProgress = finalStep
                            ? 1
                            : Math.min(currentProgress + Math.random() * 0.3 + 0.1, 0.9);
                        currentProgress = targetProgress;

                        tl.to(".preloader-progress-bar", {
                            scaleX: targetProgress,
                            duration: duration / counterSteps,
                            ease: "power3.out",
                        });
                    }

                    return tl;
                };

                timeline = gsap.timeline({ delay: 0.5 });
                timeline.to(splits.logoChars.chars, {
                    x: "0%",
                    stagger: 0.05,
                    duration: 1,
                    ease: "power4.inOut",
                })
                    .to(
                        splits.footerLines.lines,
                        {
                            y: "0%",
                            stagger: 0.1,
                            duration: 1,
                            ease: "power4.inOut",
                        },
                        "0.25"
                    )
                    .add(animateProgress(), "<")
                    .to(
                        splits.logoChars.chars,
                        {
                            x: "-100%",
                            stagger: 0.05,
                            duration: 0.8,
                            ease: "power4.inOut",
                        },
                        "+=0.04"
                    )
                    .to(
                        splits.footerLines.lines,
                        {
                            y: "-100%",
                            stagger: 0.08,
                            duration: 0.32,
                            ease: "power4.inOut",
                        },
                        "-=0.12"
                    )
                    .call(notifyComplete, [], "<")
                    .to(
                        ".preloader-progress",
                        {
                            opacity: 0,
                            duration: 0.34,
                            ease: "power3.out",
                        },
                        "<"
                    )
                    .to(
                        ".preloader-mask",
                        {
                            scale: 6.4,
                            duration: 1.25,
                            ease: "power4.inOut",
                        },
                        "<"
                    )
                    .to(
                        ".preloader-root",
                        {
                            autoAlpha: 0,
                            display: "none",
                            duration: 0.3,
                            ease: "power2.out",
                        },
                        ">-0.18"
                    );
            } catch {
                forceComplete();
            }
        }).catch(forceComplete);

        return () => {
            if (failSafeTimer) {
                window.clearTimeout(failSafeTimer);
            }
            if (timeline) {
                timeline.kill();
            }
            if (splitsObj) {
                Object.values(splitsObj).forEach((split) => split.revert());
            }
        };
    }, []);

    return (
        <div className="preloader-root size-full fixed z-51 overflow-hidden pointer-events-none">
            <div className="preloader-progress">
                <div className="preloader-progress-track">
                    <div className="preloader-progress-bar"></div>
                </div>
                <div className="preloader-logo">
                    <h1>Vila Refúgio</h1>
                </div>
            </div>

            <div className="preloader-mask"></div>

            <div className="preloader-content">
                <div className="preloader-footer">
                    <p className="text-sm">
                        Conheça a Vila Refúgio® — chalés modernos e aconchegantes<br />
                        perfeitamente integrados à natureza da serra brasileira.
                    </p>
                </div>
            </div>
        </div>
    );
}
