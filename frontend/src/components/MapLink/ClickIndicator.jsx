import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import "./overlay.css";
import { MdArrowOutward } from "react-icons/md";

const ClickIndicator = ({ active, text = "Ver no mapa" }) => {
    const ref = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const currentPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Track mouse coordinates continuously across the window
        const updateMouse = (e) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
        };

        window.addEventListener("mousemove", updateMouse);
        return () => window.removeEventListener("mousemove", updateMouse);
    }, []);

    useEffect(() => {
        // High-performance elastic mouse follower loop using mathematical interpolation (LERP)
        let animationFrameId;
        const lerp = (a, b, n) => (1 - n) * a + n * b;

        const animate = () => {
            if (ref.current) {
                const el = ref.current;
                const w = el.offsetWidth;
                const h = el.offsetHeight;

                // 0.15 factor gives the signature "floaty/magnetic" inertia look of Awwwards sites
                currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.15);
                currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.15);

                el.style.left = `${currentPos.current.x - w / 2}px`;
                el.style.top = `${currentPos.current.y - h / 2}px`;
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Kept mounted in the portal so we can trigger premium GPU-accelerated exit scale transitions
    return createPortal(
        <div 
            ref={ref} 
            className={`click-indicator ${active ? "visible" : ""} text-[0.75rem] pl-9 pr-2 py-2 rounded-full flex items-center gap-7`}
        >
            <span className="font-bold text-[#181717] tracking-widest uppercase">{text}</span>
            <div className="bg-[#181717] text-[#f4efe7] w-[2.2rem] h-[2.2rem] rounded-full flex justify-center items-center">
                <MdArrowOutward size={16} />
            </div>
        </div>,
        document.body
    );
};

export default ClickIndicator;
