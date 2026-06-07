import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { useMediaQuery } from "react-responsive";
import { chooseLinesLG, chooseLinesSM } from "../../constants/welcome";

const Choose = () => {
    const isMobD = useMediaQuery({
        query: "(max-width:768px)",
    });
    const chooseLines = isMobD ? chooseLinesSM : chooseLinesLG;

    useGSAP(() => {
        const q = gsap.utils.selector(".choose-section");
        const lines = q(".choose-title-clip");

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".choose-section",
                start: "top 75%",
                end: "bottom 100%",
                scrub: 0.8,
                // markers: true,
            },
        });

        tl.from(".choose-subtitle", {
            yPercent: 100,
            opacity: 0,
            ease: "power1.inOut"
        });

        if (!isMobD) {
            tl.fromTo(
                ".title-part",
                { height: "clamp(7rem, 13.5vw, 9.5rem)" },
                { height: "46vh", ease: "none" }
            );
        }

        tl.to(
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
            tl.from(".choose-sec", {
                yPercent: 100,
                duration: 1,
            }, "<");
        }
    });

    return (
        <section id="chales-intro" className="choose-section">
            <p className="choose-subtitle">Descubra os Nossos Chales Exclusivos<span>®</span></p>

            <div className="title-part">
                {chooseLines.map((line, index) => (
                    <h1 key={index} className="choose-heading">
                        <span className="choose-title-break">
                            {line}
                            <span className="choose-title-clip">{line}</span>
                        </span>
                    </h1>
                ))}
            </div>

            <div className="choose-sec">
                <div className="choose-copy">
                    <p>Voce pode escolher um dos tres chales premium em nossa reserva. Cada refugio oferece o mais alto padrao de conforto e sofisticacao ajustado aos seus desejos de descanso. Escolha o seu favorito.</p>
                </div>

                <div className="choose-pill-column">
                    <div className="choose-pill-caption">
                        <p>Todos os chales da Vila Refugio® foram projetados sob os mesmos pilares:</p>
                    </div>

                    <div className="choose-pills">
                        <div className="choose-pill is-muted">Sustentavel</div>
                        <div className="choose-pill is-bright">Preservacao</div>
                        <div className="choose-pill is-muted">Tecnologico</div>
                        <div className="choose-pill is-bright">Privacidade</div>
                        <div className="choose-pill is-muted">Espacoso</div>
                        <div className="choose-pill is-bright">Paredes de Vidro</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Choose;
