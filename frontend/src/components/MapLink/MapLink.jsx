import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import ClickIndicator from "./ClickIndicator";
import chaletImage from "../../assets/chalet_lago.webp";
import vistaImage from "../../assets/chalet_vista.webp";
import { scrollToTarget } from "../../lib/smoothScroll";

const mapSrc =
    "https://www.openstreetmap.org/export/embed.html?bbox=-46.850%2C-23.300%2C-44.150%2C-21.150&layer=mapnik&marker=-22.385%2C-45.260";

const scrollToContact = () => {
    const target = document.getElementById("contato");
    if (!target) return;
    scrollToTarget(target, { lock: true });
};

const MapOverlay = ({ open, onClose }) => {
    const rootRef = useRef(null);
    const frameRef = useRef(null);
    const cardRef = useRef(null);
    const timelineRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.body.classList.add("map-overlay-active");
        window.dispatchEvent(new CustomEvent("vila-map-open"));

        gsap.set(rootRef.current, { pointerEvents: "auto" });
        gsap.set(frameRef.current, {
            clipPath: "circle(0% at 50% 50%)",
            opacity: 1,
            scale: 1.02,
        });
        gsap.set(cardRef.current, { x: -48, y: -18, scale: 0.96, opacity: 0 });

        timelineRef.current?.kill();
        timelineRef.current = gsap
            .timeline({ defaults: { ease: "power3.inOut" } })
            .to(frameRef.current, {
                clipPath: "circle(78vmax at 50% 50%)",
                scale: 1,
                duration: 2.15,
            })
            .to(cardRef.current, {
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 1.15,
                ease: "power3.out",
            }, "-=0.12");

        return () => {
            timelineRef.current?.kill();
            document.body.style.overflow = previousOverflow;
            document.body.classList.remove("map-overlay-active");
            window.dispatchEvent(new CustomEvent("vila-map-close"));
        };
    }, [open]);

    const handleClose = () => {
        window.dispatchEvent(new CustomEvent("vila-map-closing"));
        timelineRef.current?.kill();
        timelineRef.current = gsap
            .timeline({
                defaults: { ease: "power3.inOut" },
                onComplete: onClose,
            })
            .to(cardRef.current, {
                y: 22,
                opacity: 0,
                scale: 0.96,
                duration: 0.68,
            })
            .to(frameRef.current, {
                clipPath: "circle(0% at 50% 50%)",
                scale: 1.02,
                duration: 1.18,
            }, "-=0.02");
    };

    useEffect(() => {
        if (!open) return undefined;
        window.addEventListener("vila-map-request-close", handleClose);
        return () => window.removeEventListener("vila-map-request-close", handleClose);
    });

    if (!open) return null;

    return createPortal(
        <div ref={rootRef} className="map-overlay-shell" aria-modal="true" role="dialog">
            <div ref={frameRef} className="map-overlay-map">
                <iframe
                    title="Mapa interno da Vila Refúgio"
                    src={mapSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

            <article ref={cardRef} className="map-overlay-card">
                <h2>Vila Refúgio®</h2>
                <p>
                    Serra da Mantiqueira
                    <br />
                    Brasil
                </p>
                <a
                    href="#contato"
                    onClick={(event) => {
                        event.preventDefault();
                        handleClose();
                        window.setTimeout(scrollToContact, 1400);
                    }}
                >
                    Pronto para reservar?
                </a>
                <div className="map-overlay-card-images">
                    <img src={chaletImage} alt="Chalé iluminado na serra" />
                    <img src={vistaImage} alt="Vista da Serra da Mantiqueira" />
                </div>
            </article>

        </div>,
        document.body
    );
};

const MapLink = () => {
    const [active, setActive] = useState(false);
    const [mapOpen, setMapOpen] = useState(false);

    return (
        <section className="w-screen h-[85vh] bg-[#181717] flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="max-w-[85vw] md:max-w-[70vw] flex flex-col items-center">
                <p className="text-[0.8rem] font-bold text-[#a79c8d] tracking-[0.2em] uppercase mb-8">
                    Mais perto do que você imagina
                </p>

                <h1 className="text-[4.8vw] md:text-[3.8vw] leading-[1.3] tracking-tight text-[#f4efe7] font-medium">
                    Nossos chalés na Vila Refúgio®<br />
                    estão situados na belíssima Serra da<br />
                    Mantiqueira, com facílimo<br />
                    <button
                        type="button"
                        onMouseEnter={() => setActive(true)}
                        onMouseLeave={() => setActive(false)}
                        onClick={() => {
                            setActive(false);
                            setMapOpen(true);
                        }}
                        className="map-inline-trigger inline-block cursor-none"
                    >
                        acesso de carro.
                    </button>
                </h1>
            </div>

            <ClickIndicator active={active} text="Ver mapa" />
            <MapOverlay open={mapOpen} onClose={() => setMapOpen(false)} />
        </section>
    );
};

export default MapLink;
