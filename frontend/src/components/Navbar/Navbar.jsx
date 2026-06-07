import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { gsap } from "gsap";
import chaletImage from "../../assets/chalet_lago.webp";
import { scrollToTarget } from "../../lib/smoothScroll";

const menuLinks = [
  { label: "Início", target: "welcome" },
  { label: "Introdução", target: "chales-intro" },
  { label: "Chalés", target: "chales" },
  { label: "Por que Vila Refúgio®", target: "estrutura" },
  { label: "Atividades", target: "atividades-intro" },
  { label: "Feedback", target: "depoimentos" },
];

const socialItems = [
  { label: "Instagram", icon: FaInstagram },
  { label: "WhatsApp", icon: FaWhatsapp, href: "https://wa.me/5500000000000" },
  { label: "LinkedIn", icon: FaLinkedinIn },
  { label: "Facebook", icon: FaFacebookF },
];

const scrollToSection = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    scrollToTarget(target, { lock: true });
};

const Navbar = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [mapMode, setMapMode] = useState(false);
  const [isClosingMenu, setIsClosingMenu] = useState(false);
  const buttonRef = useRef(null);
  const overlayRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const mediaRef = useRef(null);
  const copyRef = useRef(null);
  const linkRefs = useRef([]);
  const socialRefs = useRef([]);
  const timelineRef = useRef(null);
  const previousOverflow = useRef("");
  const animatingRef = useRef(false);
  const menuOpenRef = useRef(false);

  const isMenuActive = (overlayVisible && !isClosingMenu) || mapMode;

  useEffect(() => {
    const handleMapOpen = () => setMapMode(true);
    const handleMapClose = () => setMapMode(false);
    const handleMapClosing = () => setMapMode(false);

    window.addEventListener("vila-map-open", handleMapOpen);
    window.addEventListener("vila-map-close", handleMapClose);
    window.addEventListener("vila-map-closing", handleMapClosing);

    return () => {
      timelineRef.current?.kill();
      document.body.style.overflow = previousOverflow.current;
      window.removeEventListener("vila-map-open", handleMapOpen);
      window.removeEventListener("vila-map-close", handleMapClose);
      window.removeEventListener("vila-map-closing", handleMapClosing);
    };
  }, []);

  const lockScroll = () => {
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    document.body.style.overflow = previousOverflow.current;
  };

  const setBackgroundFromButton = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    gsap.set(bgRef.current, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      scaleX: 1,
      scaleY: 1,
      borderRadius: rect.height / 2,
      transformOrigin: "0 0",
    });
    return rect;
  };

  const openMenu = () => {
    if (animatingRef.current || document.querySelector(".menu-overlay-shell")) return;

    menuOpenRef.current = true;
    animatingRef.current = true;
    setIsClosingMenu(false);
    lockScroll();
    setOverlayVisible(true);
  };

  useEffect(() => {
    if (!overlayVisible || !bgRef.current || !buttonRef.current) return;

    requestAnimationFrame(() => {
      const rect = setBackgroundFromButton();
      const links = linkRefs.current.filter(Boolean);
      const socials = socialRefs.current.filter(Boolean);

      gsap.set(overlayRef.current, { pointerEvents: "auto" });
      gsap.set(contentRef.current, { opacity: 1 });
      gsap.set(links, { yPercent: -115, opacity: 0 });
      gsap.set(socials, { x: -28, scale: 0.55, opacity: 0 });
      gsap.set(copyRef.current, { x: 42, opacity: 0 });
      gsap.set(mediaRef.current, { xPercent: 18, scale: 0.98, opacity: 0 });

      timelineRef.current?.kill();
      timelineRef.current = gsap
        .timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            animatingRef.current = false;
          },
        })
        .to(bgRef.current, {
          x: 0,
          y: 0,
          scaleX: window.innerWidth / rect.width,
          scaleY: window.innerHeight / rect.height,
          borderRadius: 0,
          duration: 1.05,
        })
        .to(links, {
          yPercent: 0,
          opacity: 1,
          duration: 0.82,
          ease: "power3.out",
          stagger: 0.075,
        }, "-=0.1")
        .to(socials, {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 0.58,
          ease: "back.out(1.45)",
          stagger: 0.07,
        }, "-=0.52")
        .to(copyRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.62,
          ease: "power3.out",
        }, "-=0.42")
        .to(mediaRef.current, {
          xPercent: 0,
          scale: 1,
          opacity: 1,
          duration: 0.82,
          ease: "power3.out",
        }, "-=0.72");
    });
  }, [overlayVisible]);

  const closeMenu = (targetId) => {
    if (!bgRef.current) return;

    animatingRef.current = true;
    setIsClosingMenu(true);
    const links = linkRefs.current.filter(Boolean);
    const socials = socialRefs.current.filter(Boolean);

    timelineRef.current?.kill();
    timelineRef.current = gsap
      .timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          unlockScroll();
          setOverlayVisible(false);
          setIsClosingMenu(false);
          menuOpenRef.current = false;
          animatingRef.current = false;
          if (targetId) {
            scrollToSection(targetId);
          }
        },
      })
      .to(mediaRef.current, {
        xPercent: 18,
        scale: 0.98,
        opacity: 0,
        duration: 0.58,
      }, 0)
      .to(copyRef.current, {
        x: 42,
        opacity: 0,
        duration: 0.48,
      }, 0.04)
      .to(socials, {
        x: -24,
        scale: 0.55,
        opacity: 0,
        duration: 0.48,
        stagger: { each: 0.055, from: "end" },
      }, 0.06)
      .to(links, {
        yPercent: -115,
        opacity: 0,
        duration: 0.62,
        stagger: { each: 0.055, from: "end" },
      }, 0.02)
      .to(bgRef.current, {
        x: buttonRef.current.getBoundingClientRect().left,
        y: buttonRef.current.getBoundingClientRect().top,
        scaleX: 1,
        scaleY: 1,
        borderRadius: buttonRef.current.getBoundingClientRect().height / 2,
        duration: 0.86,
      }, ">");
  };

  const handleButtonKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (mapMode) {
      window.dispatchEvent(new CustomEvent("vila-map-request-close"));
      return;
    }
    if (document.querySelector(".menu-overlay-shell")) {
      closeMenu();
      return;
    }
    openMenu();
  };

  useEffect(() => {
    const handleDocumentMouseDown = (event) => {
      if (!buttonRef.current?.contains(event.target)) return;

      event.preventDefault();
      event.stopPropagation();
      if (mapMode) {
        window.dispatchEvent(new CustomEvent("vila-map-request-close"));
        return;
      }
      if (document.querySelector(".menu-overlay-shell")) {
        closeMenu();
        return;
      }
      openMenu();
    };

    document.addEventListener("mousedown", handleDocumentMouseDown, true);
    return () => document.removeEventListener("mousedown", handleDocumentMouseDown, true);
    // openMenu/closeMenu are intentionally read from this render; mapMode is the stateful branch that must refresh the listener.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapMode]);

  const overlay = overlayVisible ? (
    <div ref={overlayRef} className="menu-overlay-shell" aria-hidden={!overlayVisible}>
      <div ref={bgRef} className="menu-overlay-bg" />
      <div ref={contentRef} className="menu-overlay-content">
        <nav className="menu-overlay-links" aria-label="Menu principal">
          {menuLinks.map((link, index) => (
            <button
              type="button"
              className="menu-overlay-link"
              key={link.label}
              ref={(node) => {
                linkRefs.current[index] = node;
              }}
              onClick={() => closeMenu(link.target)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="menu-overlay-footer">
          <div className="menu-overlay-socials" aria-label="Redes sociais">
            {socialItems.map((item, index) => {
              const Icon = item.icon;
              const commonProps = {
                className: "menu-overlay-social",
                ref: (node) => {
                  socialRefs.current[index] = node;
                },
                "aria-label": item.label,
              };

              if (item.href) {
                return (
                  <a
                    key={item.label}
                    {...commonProps}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon />
                  </a>
                );
              }

              return (
                <button type="button" key={item.label} {...commonProps}>
                  <Icon />
                </button>
              );
            })}
          </div>

          <p ref={copyRef} className="menu-overlay-copy">
            Vila Refúgio® — chalés modernos e aconchegantes
            <br />
            integrados à serra brasileira.
          </p>
        </div>

        <div ref={mediaRef} className="menu-overlay-media" aria-label="Vila Refúgio">
          <img src={chaletImage} alt="Chalé Vila Refúgio" />
          <div className="menu-overlay-marquee" aria-hidden="true">
            <div className="menu-overlay-marquee-track">
              <span>Vila Refúgio®</span>
              <span>Vila Refúgio®</span>
              <span>Vila Refúgio®</span>
              <span>Vila Refúgio®</span>
            </div>
            <div className="menu-overlay-marquee-track">
              <span>Vila Refúgio®</span>
              <span>Vila Refúgio®</span>
              <span>Vila Refúgio®</span>
              <span>Vila Refúgio®</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {createPortal(overlay, document.body)}
      <button
        ref={buttonRef}
        type="button"
        onKeyDown={handleButtonKeyDown}
        aria-label={isMenuActive ? "Fechar" : "Menu"}
        aria-expanded={overlayVisible}
        className={`navbar-floating-menu fixed bottom-8 left-1/2 -translate-x-1/2 w-fit h-10 p-1 flex items-center justify-end gap-2 bg-[#f4efe7] rounded-4xl cursor-pointer group transition-transform duration-500 hover:scale-105 shadow-lg ${isMenuActive ? "is-active" : ""} ${mapMode ? "is-map-mode" : ""}`}
      >
        <span className="navbar-menu-label pl-4 text-[12px] leading-none text-[#2a2725]">
          <span className="navbar-menu-label-track">
            <span>Menu</span>
            <span>Menu</span>
            <span>Fechar</span>
            <span>Fechar</span>
          </span>
        </span>
        <span className="navbar-menu-icon bg-[#2a2725] rounded-full" aria-hidden="true">
          <span className="navbar-menu-glyph">
            <span />
            <span />
            <span />
          </span>
        </span>
      </button>
    </>
  );
};

export default Navbar;
