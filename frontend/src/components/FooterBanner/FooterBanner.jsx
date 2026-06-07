import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MdArrowOutward, MdClose } from "react-icons/md";
import ClickIndicator from "../MapLink/ClickIndicator";

import banner from "../../assets/chalet_vista.webp";
import chaletFloresta from "../../assets/chalet_floresta.webp";
import chaletLago from "../../assets/chalet_lago.webp";
import chaletVista from "../../assets/chalet_vista.webp";

const stayOptions = [
    {
        label: "Clássico",
        image: chaletFloresta,
        stay: "29.05 - 03.06",
        price: "8600 BRL",
    },
    {
        label: "Vista",
        image: chaletVista,
        stay: "02.06 - 07.06",
        price: "12400 BRL",
    },
    {
        label: "Lago",
        image: chaletLago,
        stay: "08.06 - 12.06",
        price: "10000 BRL",
    },
];

const stayExtras = ["Café na varanda", "Spa privativo", "Jantar no piano bar"];

const FooterCtaModal = ({ open, onClose }) => {
    const [step, setStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState(0);
    const [selectedExtra, setSelectedExtra] = useState(0);
    const shellRef = useRef(null);
    const grayRef = useRef(null);
    const panelRef = useRef(null);
    const contentRef = useRef(null);
    const imageRef = useRef(null);
    const timelineRef = useRef(null);

    const selected = stayOptions[selectedOption];

    useEffect(() => {
        if (!open) {
            setStep(0);
            setSelectedOption(0);
            setSelectedExtra(0);
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        gsap.set(shellRef.current, { pointerEvents: "auto", opacity: 1 });
        gsap.set(grayRef.current, { opacity: 0 });
        gsap.set(panelRef.current, { xPercent: 105, opacity: 1 });
        gsap.set(contentRef.current, { y: 28, opacity: 0 });
        gsap.set(imageRef.current, { scale: 1.08, opacity: 0 });

        timelineRef.current?.kill();
        timelineRef.current = gsap.timeline({ defaults: { ease: "power3.inOut" } })
            .to(grayRef.current, { opacity: 1, duration: 0.48 })
            .to(panelRef.current, { xPercent: 0, duration: 0.9 }, "-=0.28")
            .to(contentRef.current, { y: 0, opacity: 1, duration: 0.72, ease: "power3.out" }, "-=0.24")
            .to(imageRef.current, { scale: 1, opacity: 1, duration: 0.78, ease: "power3.out" }, "-=0.52");

        return () => {
            timelineRef.current?.kill();
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    useEffect(() => {
        if (!open || !contentRef.current) return;

        gsap.fromTo(contentRef.current,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.56, ease: "power3.out" }
        );
    }, [step, open]);

    useEffect(() => {
        if (!open || !imageRef.current) return;

        gsap.fromTo(imageRef.current,
            { scale: 1.08, opacity: 0.72 },
            { scale: 1, opacity: 1, duration: 0.58, ease: "power3.out" }
        );
    }, [selectedOption, open]);

    const closeModal = () => {
        timelineRef.current?.kill();
        timelineRef.current = gsap.timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: onClose,
        })
            .to(contentRef.current, { y: 22, opacity: 0, duration: 0.42 })
            .to(panelRef.current, { xPercent: 105, duration: 0.72 }, "-=0.08")
            .to(grayRef.current, { opacity: 0, duration: 0.48 }, "-=0.2")
            .to(shellRef.current, { opacity: 0, duration: 0.24 }, "-=0.18");
    };

    if (!open) return null;

    return createPortal(
        <div ref={shellRef} className="footer-cta-modal" role="dialog" aria-modal="true">
            <div ref={grayRef} className="footer-cta-modal-gray" />
            <aside ref={panelRef} className={`footer-cta-panel ${step === 1 ? "is-confirm" : ""}`}>
                <button type="button" className="footer-cta-close" onClick={closeModal} aria-label="Fechar">
                    <MdClose />
                </button>

                <div ref={contentRef} className="footer-cta-content">
                    {step === 0 ? (
                        <>
                            <h2>Reserve sua estadia memorável na Vila Refúgio®</h2>
                            <p>
                                Escolha o chalé ideal e uma experiência extra para montar uma estadia
                                com calma, conforto e natureza ao redor.
                            </p>

                            <div className="footer-cta-options" aria-label="Escolha do chalé">
                                {stayOptions.map((item, index) => (
                                    <button
                                        type="button"
                                        className={index === selectedOption ? "selected" : ""}
                                        key={item.label}
                                        aria-pressed={index === selectedOption}
                                        onClick={() => setSelectedOption(index)}
                                    >
                                        <img src={item.image} alt="" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="footer-cta-extras" aria-label="Experiências extras">
                                {stayExtras.map((item, index) => (
                                    <button
                                        type="button"
                                        className={index === selectedExtra ? "selected" : ""}
                                        key={item}
                                        aria-pressed={index === selectedExtra}
                                        onClick={() => setSelectedExtra(index)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>

                            <div className="footer-cta-bottom">
                                <div>
                                    <span>Estadia</span>
                                    <strong>{selected.stay}</strong>
                                </div>
                                <div>
                                    <span>Valor</span>
                                    <strong>{selected.price}</strong>
                                </div>
                                <button type="button" className="footer-cta-next" onClick={() => setStep(1)}>
                                    <span className="footer-cta-next-text">
                                        <span>Próximo</span>
                                        <span>Confirmar</span>
                                    </span>
                                    <i><MdArrowOutward /></i>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="footer-cta-confirm">
                            <div className="footer-cta-confirm-copy">
                                <h2>Pedido reservado para o Chalé {selected.label}.</h2>
                                <p>
                                    Experiência selecionada: {stayExtras[selectedExtra]}. Um consultor entrará
                                    em contato para confirmar datas, preferências e detalhes da chegada.
                                </p>
                                <div className="footer-cta-actions">
                                    <a href="mailto:hello@moyra.co">Contato <MdArrowOutward /></a>
                                    <button type="button" onClick={() => setStep(0)}>Editar <MdArrowOutward /></button>
                                </div>
                            </div>
                            <div className="footer-cta-confirm-capsules" aria-label="Chalés selecionáveis">
                                {stayOptions.map((item, optionIndex) => (
                                    <button
                                        type="button"
                                        key={item.label}
                                        className={optionIndex === selectedOption ? "selected" : ""}
                                        aria-pressed={optionIndex === selectedOption}
                                        onClick={() => setSelectedOption(optionIndex)}
                                    >
                                        <img src={item.image} alt="" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {step === 0 ? (
                    <img ref={imageRef} src={selected.image} className="footer-cta-panel-image" alt="Vila Refúgio ao entardecer" />
                ) : null}
            </aside>
        </div>,
        document.body
    );
};

const FooterBanner = () => {
    const [active, setActive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const fbConRef = useRef(null);
    const fbImgRef = useRef(null);

    useGSAP(() => {
        if (!fbConRef.current || !fbImgRef.current) return;

        gsap.fromTo(fbImgRef.current,
            { scale: 1.2 },
            {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: fbConRef.current,
                    start: "top bottom-=20%",
                    end: "bottom top+=20%",
                    scrub: true,
                },
            }
        );
    }, { scope: fbConRef });

    return (
        <div id="contato" ref={fbConRef} className="w-screen h-dvh p-2 overflow-hidden">
            <div
                className="w-full relative overflow-hidden rounded-4xl h-full cursor-none"
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
                onClick={() => {
                    setActive(false);
                    setModalOpen(true);
                }}
            >
                <ClickIndicator active={active} text="Reservar agora" />
                <img
                    ref={fbImgRef}
                    src={banner}
                    alt=""
                    className="w-full h-full object-cover pointer-events-none"
                />

                <h1 className="footer-banner-title absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(3.6rem,9.4vw,10.5rem)] font-bold text-[#f4efe7] z-1 whitespace-nowrap pointer-events-none">
                    Vila Refúgio<sub className="text-[5vw]">®</sub>
                </h1>
                <div className="absolute bottom-5 px-4 w-full z-2 pointer-events-none">
                    <div className="w-full h-auto flex md:flex-row flex-col md:justify-between md:items-end">
                        <h2
                            className="text-start lg:mt-0 md:text-[#f4efe7] text-[#b1a696] text-2xl font-bold md:tracking-wider leading-5 flex flex-col gap-1"
                            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                        >
                            <span>Mais perto da</span>
                            <span>natureza - Mais perto</span>
                            <span>de você</span>
                        </h2>

                        <p
                            className="md:w-[20%] w-[80%] text-[#f4efe7] text-[0.7rem] font-bold md:font-medium tracking-wide lg:text-end mt-2 text-justify"
                            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                        >
                            Viva momentos inesquecíveis e recarregue suas energias em meio à natureza brasileira com a Vila Refúgio.
                        </p>
                    </div>
                </div>
            </div>
            <FooterCtaModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default FooterBanner;
