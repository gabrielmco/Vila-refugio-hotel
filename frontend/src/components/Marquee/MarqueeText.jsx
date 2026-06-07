import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./marqueetext.css";

const MarqueeText = () => {
    const rootRef = useRef(null);
    const animationRef = useRef(null);
    const isForwardRef = useRef(true);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const rows = gsap.utils.toArray(root.querySelectorAll(".marquee-text-marquee"));
        const stars = gsap.utils.toArray(root.querySelectorAll(".star-rotate"));

        const startMarqueeAnimation = (direction = "forward") => {
            animationRef.current?.kill();

            animationRef.current = gsap.to(rows, {
                x: direction === "forward" ? "-200%" : "0%",
                duration: 10,
                repeat: -1,
                ease: "none",
                modifiers: {
                    x: gsap.utils.unitize((x) => parseFloat(x) % 100),
                },
            });

            gsap.to(stars, {
                rotation: direction === "forward" ? "+=110" : "-=110",
                duration: 0.5,
                ease: "power2.out",
            });
        };

        startMarqueeAnimation("forward");
        isForwardRef.current = true;

        const handleWheel = (event) => {
            const newDirection = event.deltaY > 0 ? "forward" : "reverse";
            const changedDirection =
                (newDirection === "forward" && !isForwardRef.current) ||
                (newDirection === "reverse" && isForwardRef.current);

            if (!changedDirection) return;
            isForwardRef.current = newDirection === "forward";
            startMarqueeAnimation(newDirection);
        };

        window.addEventListener("wheel", handleWheel, { passive: true });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            animationRef.current?.kill();
        };
    }, []);

    const marqueeItems = Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="marquee-text-marquee">
            <h1>
                Por que Vila Refúgio®?<span className="star-rotate">*</span>
            </h1>
        </div>
    ));

    return (
        <div ref={rootRef} className="marquee-text-container">
            <div className="marquee-text-move">{marqueeItems}</div>
        </div>
    );
};

export default MarqueeText;
