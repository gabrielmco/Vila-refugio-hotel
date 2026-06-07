import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import acImg1 from "../../assets/activity_hike.webp";
import acImg2 from "../../assets/activity_horse.webp";
import acImg3 from "../../assets/activity_waterfall.webp";
import { requestScrollRefresh, waitForStableLayout } from "../../lib/scrollRefresh";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Showcase = () => {
    const containerRef = useRef(null);
    const imgConRef = useRef(null);

    useGSAP(() => {
        const container = containerRef.current;
        const imgCon = imgConRef.current;
        if (!container || !imgCon) return;

        let cancelled = false;
        let timeline = null;

        const setupShowcase = async () => {
            await waitForStableLayout(container, {
                imageSources: [acImg1, acImg2, acImg3],
                includeDomImages: false,
                delay: 80,
            });

            if (cancelled || !containerRef.current || !imgConRef.current) return;

            const compactLayout = window.matchMedia("(max-width: 1024px)").matches;
            if (compactLayout) {
                gsap.set(imgCon, { clearProps: "all" });
                requestScrollRefresh({ delay: 80 });
                return;
            }

            const images = gsap.utils.toArray(container.querySelectorAll(".image-item"));
            gsap.set(imgCon, { x: 0, force3D: true, willChange: "transform" });
            gsap.set(images, {
                scale: 1.06,
                xPercent: 0,
                force3D: true,
                willChange: "transform",
                transformOrigin: "center center",
            });

            const getTotalWidth = () => Math.max(
                0,
                imgCon.scrollWidth - container.offsetWidth
            );

            timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: () => `+=${Math.round(Math.max(getTotalWidth(), window.innerHeight * 1.8))}`,
                    scrub: 1.2,
                    pin: true,
                    pinSpacing: true,
                    pinType: "fixed",
                    invalidateOnRefresh: true,
                    refreshPriority: 1000,
                    anticipatePin: 1.25,
                    // markers: true,
                },
            });

            timeline
                .to(imgCon, {
                    x: () => -getTotalWidth(),
                    ease: "none",
                    duration: 1,
                }, 0)
                .to(images, {
                    scale: 1.02,
                    xPercent: 0,
                    ease: "none",
                    duration: 1,
                }, 0);

            requestScrollRefresh({ delay: 120 });
        };

        setupShowcase();

        return () => {
            cancelled = true;
            timeline?.scrollTrigger?.kill();
            timeline?.kill();
        };
    }, { scope: containerRef });

    return (
        <section
            id="atividades"
            ref={containerRef}
            className="relative w-full overflow-hidden"
            style={{ height: "var(--app-vh, 100dvh)", minHeight: "var(--app-vh, 100dvh)" }}
        >
            <div
                ref={imgConRef}
                className="absolute top-0 left-0 h-full flex items-center justify-start gap-2 p-2 overflow-hidden"
            >
                <div className="relative flex-shrink-0 w-[80vw] h-full overflow-hidden">
                    <div className="w-[77vw] absolute top-10 left-5 flex justify-between items-start text-[#f4efe7] z-10">
                        <h1 className="text-3xl font-bold">Lobby &<br />Acolhimento</h1>
                        <p className="border-[1px] rounded-3xl px-3 py-1 text-center text-[0.7rem] bg-black/35 backdrop-blur-xs">Exclusivo</p>
                    </div>
                    <img
                        src={acImg1}
                        alt="Lobby Pousada"
                        className="image-item w-full h-full object-cover rounded-[2.5rem]"
                        loading="eager"
                        decoding="async"
                    />
                    <div className="w-[77vw] absolute bottom-10 left-5 flex justify-between items-start z-10">
                        <p className="text-[0.75rem] font-bold text-[#f4efe7] bg-black/40 p-2 rounded-lg">Nosso hall monumental recebe você com uma fusão perfeita de mármore e madeira nobre,<br />aquecido por uma acolhedora lareira clássica e sofás luxuosos.</p>
                        <div className="flex justify-center items-center">
                            <p className="text-[#f4efe7] border-[1px] rounded-3xl px-[1vw] py-1 text-center text-[0.7rem]">01</p>
                            <p className="text-[#4e484e] border-[1px] rounded-3xl px-[1vw] py-1 text-center text-[0.7rem]">03</p>
                        </div>
                    </div>
                </div>

                <div className="relative flex-shrink-0 w-[80vw] h-full overflow-hidden">
                    <div className="w-[77vw] absolute top-10 left-5 flex justify-between items-start text-[#f4efe7] z-10">
                        <h1 className="text-3xl font-bold">Restaurante &<br />Piano Bar</h1>
                        <p className="border-[1px] rounded-3xl px-3 py-1 text-center text-[0.7rem] bg-black/35 backdrop-blur-xs">Gourmet</p>
                    </div>
                    <img
                        src={acImg2}
                        alt="Restaurante Pousada"
                        className="image-item w-full h-full object-cover rounded-[2.5rem]"
                        loading="eager"
                        decoding="async"
                    />
                    <div className="w-[77vw] absolute bottom-10 left-5 flex justify-between items-start z-10">
                        <p className="text-[0.75rem] font-bold text-[#f4efe7] bg-black/40 p-2 rounded-lg">Desfrute de uma experiência culinária contemporânea e de uma adega exclusiva de vinhos,<br />em um salão clássico aquecido ao som de nosso piano de cauda.</p>
                        <div className="flex justify-center items-center">
                            <p className="text-[#f4efe7] border-[1px] rounded-3xl px-[1vw] py-1 text-center text-[0.7rem]">02</p>
                            <p className="text-[#4e484e] border-[1px] rounded-3xl px-[1vw] py-1 text-center text-[0.7rem]">03</p>
                        </div>
                    </div>
                </div>

                <div className="relative flex-shrink-0 w-[80vw] h-full overflow-hidden">
                    <div className="w-[77vw] absolute top-10 left-5 flex justify-between items-start text-[#f4efe7] z-10">
                        <h1 className="text-3xl font-bold">Spa &<br />Piscina Aquecida</h1>
                        <p className="border-[1px] rounded-3xl px-3 py-1 text-center text-[0.7rem] bg-black/35 backdrop-blur-xs">Bem-Estar</p>
                    </div>
                    <img
                        src={acImg3}
                        alt="Spa Pousada"
                        className="image-item w-full h-full object-cover rounded-[2.5rem]"
                        loading="eager"
                        decoding="async"
                    />
                    <div className="w-[77vw] absolute bottom-10 left-5 flex justify-between items-start z-10">
                        <p className="text-[0.75rem] font-bold text-[#f4efe7] bg-black/40 p-2 rounded-lg">Relaxe em nossa piscina aquecida ao ar livre e no ofurô de madeira com borda infinita,<br />contemplando a exuberante floresta e as montanhas da serra brasileira.</p>
                        <div className="flex justify-center items-center">
                            <p className="text-[#f4efe7] border-[1px] rounded-3xl px-[1vw] py-1 text-center text-[0.7rem]">03</p>
                            <p className="text-[#4e484e] border-[1px] rounded-3xl px-[1vw] py-1 text-center text-[0.7rem]">03</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Showcase;
