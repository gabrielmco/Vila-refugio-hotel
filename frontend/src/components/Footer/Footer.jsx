import { FaBehance, FaDribbble, FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";

import MarqueeText from "../Marquee/MarqueeText";
import { scrollToTarget } from "../../lib/smoothScroll";

const Footer = () => {
    const handleSectionLink = (event, targetId) => {
        event.preventDefault();
        const target = document.getElementById(targetId);
        if (!target) return;

        scrollToTarget(target, { lock: true });
    };

    return (
        <section className="w-screen h-dvh px-6 mt-10">
            <p className="text-[.7rem] text-[#eae5dd] choose-subtitle mt-10">
                Interessado em uma experiência inesquecível?<br />
                Reserve um de nossos chalés na Vila Refúgio<span>{"\u00AE"}</span>
            </p>

            <div>
                <MarqueeText />
            </div>

            <div className="flex justify-between items-center text-2xl mt-14">
                <h3 className="text-[#b1a696]">
                    A Vila Refúgio{"\u00AE"} é um ecossistema premium<br />
                    fictício desenhado para relaxamento<br />
                    e conexão profunda com a natureza.<br /><br />
                    Gostaria de realizar uma reserva?<br />
                    Fale com nosso time de atendimento -{" "}
                    <a
                        href="https://wa.me/5500000000000"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#f4efe7] underline transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#c4c1b9]"
                    >
                        contato via WhatsApp.
                    </a>
                </h3>

                <div className="flex flex-col justify-center items-end">
                    <a href="#welcome" onClick={(event) => handleSectionLink(event, "welcome")} className="text-[#f2ede5] text-2xl transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#b1a696]">Início</a>
                    <a href="#chales" onClick={(event) => handleSectionLink(event, "chales")} className="text-[#f2ede5] text-2xl transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#b1a696]">Nossos Chalés</a>
                    <a href="#atividades" onClick={(event) => handleSectionLink(event, "atividades")} className="text-[#f2ede5] text-2xl transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#b1a696]">Atividades</a>
                    <a href="#depoimentos" onClick={(event) => handleSectionLink(event, "depoimentos")} className="text-[#f2ede5] text-2xl transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#b1a696]">Depoimentos</a>
                </div>
            </div>

            <div className="w-full flex justify-between items-center mt-20">
                <div className="flex justify-center items-center gap-1">
                    {[FaBehance, FaInstagram, CiLinkedin, FaDribbble].map((Icon, index) => (
                        <div
                            key={index}
                            className="border-[1px] border-[#c4c1b9] rounded-full p-3 text-[#f2ede5] cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#c4c1b9] hover:text-[#181717]"
                        >
                            <Icon className="text-xl" />
                        </div>
                    ))}
                </div>

                <p className="text-[0.8rem] text-[#b1a696] text-right">
                    Vila Refúgio{"\u00AE"} - chalés modernos e aconchegantes<br />
                    totalmente integrados à serra brasileira.
                </p>
            </div>
        </section>
    );
};

export default Footer;
