import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { useMediaQuery } from "react-responsive";
import { chooseLinesSM as activitiesLinesSM } from "../../constants/welcome";
import { activitiesLinesLG } from "../../constants/activites";
import "./activities.css";

const Activities = () => {
    const isMobD = useMediaQuery({
        query: "(max-width:768px)",
    });
    const activitiesLines = isMobD ? activitiesLinesSM : activitiesLinesLG;

    useGSAP(() => {
        const lines = gsap.utils.toArray(".activities-title-clip");
        const progressLines = gsap.utils.toArray(".progress-line");

        const activitiesTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".activities-section",
                start: "top 80%",
                end: "top 20%",
                scrub: true,
            },
        });

        activitiesTl.from(".activities-subtitle", {
            yPercent: 100,
            opacity: 0,
            ease: "power1.inOut",
        });

        activitiesTl.to(
            lines,
            {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                stagger: 0.2,
                duration: 1,
            },
            "<"
        );

        if (!isMobD) {
            activitiesTl.from(".activities-sec", {
                yPercent: 100,
                duration: 1,
            }, "<");
        }

        activitiesTl.fromTo(progressLines[0],
            { width: "0%" },
            { width: "40%", duration: 0.5, ease: "power2.in" }
        );

        activitiesTl.fromTo(progressLines[1],
            { width: "0%" },
            { width: "80%", duration: 0.5, ease: "power2.in" },
            "<"
        );

        activitiesTl.fromTo(progressLines[2],
            { width: "0%" },
            { width: "60%", duration: 0.5, ease: "power2.in" },
            "<"
        );
    });

    return (
        <section id="atividades-intro" className="activities-section w-full min-h-[100dvh] p-8 py-20">
            <p className="text-[.7rem] font-bold text-[#eae5dd] activities-subtitle">Pronto para uma aventura?</p>
            <div className="lg:mt-10 mt-7 activities-part origin-bottom">
                {activitiesLines.map((line, index) => (
                    <h1 key={index} className="activities-heading text-[#f4efe7] lg:text-[9.5rem] text-[3rem] leading-[0.9] font-medium tracking-tighter">
                        <span className={`activities-title-break ${index === 1 ? "lg:pb-3 pb-2" : ""}`}>
                            {line}
                            <span className={`activities-title-clip ${index === 1 ? "lg:pb-3 pb-2" : ""}`}>
                                {line}
                            </span>
                        </span>
                    </h1>
                ))}
            </div>
            <div className="activities-sec w-full flex lg:flex-row flex-col justify-center items-start gap-10 lg:mt-0">
                <div className="lg:w-1/2 w-full">
                    <div className="lg:w-[40%] w-[60%]">
                        <p className="text-[.7rem] text-[#eae5dd] text-nowrap">As atividades da Vila Refúgio® possuem diferentes dificuldades:</p>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-5 mt-8 mr-14">
                        <div className="w-full mr-14">
                            <div className="flex justify-between w-full mb-4">
                                <h1 className="text-[#b1a696] text-xl">Fácil</h1>
                                <p className="text-[#b1a696] text-[0.7rem]">Duração: 3-5h</p>
                            </div>
                            <div className="relative z-9 w-full h-[0.1rem] bg-[#4f4b48]">
                                <div className="progress-line absolute z-10 bg-[#f4efe7] w-[40%] h-[0.1rem] top-1/2 -translate-y-1/2 left-0"></div>
                            </div>
                        </div>
                        <div className="w-full mr-14">
                            <div className="flex justify-between w-full mb-4">
                                <h1 className="text-[#b1a696] text-xl">Moderado</h1>
                                <p className="text-[#b1a696] text-[0.7rem]">Duração: 8-12h</p>
                            </div>
                            <div className="relative z-9 w-full h-[0.1rem] bg-[#4f4b48]">
                                <div className="progress-line absolute z-10 bg-[#f4efe7] w-[80%] h-[0.1rem] top-1/2 -translate-y-1/2 left-0"></div>
                            </div>
                        </div>
                        <div className="w-full mr-14">
                            <div className="flex justify-between w-full mb-4">
                                <h1 className="text-[#b1a696] text-xl">Desafiador</h1>
                                <p className="text-[#b1a696] text-[0.7rem]">Duração: 24h</p>
                            </div>
                            <div className="relative z-9 w-full h-[0.1rem] bg-[#4f4b48]">
                                <div className="progress-line absolute z-10 bg-[#f4efe7] w-[60%] h-[0.1rem] top-1/2 -translate-y-1/2 left-0"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2 w-full text-[#b1a696] lg:text-[2rem] text-[1rem] md:leading-[1.1] lg:mt-0 mt-8 lg:pr-0">
                    <p>Queremos garantir que a sua estadia seja emocionante e revigorante. Oferecemos experiências com diferentes intensidades: seja buscando tranquilidade ou aventura, há algo especial para tornar sua viagem memorável.</p>
                </div>
            </div>
        </section>
    );
};

export default Activities;
