import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import "./footertitle.css";

gsap.registerPlugin(SplitText, ScrollTrigger);

const FooterTitle = () => {
    const ftConRef = useRef(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useGSAP(() => {
        const root = ftConRef.current;
        if (!root) return;

        const h1 = root.querySelector(".footer-title h1");
        const originalHTML = h1?.innerHTML || "";
        let splitObj = null;
        let tween = null;

        document.fonts.ready.then(() => {
            if (!ftConRef.current || !mountedRef.current) return;

            const split = new SplitText(h1, {
                type: "chars",
                charsClass: "ftChar",
                exclude: "sub",
            });
            splitObj = split;

            split.chars.forEach((char) => {
                char.innerHTML = `<span>${char.innerHTML}</span>`;
            });

            const innerChars = split.chars.map((char) => char.querySelector("span"));
            const sub = root.querySelector(".footer-title sub");
            if (sub) {
                sub.innerHTML = `<span>${sub.innerHTML}</span>`;
                innerChars.push(sub.querySelector("span"));
            }

            const targets = innerChars.filter(Boolean);
            gsap.set(targets, { x: "-120%" });

            tween = gsap.to(targets, {
                x: "0%",
                stagger: 0.045,
                duration: 1.6,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: root,
                    start: "top 100%",
                    end: "top 35%",
                    scrub: 1.8,
                    refreshPriority: 120,
                },
            });
        });

        return () => {
            tween?.scrollTrigger?.kill();
            tween?.kill();
            splitObj?.revert();
            const currentH1 = ftConRef.current?.querySelector(".footer-title h1");
            if (currentH1) currentH1.innerHTML = originalHTML;
        };
    }, { scope: ftConRef });

    return (
        <section ref={ftConRef} className="relative z-1 w-screen h-[52vh] overflow-visible border-1 border-t-[#c4c1b9]">
            <div className="w-full flex justify-between items-center px-6 mt-8">
                <p className="text-[#b1a696] text-[0.7rem]">
                    Website made by <a href="#" className="text-[#f2ede5]">Moyra.co</a>
                </p>
                <p className="text-[#b1a696] text-[0.7rem]">
                    Este site utiliza <a href="#" className="text-[#f2ede5]">cookies</a>
                </p>
                <p className="text-[#b1a696] text-[0.7rem]">
                    Todos os direitos reservados {"\u00A9"} <a href="#" className="text-[#f2ede5]">2026</a>
                </p>
            </div>

            <div className="footer-title w-full text-center">
                <h1 className="text-[14vw] font-bold">
                    Vila Refúgio<sub>{"\u00AE"}</sub>
                </h1>
            </div>
        </section>
    );
};

export default FooterTitle;
