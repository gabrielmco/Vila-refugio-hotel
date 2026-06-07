import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './gallery.css';
import { BsFillPlusCircleFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { requestScrollRefresh, waitForStableLayout } from '../../lib/scrollRefresh';

import gbg1 from '../../assets/chalet_floresta.webp';
import gbg2 from '../../assets/chalet_lago.webp';
import gbg3 from '../../assets/chalet_vista.webp';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const chaletDetailsData = {
    floresta: {
        title: "Chalé Floresta",
        subtitle: "(Chalé Floresta®)",
        image: gbg1,
        desc: "O Chalé Floresta eleva a sofisticação com design minimalista em madeira, criando um refúgio de paz perfeitamente integrado à mata tropical da Serra da Mantiqueira.",
        specs: [
            { label: "Square footage", value: "35m²" },
            { label: "Bed", value: "King Size" },
            { label: "Fireplace", value: "Available" },
            { label: "Air Conditioning", value: "Available" },
            { label: "Private Deck", value: "Available" },
            { label: "Luxury Linen", value: "600 Thread Count" }
        ],
        cost: "R$ 1.800 / Night"
    },
    lago: {
        title: "Chalé Lago",
        subtitle: "(Chalé Lago®)",
        image: gbg2,
        desc: "O Chalé Lago une rusticidade e conforto extremo, com um amplo deck privativo de madeira debruçado sobre águas calmas e reflexivas.",
        specs: [
            { label: "Square footage", value: "42m²" },
            { label: "Bed", value: "Super King Size" },
            { label: "Fireplace", value: "Available" },
            { label: "Air Conditioning", value: "Available" },
            { label: "Deck Suspended", value: "Available" },
            { label: "Ofurô Tub", value: "Available" }
        ],
        cost: "R$ 2.200 / Night"
    },
    vista: {
        title: "Chalé Vista",
        subtitle: "(Chalé Vista®)",
        image: gbg3,
        desc: "O Chalé Vista é um santuário luxuoso nas alturas, proporcionando vista panorâmica de 360° da serra com um relaxante ofurô privativo.",
        specs: [
            { label: "Square footage", value: "50m²" },
            { label: "Bed", value: "Super King Premium" },
            { label: "Private Ofurô", value: "Available" },
            { label: "Air Conditioning", value: "Available" },
            { label: "Panoramic 360° View", value: "Available" },
            { label: "Outdoor Fireplace", value: "Available" }
        ],
        cost: "R$ 2.800 / Night"
    }
};

const Gallery = () => {
    const pageRef = useRef(null);
    const [activeChalet, setActiveChalet] = useState(null);
    const [renderedChalet, setRenderedChalet] = useState(null);
    const [clickCoords, setClickCoords] = useState({ x: 0, y: 0 });

    const overlayRef = useRef(null);
    const cardRef = useRef(null);
    const closeBtnRef = useRef(null);

    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // Lock page scroll when details are active
    useEffect(() => {
        if (activeChalet !== null) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, [activeChalet]);

    const handlePlusClick = (e, chaletKey) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setClickCoords({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
        setRenderedChalet(chaletKey);
        setActiveChalet(chaletKey);
    };

    const handleClose = () => {
        if (!cardRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setActiveChalet(null);
                setRenderedChalet(null);
            }
        });

        const specsAndText = cardRef.current.querySelectorAll(
            ".gallery-modal-header, .gallery-modal-desc, .gallery-modal-row, .gallery-modal-cta, .gallery-modal-cost-container"
        );

        tl.to(specsAndText, {
            opacity: 0,
            y: -15,
            duration: 0.35,
            stagger: 0.03,
            ease: "power2.in"
        });

        tl.to(closeBtnRef.current, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
        }, "<");

        tl.to(cardRef.current, {
            clipPath: "inset(0% 100% 0% 0% round 2rem)",
            scale: 0.15,
            opacity: 0,
            duration: 0.8,
            ease: "power3.inOut"
        }, "-=0.15");

        tl.to(overlayRef.current, {
            opacity: 0,
            pointerEvents: "none",
            duration: 0.4,
            ease: "power2.in"
        }, "-=0.35");
    };

    // Trigger open animation when renderedChalet becomes a non-null value (fully mounted in DOM)
    useEffect(() => {
        if (renderedChalet !== null && cardRef.current && overlayRef.current) {
            const tl = gsap.timeline();

            const specsAndText = cardRef.current.querySelectorAll(
                ".gallery-modal-header, .gallery-modal-desc, .gallery-modal-row, .gallery-modal-cta, .gallery-modal-cost-container"
            );

            // Set initial state
            gsap.set(overlayRef.current, {
                opacity: 0,
                pointerEvents: "none"
            });
            gsap.set(cardRef.current, {
                clipPath: "inset(0% 100% 0% 0% round 2rem)",
                scale: 0.15,
                opacity: 0
            });
            gsap.set(specsAndText, {
                opacity: 0,
                y: 15
            });
            gsap.set(closeBtnRef.current, {
                scale: 0,
                opacity: 0
            });

            // 1. Overlay fades in
            tl.to(overlayRef.current, {
                opacity: 1,
                pointerEvents: "auto",
                duration: 0.4,
                ease: "power2.out"
            });

            // 2. Card wipes left-to-right and scales up from button origin
            tl.to(cardRef.current, {
                clipPath: "inset(0% 0% 0% 0% round 2rem)",
                scale: 1,
                opacity: 1,
                duration: 0.95,
                ease: "power4.inOut"
            }, "-=0.25");

            // 3. Close button morphs on top of the original plus coordinates
            tl.to(closeBtnRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(1.5)"
            }, "-=0.5");

            // 4. Specs and title texts stagger reveal
            tl.to(specsAndText, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.05,
                ease: "power2.out"
            }, "-=0.35");
        }
    }, [renderedChalet]);

    const currentSlideRef = useRef(0);

    useEffect(() => {
        let ctx = null;
        let cancelled = false;

        const setupGalleryScroll = async () => {
            await waitForStableLayout(pageRef.current, {
                imageSources: [gbg1, gbg2, gbg3],
                delay: 80
            });
            if (cancelled || !pageRef.current) return;

            const compactLayout = window.matchMedia("(max-width: 1024px)").matches;
            if (compactLayout) {
                gsap.set(pageRef.current.querySelectorAll(".gallery-marquee-track, .gallery-background, .gallery-background2, .gallery-topText, .gallery-bottomText"), {
                    clearProps: "all"
                });
                currentSlideRef.current = 3;
                requestScrollRefresh();
                return;
            }

            ctx = gsap.context(() => {
                const q = gsap.utils.selector(pageRef.current);
                const pick = (...selectors) => selectors.flatMap((selector) => q(selector));

                gsap.set(q(".gallery-marquee-track"), { opacity: 1 });
                gsap.set(q(".gallery-background"), {
                    yPercent: 0,
                    scale: 0.34,
                    transformOrigin: "center center",
                    opacity: 1,
                    zIndex: 2,
                    force3D: true
                });
                gsap.set(q("#gallery-second, #gallery-third"), {
                    yPercent: 110,
                    scale: 1.04,
                    transformOrigin: "center center",
                    opacity: 1,
                    zIndex: 3,
                    force3D: true
                });
                gsap.set(q(".gallery-background img"), { scale: 1.08, yPercent: 0, force3D: true });
                gsap.set(q("#gallery-second img, #gallery-third img"), { scale: 1.12, yPercent: 4, force3D: true });
                gsap.set(pick(
                    ".gallery-background .gallery-topText h4",
                    ".gallery-background .gallery-topText h3",
                    ".gallery-background .gallery-bottomText"
                ), {
                    opacity: 0,
                    x: 50
                });
                gsap.set(pick(
                    "#gallery-second .gallery-topText h4",
                    "#gallery-second .gallery-topText h3",
                    "#gallery-second .gallery-bottomText",
                    "#gallery-third .gallery-topText h4",
                    "#gallery-third .gallery-topText h3",
                    "#gallery-third .gallery-bottomText"
                ), {
                    opacity: 0,
                    x: 50
                });

            const masterTl = gsap.timeline({
                scrollTrigger: {
                    trigger: pageRef.current,
                    start: "top top",
                    end: () => `+=${Math.round(Math.max(window.innerHeight * 4.8, 5200))}`,
                    pin: true,
                    pinSpacing: true,
                    pinType: "fixed",
                    invalidateOnRefresh: true,
                    refreshPriority: 3000,
                    scrub: 1.25,
                    anticipatePin: 1.25,
                    onUpdate: (self) => {
                        const prog = self.progress;
                        const slide = prog < 0.28 ? 0 : prog < 0.57 ? 1 : prog < 0.86 ? 2 : 3;
                        if (slide !== currentSlideRef.current) {
                            currentSlideRef.current = slide;
                        }
                    }
                }
            });

            // Intro: capsule expands over the kinetic marquee without changing layout size.
            masterTl
                .to(q(".gallery-background"), {
                    scale: 1,
                    force3D: true,
                    duration: 1.2,
                    ease: "none"
                }, 0)
                .to(q(".gallery-background img"), { scale: 1.12, yPercent: -3, force3D: true, duration: 1.2, ease: "none" }, 0)
                .to(q(".gallery-marquee-track"), {
                    opacity: 0,
                    duration: 0.55,
                    ease: "none"
                }, 0.55)
                .to(pick(
                    ".gallery-background .gallery-topText h4",
                    ".gallery-background .gallery-topText h3",
                    ".gallery-background .gallery-bottomText"
                ), {
                    opacity: 1,
                    x: 0,
                    stagger: 0.08,
                    duration: 0.4,
                    ease: "none"
                }, 1.05)
                .to(q(".gallery-background img"), { scale: 1.12, yPercent: -4, force3D: true, duration: 0.8, ease: "none" }, 1.2)
                .to(pick(
                    ".gallery-background .gallery-topText h4",
                    ".gallery-background .gallery-topText h3",
                    ".gallery-background .gallery-bottomText"
                ), {
                    opacity: 0,
                    x: 50,
                    stagger: 0.05,
                    duration: 0.3,
                    ease: "none"
                }, 2.0)
                .to(q(".gallery-background"), {
                    scale: 1,
                    opacity: 0,
                    force3D: true,
                    duration: 0.8,
                    ease: "none"
                }, 2.1)
                .to(q("#gallery-second"), {
                    yPercent: 0,
                    scale: 1,
                    force3D: true,
                    duration: 0.72,
                    ease: "none"
                }, 2.0)
                .to(q("#gallery-second img"), {
                    scale: 1.12,
                    yPercent: -4,
                    force3D: true,
                    duration: 0.72,
                    ease: "none"
                }, 2.0)
                .to(pick(
                    "#gallery-second .gallery-topText h4",
                    "#gallery-second .gallery-topText h3",
                    "#gallery-second .gallery-bottomText"
                ), {
                    opacity: 1,
                    x: 0,
                    stagger: 0.08,
                    duration: 0.4,
                    ease: "none"
                }, 2.72)

                .to(pick(
                    "#gallery-second .gallery-topText h4",
                    "#gallery-second .gallery-topText h3",
                    "#gallery-second .gallery-bottomText"
                ), {
                    opacity: 0,
                    x: 50,
                    stagger: 0.05,
                    duration: 0.3,
                    ease: "none"
                }, 3.7)
                .to(q("#gallery-second"), {
                    scale: 1,
                    opacity: 0,
                    force3D: true,
                    duration: 0.8,
                    ease: "none"
                }, 3.8)
                .to(q("#gallery-third"), {
                    yPercent: 0,
                    scale: 1,
                    force3D: true,
                    duration: 0.72,
                    ease: "none"
                }, 3.7)
                .to(q("#gallery-third img"), {
                    scale: 1.12,
                    yPercent: -4,
                    force3D: true,
                    duration: 0.72,
                    ease: "none"
                }, 3.7)
                .to(pick(
                    "#gallery-third .gallery-topText h4",
                    "#gallery-third .gallery-topText h3",
                    "#gallery-third .gallery-bottomText"
                ), {
                    opacity: 1,
                    x: 0,
                    stagger: 0.08,
                    duration: 0.4,
                    ease: "none"
                }, 4.42)
                .set(q("#gallery-third"), { opacity: 1, yPercent: 0, scale: 1 })
                .to({}, { duration: 0.35 });
            }, pageRef);

            requestScrollRefresh();
        };

        setupGalleryScroll();

        return () => {
            cancelled = true;
            if (ctx) ctx.revert();
        };
    }, []);

    // Generate repeating Capsules® elements for Flex Marquee
    const generateCapsules = (quantity = 4) => {
        const capsules = [];
        for (let i = 1; i <= quantity; i++) {
            capsules.push(
                <h3 key={i} className='tracking-tighter select-none'>
                    Vila Refúgio
                </h3>
            );
        }
        return capsules;
    };

    const isMobile = window.innerWidth < 640;
    const cardStyle = isMobile ? {} : {
        position: "fixed",
        left: `${Math.max(24, Math.min(clickCoords.x - 24, window.innerWidth - 410))}px`,
        top: `${Math.max(24, clickCoords.y - 535)}px`,
        transformOrigin: "bottom left"
    };

    const closeBtnStyle = isMobile ? {} : {
        position: "fixed",
        left: `${clickCoords.x}px`,
        top: `${clickCoords.y}px`,
        transform: "translate(-50%, -50%)",
        marginTop: 0
    };

    return (
        <section id="chales" className="gallery-page4" ref={pageRef}>
            <div className="gallery-pin-stage">
            <div className="gallery-slider">
                <div className="gallery-marquee-track">
                    <div className="gallery-marquee-content">
                        {generateCapsules(4)}
                    </div>
                    <div className="gallery-marquee-content" aria-hidden="true">
                        {generateCapsules(4)}
                    </div>
                </div>
            </div>

            <div className="gallery-background">
                <img src={gbg1} alt="Chalé Floresta" />
                <div className="gallery-topText">
                    <h4>Chalé Floresta®</h4>
                    <h3>(Scroll)</h3>
                </div>
                <div className="gallery-bottomText">
                    <div className='w-full flex justify-center items-center gap-0'>
                        <button
                            className="cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90 mr-3 flex-shrink-0 bg-transparent border-none p-0 flex items-center justify-center"
                            onClick={(e) => handlePlusClick(e, 'floresta')}
                            aria-label="Ver Detalhes do Chalé Floresta"
                        >
                            <BsFillPlusCircleFill className='w-8 h-8 text-[#b1a696] hover:text-[#f4efe7] transition-colors duration-300' />
                        </button>
                        <h3>O Chalé Floresta eleva a sofisticação com design minimalista em madeira, <br /> criando um refúgio de paz perfeitamente integrado à mata tropical.</h3>
                    </div>
                    <div className="gallery-progress-rail relative z-9">
                        <div className="progress-line absolute z-10 bg-[#f4efe7] w-[33%] h-[0.1rem] top-1/2 -translate-y-1/2 left-0"></div>
                    </div>
                </div>
            </div>

            <div id="gallery-second" className="gallery-background2">
                <img src={gbg2} alt="Chalé Lago" />
                <div className="gallery-topText">
                    <h4>Chalé Lago®</h4>
                    <h3>(Scroll)</h3>
                </div>
                <div className="gallery-bottomText">
                    <div className='w-full flex justify-center items-center gap-0'>
                        <button
                            className="cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90 mr-3 flex-shrink-0 bg-transparent border-none p-0 flex items-center justify-center"
                            onClick={(e) => handlePlusClick(e, 'lago')}
                            aria-label="Ver Detalhes do Chalé Lago"
                        >
                            <BsFillPlusCircleFill className='w-8 h-8 text-[#b1a696] hover:text-[#f4efe7] transition-colors duration-300' />
                        </button>
                        <h3>O Chalé Lago une rusticidade e conforto extremo, com um amplo <br /> deck privativo de madeira debruçado sobre águas calmas e reflexivas.</h3>
                    </div>
                    <div className="gallery-progress-rail relative z-9">
                        <div className="progress-line absolute z-10 bg-[#f4efe7] w-[67%] h-[0.1rem] top-1/2 -translate-y-1/2 left-0"></div>
                    </div>
                </div>
            </div>

            <div id="gallery-third" className="gallery-background2">
                <img src={gbg3} alt="Chalé Vista" />
                <div className="gallery-topText">
                    <h4>Chalé Vista®</h4>
                    <h3>(Scroll)</h3>
                </div>
                <div className="gallery-bottomText">
                    <div className='w-full flex justify-center items-center gap-0'>
                        <button
                            className="cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90 mr-3 flex-shrink-0 bg-transparent border-none p-0 flex items-center justify-center"
                            onClick={(e) => handlePlusClick(e, 'vista')}
                            aria-label="Ver Detalhes do Chalé Vista"
                        >
                            <BsFillPlusCircleFill className='w-8 h-8 text-[#b1a696] hover:text-[#f4efe7] transition-colors duration-300' />
                        </button>
                        <h3>O Chalé Vista é um santuário luxuoso nas alturas, proporcionando <br /> vista panorâmica de 360° da serra com um relaxante ofurô privativo.</h3>
                    </div>
                    <div className="gallery-progress-rail relative z-9">
                        <div className="progress-line absolute z-10 bg-[#f4efe7] w-[100%] h-[0.1rem] top-1/2 -translate-y-1/2 left-0"></div>
                    </div>
                </div>
            </div>

            </div>

            {/* Portal-rendered Chalet Details Modal (Matching Image 2 Aesthetic) */}
            {createPortal(
                <div
                    ref={overlayRef}
                    className={`gallery-modal-overlay ${renderedChalet !== null ? "active" : ""}`}
                    onClick={handleClose}
                >
                    {renderedChalet !== null && (
                        <>
                            <div
                                ref={cardRef}
                                className="gallery-modal-card"
                                style={cardStyle}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="gallery-modal-header">
                                    <div className="gallery-modal-title-area">
                                        <h2 className="gallery-modal-title">Details</h2>
                                        <span className="gallery-modal-subtitle">
                                            {chaletDetailsData[renderedChalet].subtitle}
                                        </span>
                                    </div>
                                    <img
                                        className="gallery-modal-thumb"
                                        src={chaletDetailsData[renderedChalet].image}
                                        alt={chaletDetailsData[renderedChalet].title}
                                    />
                                </div>

                                <p className="gallery-modal-desc">
                                    {chaletDetailsData[renderedChalet].desc}
                                </p>

                                <div className="gallery-modal-specs">
                                    {chaletDetailsData[renderedChalet].specs.map((spec, idx) => (
                                        <div key={idx} className="gallery-modal-row">
                                            <span className="gallery-modal-label">{spec.label}</span>
                                            <span className="gallery-modal-val">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="gallery-modal-cta"
                                    onClick={() => {
                                        handleClose();
                                        // Smoothly scroll down to contact section
                                        setTimeout(() => {
                                            const contactEl = document.getElementById("contato");
                                            if (contactEl) {
                                                contactEl.scrollIntoView({ behavior: "smooth" });
                                            }
                                        }, 500);
                                    }}
                                >
                                    Ready to reserve?
                                </button>

                                <div className="gallery-modal-cost-container">
                                    <span className="gallery-modal-cost-label">Cost</span>
                                    <span className="gallery-modal-cost-val">
                                        {chaletDetailsData[renderedChalet].cost}
                                    </span>
                                </div>
                            </div>
                            <button
                                ref={closeBtnRef}
                                className="gallery-modal-close-btn"
                                style={closeBtnStyle}
                                onClick={handleClose}
                                aria-label="Fechar Detalhes"
                            >
                                <IoMdClose size={18} />
                            </button>
                        </>
                    )}
                </div>,
                document.body
            )}
        </section>
    );
};

export default Gallery;
