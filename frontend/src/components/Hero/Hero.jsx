import gsap from "gsap/all";
import heroChalet from "../../assets/hero_chalet.webp";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
    const isMobHero = useMediaQuery({
        query: "(max-width:768px)",
    });

    useGSAP(() => {
        if (!isMobHero) {
            gsap.to(".hero-section .hero-img", {
                yPercent: "-5",
                stagger: 0.02,
                scale: 1.2,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.5,
                },
            });
        }
    }, [isMobHero]);

    return (
        <section className="hero-section w-dvw md:h-dvh h-[100svh] md:p-2 p-2.5 mb-20">
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <div className="hero-img absolute inset-0 w-full h-full z-0">
                        <img
                            src={heroChalet}
                            alt="Vila Refúgio"
                            className="w-full h-full object-cover object-center"
                            loading="eager"
                            fetchPriority="high"
                        />
                        <div className="absolute inset-0 bg-black/40 z-1" />
                    </div>
                </div>
                <div className="p-4 flex flex-col md:justify-center relative z-10 h-full">
                    <div className="relative h-full">
                        <h1
                            className="text-[#f4efe7] text-start text-[clamp(4.6rem,18vw,6.8rem)] leading-[0.88] md:text-9xl md:leading-none font-bold tracking-[-0.05em] md:tracking-wider lg:absolute lg:left-2"
                            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}
                        >
                            Vila Refúgio®
                        </h1>

                        <div className="w-full h-auto absolute bottom-7 md:bottom-[8%] lg:bottom-[9%] left-0 right-0 flex md:flex-row flex-col md:justify-between md:items-end">
                            <h2
                                className="text-start lg:mt-0 md:text-[#f4efe7] text-[#f4efe7] text-[1.55rem] md:text-2xl font-bold md:tracking-wider leading-[1.02] flex flex-col gap-1"
                                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                            >
                                <span>Mais perto da</span>
                                <span>Natureza — Mais perto</span>
                                <span>de você</span>
                            </h2>

                            <p
                                className="md:w-[25%] w-[92%] text-[#f4efe7] text-[0.78rem] font-bold md:font-medium tracking-wide lg:text-end mt-3 text-left md:text-justify md:pr-4"
                                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                            >
                                Viva momentos inesquecíveis e reconecte-se com o que realmente importa em nossos chalés de luxo integrados à Mata Atlântica.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
