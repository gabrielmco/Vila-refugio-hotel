import gsap, { ScrollTrigger, SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import colimg1 from "../../assets/chalet_exterior.webp";
import colimg2 from "../../assets/chalet_interior.webp";
import colimg3 from "../../assets/chalet_view.webp";
import { requestScrollRefresh, waitForFrames, waitForStableLayout } from "../../lib/scrollRefresh";

const StickyCols = () => {
    const mountedRef = useRef(true);
    const sectionRef = useRef(null);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger, SplitText);

        const section = sectionRef.current;
        const splits = [];
        let cancelled = false;
        let tl = null;

        if (!section) return;
        const q = gsap.utils.selector(section);
        const compactLayout = window.matchMedia("(max-width: 1024px)").matches;

        if (!compactLayout) {
            gsap.set(q(".col-1"), { opacity: 1, scale: 1, visibility: "visible", force3D: true });
            gsap.set(q(".col-2"), { xPercent: 100, opacity: 1, visibility: "visible", force3D: true });
            gsap.set(q(".col-3, .col-4"), {
                xPercent: 100,
                yPercent: 100,
                opacity: 1,
                scale: 1,
                visibility: "visible",
                force3D: true
            });
        }

        const setupStickyCols = async () => {
            await waitForStableLayout(section, {
                imageSources: [colimg1, colimg2, colimg3],
                delay: 80
            });
            if (cancelled || !mountedRef.current || !sectionRef.current) return;

            if (compactLayout) {
                gsap.set(section.querySelectorAll(".col, .col-2, .col-3, .col-4, .col-img-2, .line span"), {
                    clearProps: "all"
                });
                requestScrollRefresh({ delay: 80 });
                return;
            }

            section.querySelectorAll(".col-3 h1, .col-3 p").forEach((element) => {
                const split = new SplitText(element, { type: "lines", linesClass: "line" });
                split.lines.forEach((line) => {
                    line.innerHTML = `<span>${line.textContent}</span>`;
                });
                splits.push(split);
            });

            gsap.set(q(".col-1"), { opacity: 1, scale: 1, visibility: "visible", force3D: true });
            gsap.set(q(".col-2"), { xPercent: 100, opacity: 1, visibility: "visible", force3D: true });
            gsap.set(q(".col-3, .col-4"), { xPercent: 100, yPercent: 100, opacity: 1, scale: 1, visibility: "visible", force3D: true });
            gsap.set(q(".col-img img, .col-img-2"), { force3D: true });
            gsap.set(q(".col-3 .col-content-wrapper .line span"), { yPercent: 0, opacity: 1 });
            gsap.set(q(".col-3 .col-content-wrapper-2 .line span"), { yPercent: -125, opacity: 0 });

            await waitForFrames(2);
            if (cancelled || !mountedRef.current || !sectionRef.current) return;

            tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => `+=${Math.round(window.innerHeight * 2.65)}`,
                    pin: true,
                    pinSpacing: true,
                    pinType: "fixed",
                    invalidateOnRefresh: true,
                    refreshPriority: 2000,
                    scrub: 1.35,
                    anticipatePin: 1.25,
                    // markers: true,
                },
            });

            tl.to(q(".col-1"), { opacity: 0, scale: 0.8, force3D: true, duration: 0.8 })
                .to(q(".col-2"), { xPercent: 0, force3D: true, duration: 0.8 }, "<")
                .to(q(".col-3"), { yPercent: 0, force3D: true, duration: 0.8 }, "<")
                .to(q(".col-img-1 img"), { scale: 1, force3D: true, duration: 0.8 }, "<")
                .to(q(".col-img-2"), {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    force3D: true,
                    duration: 0.8,
                }, "<")
                .to(q(".col-img-2 img"), { scale: 1.6, force3D: true, duration: 0.8 }, "<");

            tl.to(q(".col-2"), { opacity: 0, scale: 0.8, force3D: true, duration: 0.8 })
                .to(q(".col-3 .col-content-wrapper .line span"), {
                    yPercent: -125,
                    opacity: 0,
                    duration: 0.8,
                }, "<");
            tl.to(q(".col-3"), { xPercent: 0, force3D: true, duration: 0.8 }, "-=0.8")
                .to(q(".col-4"), { yPercent: 0, force3D: true, duration: 0.8 }, "<")
                .to(q(".col-3 .col-content-wrapper-2 .line span"), {
                    yPercent: 0,
                    opacity: 1,
                    delay: 0.4,
                    duration: 0.8,
                }, "<")
                .to({}, { duration: 0.8 });

            requestScrollRefresh({ delay: 180 });
        };

        setupStickyCols();

        return () => {
            cancelled = true;
            tl?.scrollTrigger?.kill();
            tl?.kill();
            splits.forEach((split) => split.revert());
        };
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="sticky-cols w-screen min-h-[100dvh] overflow-hidden bg-[#181717]">
            <div className="sticky-cols-wrapper relative w-full h-full">
                <div className="col col-1">
                    <div className="col-content">
                        <div className="col-content-wrapper">
                            <h1 className="text-2xl text-[#b1a696] font-bold leading-auto">
                                Desfrute a vista
                                <br />
                                atraves da ampla
                                <br />
                                fachada de vidro
                                <br />
                                panoramico
                            </h1>
                            <div className="col-content-para flex items-center gap-4 justify-between">
                                <div className="flex items-center gap-0 justify-center">
                                    <h3 className="border-1 px-3 py-1 rounded-full text-[#aaa091]">1</h3>
                                    <h3 className="border-1 px-3 py-1 rounded-full text-[#524e4b]">3</h3>
                                </div>
                                <p className="text-[12px] font-medium mr-6">
                                    Fique mais perto da
                                    <br />
                                    exuberante Mata Atlantica
                                    <br />
                                    do que nunca e contemple
                                    <br />
                                    paisagens de tirar o folego.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col col-2">
                    <div className="col-img col-img-1">
                        <div className="col-img-wrapper">
                            <img src={colimg1} alt="Fachada Chale" />
                        </div>
                    </div>
                    <div className="col-img col-img-2">
                        <div className="col-img-wrapper">
                            <img src={colimg2} alt="Interior Chale" />
                        </div>
                    </div>
                </div>

                <div className="col col-3">
                    <div className="col-content-wrapper">
                        <h1 className="text-2xl text-[#b1a696] font-bold leading-auto">
                            Conforto absoluto
                            <br />
                            com o calor
                            <br />
                            do nosso fireplace
                            <br />
                            aconchegante
                        </h1>
                        <div className="col-content-para flex items-center gap-4 justify-between ml-6">
                            <div className="flex items-center gap-0 justify-center">
                                <h3 className="border-1 px-3 py-1 rounded-full text-[#aaa091]">2</h3>
                                <h3 className="border-1 px-3 py-1 rounded-full text-[#524e4b]">3</h3>
                            </div>
                            <p className="text-[12px] font-medium">
                                Desfrute de noites
                                <br />
                                agradaveis com enxoval
                                <br />
                                de alta gramatura e a
                                <br />
                                perfeita harmonia do fogo.
                            </p>
                        </div>
                    </div>

                    <div className="col-content-wrapper-2">
                        <h1 className="text-2xl text-[#b1a696] font-bold leading-auto">
                            Relaxe no ofuro
                            <br />
                            privativo sob o
                            <br />
                            ceu estrelado
                            <br />
                            da serra
                        </h1>
                        <div className="col-content-para flex items-center gap-4 justify-between">
                            <div className="flex items-center gap-0 justify-center"></div>
                            <p className="text-[12px] font-medium mr-0">
                                Sinta o vapor d'agua
                                <br />
                                sob o ar fresco da noite
                                <br />
                                com total privacidade e
                                <br />
                                vista infinita para o vale.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col col-4">
                    <div className="col-img col-img-1">
                        <div className="col-img-wrapper">
                            <img src={colimg3} alt="Ofuro Chale" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky-cols-mobile-stack" aria-hidden="true">
                <article className="sticky-mobile-panel">
                    <h2>Desfrute a vista<br />atraves da ampla<br />fachada de vidro<br />panoramico</h2>
                    <div className="sticky-mobile-panel-footer">
                        <div className="sticky-mobile-count"><span>01</span><span>03</span></div>
                        <p>Fique mais perto da exuberante Mata Atlantica do que nunca e contemple paisagens de tirar o folego.</p>
                    </div>
                </article>
                <figure className="sticky-mobile-image">
                    <img src={colimg1} alt="Fachada Chale" />
                </figure>

                <article className="sticky-mobile-panel">
                    <h2>Conforto absoluto<br />com o calor<br />do nosso fireplace<br />aconchegante</h2>
                    <div className="sticky-mobile-panel-footer">
                        <div className="sticky-mobile-count"><span>02</span><span>03</span></div>
                        <p>Desfrute de noites agradaveis com enxoval de alta gramatura e a perfeita harmonia do fogo.</p>
                    </div>
                </article>
                <figure className="sticky-mobile-image">
                    <img src={colimg2} alt="Interior Chale" />
                </figure>

                <article className="sticky-mobile-panel">
                    <h2>Relaxe no ofuro<br />privativo sob o<br />ceu estrelado<br />da serra</h2>
                    <div className="sticky-mobile-panel-footer">
                        <div className="sticky-mobile-count"><span>03</span><span>03</span></div>
                        <p>Sinta o vapor d'agua sob o ar fresco da noite com total privacidade e vista infinita para o vale.</p>
                    </div>
                </article>
                <figure className="sticky-mobile-image">
                    <img src={colimg3} alt="Ofuro Chale" />
                </figure>
            </div>
        </section>
    );
};

export default StickyCols;
