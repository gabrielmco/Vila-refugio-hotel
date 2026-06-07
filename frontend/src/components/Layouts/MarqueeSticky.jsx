import MarqueeText from "../Marquee/MarqueeText";

const MarqueeSticky = () => {
    return (
        <section className="w-full overflow-hidden bg-[#181717] px-8 py-10 relative">
            <div className="relative z-1">
                <p className="text-[0.7rem] text-[#eae5dd] choose-subtitle">
                    Quer saber mais sobre
                    <br />
                    as experiências do Vila Refúgio?
                </p>
            </div>

            <div className="relative z-0 mt-6 opacity-90">
                <MarqueeText />
            </div>
        </section>
    );
};

export default MarqueeSticky;
