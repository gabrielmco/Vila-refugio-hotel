import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { feedbackH1LG, feedbackReviewLG } from "../../constants/feedback";

import review1 from "../../assets/review1.webp";
import review2 from "../../assets/review2.webp";
import review3 from "../../assets/review3.webp";

const reviewImages = {
    review1,
    review2,
    review3
};

const Feedback = () => {
    const [index, setIndex] = useState(0);
    const total = feedbackH1LG.length;
    const avatarRef = useRef(null);
    const authorCopyRef = useRef(null);
    const lineRefs = useRef([]);
    const progressRef = useRef(null);
    const animatingRef = useRef(false);
    const timelineRef = useRef(null);

    const progressWidth = feedbackReviewLG[index][3];
    const initialProgressWidthRef = useRef(progressWidth);

    useEffect(() => {
        if (progressRef.current) {
            gsap.set(progressRef.current, { width: initialProgressWidthRef.current });
        }
        gsap.set(lineRefs.current.filter(Boolean), { yPercent: 0, opacity: 1 });

        return () => {
            timelineRef.current?.kill();
        };
    }, []);

    const goToReview = (nextIndex) => {
        if (animatingRef.current || nextIndex === index) return;
        animatingRef.current = true;

        const nextProgress = feedbackReviewLG[nextIndex][3];
        const currentLines = lineRefs.current.filter(Boolean);
        const authorEls = [avatarRef.current, authorCopyRef.current].filter(Boolean);
        timelineRef.current?.kill();

        const revealNext = () => {
            if (!animatingRef.current) return;

            lineRefs.current = [];
            flushSync(() => setIndex(nextIndex));

            const nextLines = lineRefs.current.filter(Boolean);
            const nextAuthorEls = [avatarRef.current, authorCopyRef.current].filter(Boolean);

            gsap.set(nextLines, {
                yPercent: 82,
                autoAlpha: 0,
                force3D: true,
            });
            gsap.set(avatarRef.current, {
                y: 18,
                scale: 1.14,
                autoAlpha: 0,
                force3D: true,
            });
            gsap.set(authorCopyRef.current, {
                y: 18,
                scale: 1,
                autoAlpha: 0,
                force3D: true,
            });

            requestAnimationFrame(() => {
                timelineRef.current = gsap.timeline({
                    defaults: { ease: "power4.out" },
                    onComplete: () => {
                        animatingRef.current = false;
                    }
                })
                    .to(nextLines, {
                        yPercent: 0,
                        autoAlpha: 1,
                        duration: 0.82,
                        stagger: 0.075,
                        ease: "power4.out"
                    })
                    .to(nextAuthorEls, {
                        y: 0,
                        scale: 1,
                        autoAlpha: 1,
                        duration: 0.78,
                        stagger: 0.07,
                        ease: "power4.out"
                    }, "<0.08");
            });
        };

        timelineRef.current = gsap.timeline({
            defaults: { ease: "power3.out" },
        })
            .to(currentLines, {
                yPercent: -82,
                autoAlpha: 0,
                duration: 0.34,
                stagger: 0.025,
                ease: "power4.inOut",
                force3D: true,
            }, 0)
            .to(authorEls, {
                y: -16,
                scale: (i) => i === 0 ? 0.62 : 1,
                autoAlpha: 0,
                duration: 0.34,
                stagger: 0.035,
                ease: "power3.inOut",
                force3D: true,
            }, 0.05)
            .to(progressRef.current, {
                width: nextProgress,
                duration: 0.95,
                ease: "power3.inOut"
            }, 0)
            .call(revealNext, null, 0.22);
    };

    const handleNext = () => {
        goToReview((index + 1) % total);
    };

    const handlePrev = () => {
        goToReview((index - 1 + total) % total);
    };

    return (
        <section id="depoimentos" className="w-screen h-dvh p-8 flex flex-col justify-center items-center">
            <div className="w-full text-left">
                <p className="text-[.7rem] font-bold text-[#eae5dd] activities-subtitle text-left">
                    O que dizem os nossos hospedes?
                </p>

                <div>
                    <h1 className="feedback-review-text text-[#f4efe7] text-7xl mt-4 mb-6">
                        {feedbackH1LG[index].map((line, i) => (
                            <span key={`${index}-${i}`} className="feedback-review-line">
                                <span ref={(el) => { lineRefs.current[i] = el; }}>
                                    {line}
                                </span>
                            </span>
                        ))}
                    </h1>
                </div>

                <div className="feedback-review-author flex items-center gap-4 mt-12">
                    <img
                        ref={avatarRef}
                        src={reviewImages[feedbackReviewLG[index][2]]}
                        alt="review img"
                        className="feedback-author-image"
                    />
                    <p ref={authorCopyRef} className="feedback-author-copy text-[#aca192] text-[0.7rem]">
                        {feedbackReviewLG[index][0]}<br />
                        ({feedbackReviewLG[index][1]})
                    </p>
                </div>

                <div className="flex justify-between items-center mt-14">
                    <div className="flex gap-1">
                        <button
                            onClick={handlePrev}
                            className="feedback-arrow-btn"
                            aria-label="Depoimento anterior"
                        >
                            <svg viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M4.46308 10.0184L23.3584 10.0184L23.3584 11.9625L4.46308 11.9625L12.6335 20.1329L11.2087 21.5576L0.641602 10.9905L11.1902 0.441866L12.5964 1.84802L4.46308 10.0184Z" fill="currentColor" />
                            </svg>
                        </button>

                        <button
                            onClick={handleNext}
                            className="feedback-arrow-btn"
                            aria-label="Proximo depoimento"
                        >
                            <svg viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M19.5369 11.9816L0.641607 11.9816L0.641607 10.0375L19.5369 10.0375L11.3665 1.8671L12.7913 0.442382L23.3584 11.0095L12.8098 21.5581L11.4036 20.152L19.5369 11.9816Z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>

                    <div className="feedback-progress-rail relative z-9">
                        <div
                            ref={progressRef}
                            className="feedback-progress-line progress-line absolute z-10"
                            style={{ width: progressWidth }}
                        ></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Feedback;
