import React, { useState, useEffect, useRef } from "react";
import { MdArrowOutward } from "react-icons/md";
import AnimateBtn from "./AnimateBtn";

const ReserveBtn = () => {
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    const handleScrollToReserve = () => {
        const element = document.getElementById("contato");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // 1. Always visible at the very top of the page
            if (currentScrollY < 150) {
                setVisible(true);
            } else {
                // 2. Show when scrolling up, hide when scrolling down
                if (currentScrollY < lastScrollY.current) {
                    setVisible(true);
                } else if (currentScrollY > lastScrollY.current) {
                    setVisible(false);
                }
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative z-49">
            <div 
                onClick={handleScrollToReserve}
                className={`reserve-floating-btn fixed right-6 top-[2vw] w-[8.5vw] bg-[#f4efe7] px-1 py-1 hidden md:flex justify-end items-center rounded-4xl gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 shadow-md ${
                    visible 
                        ? "opacity-100 translate-y-0 pointer-events-auto" 
                        : "opacity-0 -translate-y-10 pointer-events-none"
                }`}
            >
                <AnimateBtn btnName="Reservar"/>
                <MdArrowOutward className="bg-[#2a2725] text-[#b3a694] w-[2.5vw] h-auto rounded-full p-1" />
            </div>
        </div>
    );
};

export default ReserveBtn;
