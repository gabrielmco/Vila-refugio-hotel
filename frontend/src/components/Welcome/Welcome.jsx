import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { useMediaQuery } from "react-responsive";
import { welcomeLinesLG, welcomeLinesSM } from "../../constants/welcome";
import w1 from "../../assets/welcome_breakfast.webp";
import w2 from "../../assets/welcome_hammock.webp";

const Welcome = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const welcomeLines = isMobile ? welcomeLinesSM : welcomeLinesLG;

    useGSAP(() => {
        const lines = gsap.utils.toArray(".clip-text-welcome");
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".welcome-section",
                start: "top 75%",
                end: "bottom 75%",
                scrub: true,
            },
        });

        lines.forEach((line) => {
            tl.to(line, {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                stagger: 0.2,
                duration: 1,
            });
        });
    });

    return (
        <div id="welcome" className="welcome-section w-full min-h-screen py-20 md:py-32 flex flex-col justify-between text-[#2A2725] md:px-7 px-6">
            <div className="flex flex-col gap-2 tracking-[-4] leading-2">
                <div className="w-full md:text-[4.8vw] text-[34px] md:leading-[5.8vw] leading-[40px] font-normal welcome-line md:pt-20">
                    <div className="w-full welcome-text flex flex-col justify-center items-start">
                        {welcomeLines.map((text, index) => (
                            <span key={index} className="relative block text-darkBrown whitespace-nowrap md:tracking-normal tracking-[0.015em]">
                                {text}
                                <span className="clip-text-welcome md:tracking-normal tracking-[0.015em]">{text}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex md:flex-row flex-col justify-between items-center md:p-4 md:mt-20 mt-10">
                <div className="flex flex-row justify-center items-center gap-3 w-full md:w-auto justify-evenly md:justify-start">
                    <img src={w1} alt="Café da manhã em varanda da Vila Refúgio" className="rounded-full md:w-80 md:h-36 w-[44vw] h-[25vw] object-cover shadow-md" />
                    <img src={w2} alt="Varanda aconchegante da Vila Refúgio" className="rounded-full md:w-80 md:h-36 w-[44vw] h-[25vw] object-cover shadow-md" />
                </div>
                <div className="md:w-1/2 w-full md:mt-0 mt-10">
                    <p className="md:text-[2rem] text-[1.4rem] text-[#b1a696] md:leading-[1.1] md:pr-24 font-normal leading-[26px] tracking-[-0.2px]">
                        <span>Um lugar único para se conectar consigo mesmo e com quem você ama.</span><br />
                        <span>Um refúgio para vivenciar momentos inesquecíveis em meio à natureza.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
