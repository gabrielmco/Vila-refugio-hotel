import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { MdArrowOutward } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { createPortal } from "react-dom";
import "./chateauGallery.css";
import { requestScrollRefresh, waitForImageSources } from "../../lib/scrollRefresh";

// Import premium images from the download folder
import imgSuites from "../../assets/download/Chateau_suite_interior_misty_mou_202605271101.webp";
import imgGastronomia from "../../assets/download/Restaurant_and_bar_inside_chateau_202605271101.webp";
import imgSpa from "../../assets/download/Infinity_pool_reflecting_sunset__202605271101.webp";
import imgExperiencias from "../../assets/download/Picnic_on_mountain_ridge_202605271101.webp";

// Import premium high-res image variations
import imgSuitesVar from "../../assets/download/Bedroom_suite_in_chateau_202605271101.webp";
import imgGastronomiaVar from "../../assets/download/Piano_bar_and_restaurant_interior_202605271101.webp";
import imgSpaVar from "../../assets/download/Infinity_pool_and_hot_tub_202605271101.webp";
import imgExperienciasVar from "../../assets/download/Variation_of_the_mountain_experience._202605271101.webp";

// Import new event and trail assets generated dynamically to match the chateau style
import imgEventos from "../../assets/download/eventos_jardim_panorama_v2.webp";
import imgEventosVar from "../../assets/download/eventos_jardim_panorama_v2.webp";
import imgTrilhas from "../../assets/download/trilhas_tarde_panorama_v2.webp";
import imgTrilhasVar from "../../assets/download/cachoeira_panorama_detail_v2.webp";

const chateauSpacesData = [
    {
        num: "01",
        name: "Suítes Chateau",
        headline: "Aconchego e Elegância nas Alturas",
        desc: "Nossas suítes exclusivas combinam lareiras aconchegantes a lenha, enxoval de algodão egípcio de alta gramatura e as icônicas janelas com venezianas azul-celeste, que se abrem para revelar a neblina matinal e a beleza imponente da Serra da Mantiqueira.",
        image: imgSuites,
        imageDetail: imgSuitesVar
    },
    {
        num: "02",
        name: "Alta Gastronomia",
        headline: "Alta Culinária e Adega Exclusiva",
        desc: "Saboreie um menu contemporâneo franco-brasileiro elaborado com ingredientes selecionados e colhidos diretamente de produtores locais da serra, acompanhado de uma carta de vinhos finos em um salão com piano de cauda e arcos de pedra rústicos.",
        image: imgGastronomia,
        imageDetail: imgGastronomiaVar
    },
    {
        num: "03",
        name: "Spa & Wellness",
        headline: "Relaxamento profundo e bem-estar",
        desc: "Desfrute de tratamentos terapêuticos holísticos, banhos de vapor no nosso ofurô de madeira no deck suspenso de pedras e mergulhe em nossa piscina externa climatizada com borda infinita voltada para a imensidão verde do vale.",
        image: imgSpa,
        imageDetail: imgSpaVar
    },
    {
        num: "04",
        name: "Lazer & Experiências",
        headline: "Momentos Únicos e Experiências",
        desc: "Participe de passeios guiados a cavalo pelas colinas no entardecer, faça trilhas de imersão ecológica na reserva e desfrute de piqueniques exclusivos preparados sob medida por nosso chef em clareiras secretas com vista panorâmica.",
        image: imgExperiencias,
        imageDetail: imgExperienciasVar
    },
    {
        num: "05",
        name: "Casamentos & Eventos",
        headline: "Celebrações Memoráveis na Serra",
        desc: "Realize o evento dos seus sonhos. Dispomos de alta gastronomia sob medida, amplos jardins floridos para cerimônias diurnas ao ar livre e um majestoso salão de festas clássico com iluminação quente para festas inesquecíveis à noite.",
        image: imgEventos,
        imageDetail: imgEventosVar
    },
    {
        num: "06",
        name: "Trilhas & Cachoeiras",
        headline: "Exploração e Aventura na Reserva",
        desc: "Conecte-se profundamente com a natureza intocada da Serra da Mantiqueira. Caminhe por trilhas ecológicas fechadas na floresta durante a tarde e refresque-se nas águas de nossa cachoeira secreta de águas cristalinas.",
        image: imgTrilhas,
        imageDetail: imgTrilhasVar
    }
];

const chateauTextureSources = chateauSpacesData.flatMap((item) => [
    item.image,
    item.imageDetail
]);

const isCompactViewport = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 1024px)").matches;
};

// Custom Shader Definition for Parallax Wave Distortion
const vertexShader = `
    uniform float uVelocity;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        vec3 pos = position;
        
        // 3x softer organic liquid bending physics (Awwwards design refinement)
        pos.y += sin(uv.x * 3.14159265) * uVelocity * 0.05;
        pos.x += sin(uv.y * 3.14159265) * uVelocity * 0.02;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const fragmentShader = `
    precision mediump float;
    uniform sampler2D uTexture;
    uniform sampler2D uTextureDetail;
    uniform float uPlaneAspect;
    uniform float uImageAspect;
    uniform float uTransition; // 0.0 = thumb, 1.0 = variation image
    uniform float uAlpha;
    uniform float uOffset;
    varying vec2 vUv;

    vec2 coverUv(vec2 uv, float planeAspect, float imageAspect) {
        if (planeAspect > imageAspect) {
            uv.y = (uv.y - 0.5) * (imageAspect / planeAspect) + 0.5;
        } else {
            uv.x = (uv.x - 0.5) * (planeAspect / imageAspect) + 0.5;
        }
        return uv;
    }

    void main() {
        vec2 uv = coverUv(vUv, uPlaneAspect, uImageAspect);
        uv = (uv - 0.5) * 0.92 + 0.5;
        
        // Apply horizontal depth parallax shift
        uv.x = uv.x + uOffset * 0.06;
        uv.x = clamp(uv.x, 0.0, 1.0);
        uv.y = clamp(uv.y, 0.0, 1.0);
        
        vec4 colorThumb = texture2D(uTexture, uv);
        vec4 colorDetail = texture2D(uTextureDetail, uv);
        
        // Seamless cross-fade texture morphing
        vec4 finalColor = mix(colorThumb, colorDetail, uTransition);
        
        finalColor.a *= uAlpha;
        gl_FragColor = finalColor;
    }
`;

const ChateauGallery = () => {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const canvasRef = useRef(null);

    const [activeCard, setActiveCard] = useState(null);
    const [displayCard, setDisplayCard] = useState(0); // Holds content stable during slide-out
    const [isAnimating, setIsAnimating] = useState(false);

    // Lock page scroll and toggle active class on body when details are active
    useEffect(() => {
        if (activeCard !== null) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            document.body.classList.add("chateau-detail-active");
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.classList.remove("chateau-detail-active");
        }
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.classList.remove("chateau-detail-active");
        };
    }, [activeCard]);

    // Refs for holding state within the stable non-tearing useEffect loop
    const activeCardRef = useRef(null);
    const isAnimatingRef = useRef(false);

    const scrollState = useRef({
        x: 0,
        targetX: 0,
        dragStart: 0,
        dragStartX: 0,
        hasMoved: false,
        isDragging: false,
        velocity: 0
    });

    useEffect(() => {
        if (!canvasRef.current || !sectionRef.current || !trackRef.current) return;

        const compactLayout = window.matchMedia("(max-width: 1024px)").matches;
        if (compactLayout) {
            const placeholders = Array.from(sectionRef.current.querySelectorAll(".chateau-gallery-img-placeholder"));
            placeholders.forEach((el, i) => {
                el.style.opacity = "1";
                el.style.backgroundImage = `url(${chateauSpacesData[i].image})`;
                el.style.backgroundSize = "cover";
                el.style.backgroundPosition = "center";
            });

            const track = trackRef.current;
            let isPointerDragging = false;
            let startX = 0;
            let startScrollLeft = 0;
            let pointerMoved = false;

            const onPointerDown = (event) => {
                if (!track || event.target.closest(".chateau-gallery-card-action")) return;
                isPointerDragging = true;
                pointerMoved = false;
                startX = event.clientX;
                startScrollLeft = track.scrollLeft;
                track.classList.add("is-dragging");
                track.setPointerCapture?.(event.pointerId);
            };

            const onPointerMove = (event) => {
                if (!isPointerDragging || !track) return;
                const delta = event.clientX - startX;
                if (Math.abs(delta) > 4) pointerMoved = true;
                track.scrollLeft = startScrollLeft - delta;
            };

            const onPointerUp = (event) => {
                if (!track) return;
                isPointerDragging = false;
                track.classList.remove("is-dragging");
                scrollState.current.hasMoved = pointerMoved;
                track.releasePointerCapture?.(event.pointerId);
                window.setTimeout(() => {
                    scrollState.current.hasMoved = false;
                }, 60);
            };

            track.addEventListener("pointerdown", onPointerDown);
            track.addEventListener("pointermove", onPointerMove);
            track.addEventListener("pointerup", onPointerUp);
            track.addEventListener("pointercancel", onPointerUp);
            requestScrollRefresh();
            return () => {
                track.removeEventListener("pointerdown", onPointerDown);
                track.removeEventListener("pointermove", onPointerMove);
                track.removeEventListener("pointerup", onPointerUp);
                track.removeEventListener("pointercancel", onPointerUp);
            };
        }

        // Performant IntersectionObserver to conditionally trigger/pause Three.js draw cycles only when visible
        let isVisible = false;
        let refreshedOnFirstView = false;
        let disposed = false;
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible && !refreshedOnFirstView) {
                    refreshedOnFirstView = true;
                    requestAnimationFrame(() => {
                        if (disposed) return;
                        updateCameraFOV();
                        requestScrollRefresh();
                    });
                }
            },
            { threshold: 0.01 }
        );
        observer.observe(sectionRef.current);

        const placeholders = Array.from(document.querySelectorAll(".chateau-gallery-img-placeholder"));
        if (placeholders.length === 0) {
            return () => {
                disposed = true;
                observer.disconnect();
            };
        }

        // Check WebGL availability on a DUMMY canvas so we do NOT lock the context of our actual ref canvas (Bug 4 Fallback Fix)
        const dummyCanvas = document.createElement("canvas");
        const gl = dummyCanvas.getContext("webgl") || dummyCanvas.getContext("experimental-webgl");
        if (!gl) {
            placeholders.forEach((el, i) => {
                el.style.opacity = "1";
                el.style.backgroundImage = `url(${chateauSpacesData[i].image})`;
                el.style.backgroundSize = "cover";
                el.style.backgroundPosition = "center";
            });
            requestScrollRefresh();
            return () => {
                disposed = true;
                observer.disconnect();
            };
        }

        const scene = new THREE.Scene();
        const cameraDistance = 600;

        // Resolve Closure capturing code smell by reading viewport dimensions dynamically
        const getDimensions = () => {
            const w = sectionRef.current ? sectionRef.current.clientWidth : window.innerWidth;
            const h = sectionRef.current ? sectionRef.current.clientHeight : window.innerHeight;
            return { width: w, height: h };
        };

        const { width: initialW, height: initialH } = getDimensions();
        const camera = new THREE.PerspectiveCamera(45, initialW / initialH, 0.1, 10000);
        camera.position.z = cameraDistance;

        const cachedGeometries = [];
        const cacheGeometries = () => {
            const track = trackRef.current;
            const section = sectionRef.current;
            if (!track || !section) return;

            const secRect = section.getBoundingClientRect();
            const sectionW = secRect.width;
            const sectionH = secRect.height;
            const sectionLeft = secRect.left;

            // Get current scroll offset from the state
            const currentX = scrollState.current.x;

            placeholders.forEach((el, index) => {
                const rect = el.getBoundingClientRect();
                const initialLeftRelative = (rect.left - sectionLeft) - currentX;
                const localTop = rect.top - secRect.top;

                cachedGeometries[index] = {
                    width: rect.width,
                    height: rect.height,
                    initialLeftRelative,
                    localTop
                };
            });

            cacheGeometries.sectionW = sectionW;
            cacheGeometries.sectionH = sectionH;
            cacheGeometries.sectionLeft = sectionLeft;
        };

        function updateCameraFOV() {
            const { width, height } = getDimensions();
            camera.fov = 2 * Math.atan((height / 2) / cameraDistance) * (180 / Math.PI);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            if (renderer) renderer.setSize(width, height);

            // Warm up layout geometry cache on resize
            cacheGeometries();

            // Responsive split-screen scale correction for active card
            if (activeCardRef.current !== null) {
                const mesh = meshes[activeCardRef.current];
                if (mesh) {
                    let targetW = width;
                    let targetX = 0;
                    if (window.innerWidth > 1024) {
                        const panelWidth = width * 0.32;
                        targetW = width - panelWidth;
                        targetX = -panelWidth / 2;
                    } else if (window.innerWidth > 640) {
                        const panelWidth = width * 0.50;
                        targetW = width - panelWidth;
                        targetX = -panelWidth / 2;
                    }
                    mesh.scale.set(targetW, height, 1);
                    mesh.material.uniforms.uPlaneAspect.value = targetW / height;
                    mesh.position.set(targetX, 0, 50);
                }
            }
        }

        // Instantiate Three.js WebGLRenderer safely inside a try-catch block for complete bulletproof fallback execution
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                alpha: true,
                antialias: true
            });
        } catch (err) {
            console.error("Three.js WebGLRenderer creation failed. Reverting to fallback placeholders:", err);
            placeholders.forEach((el, i) => {
                el.style.opacity = "1";
                el.style.backgroundImage = `url(${chateauSpacesData[i].image})`;
                el.style.backgroundSize = "cover";
                el.style.backgroundPosition = "center";
            });
            return;
        }
        const { width: currentW, height: currentH } = getDimensions();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(currentW, currentH);

        const textureLoader = new THREE.TextureLoader();
        const meshes = [];

        placeholders.forEach((el, index) => {
            // Load both primary and variation textures
            const uniforms = {
                uTexture: { value: null },
                uTextureDetail: { value: null },
                uPlaneAspect: { value: 1 },
                uImageAspect: { value: 1 },
                uTransition: { value: 0.0 },
                uVelocity: { value: 0.0 },
                uAlpha: { value: 1.0 },
                uOffset: { value: 0.0 }
            };

            const texture = textureLoader.load(chateauSpacesData[index].image, (loadedTexture) => {
                if (loadedTexture.image?.width && loadedTexture.image?.height) {
                    uniforms.uImageAspect.value = loadedTexture.image.width / loadedTexture.image.height;
                }
            });
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            const textureDetail = textureLoader.load(chateauSpacesData[index].imageDetail);
            textureDetail.generateMipmaps = false;
            textureDetail.minFilter = THREE.LinearFilter;
            textureDetail.magFilter = THREE.LinearFilter;
            textureDetail.wrapS = THREE.ClampToEdgeWrapping;
            textureDetail.wrapT = THREE.ClampToEdgeWrapping;

            const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms,
                transparent: true
            });
            uniforms.uTexture.value = texture;
            uniforms.uTextureDetail.value = textureDetail;

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            meshes.push(mesh);
        });

        updateCameraFOV();
        requestScrollRefresh();
        waitForImageSources(chateauTextureSources).then(() => {
            if (disposed) return;
            updateCameraFOV();
            requestScrollRefresh();
        });

        const track = trackRef.current;
        const section = sectionRef.current;
        const state = scrollState.current;

        const getClientX = (e) => {
            return e.touches ? e.touches[0].clientX : e.clientX;
        };

        const onStart = (e) => {
            if (activeCardRef.current !== null || isAnimatingRef.current) return;
            state.isDragging = true;
            state.dragStartX = getClientX(e);
            state.hasMoved = false;
            state.dragStart = getClientX(e) - state.targetX;
        };

        const onMove = (e) => {
            if (!state.isDragging || activeCardRef.current !== null || isAnimatingRef.current) return;
            const currentX = getClientX(e);
            
            // Prevent default vertical touch scrolling on mobile when actively swiping the horizontal WebGL track (Bug 3 Touchmove)
            if (e.touches && e.cancelable) {
                e.preventDefault();
            }
            
            // Set threshold flag to prevent click registration during swipes
            if (Math.abs(currentX - state.dragStartX) > 6) {
                state.hasMoved = true;
            }
            
            const { width } = getDimensions();
            // Visual padding boundary (100px) to prevent horizontal track edge clamping too close (Code Smell C Magic Number)
            const maxScroll = -(track.scrollWidth - width + 100);
            const newTarget = currentX - state.dragStart;
            state.targetX = Math.min(0, Math.max(maxScroll, newTarget));
        };

        const onEnd = () => {
            state.isDragging = false;
        };

        track.addEventListener("mousedown", onStart);
        track.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onEnd);
        track.addEventListener("touchstart", onStart, { passive: true });
        track.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("touchend", onEnd, { passive: true });

        const handleThreeClick = (e) => {
            const index = e.detail.index;
            activeCardRef.current = index;
            isAnimatingRef.current = true;

            const mesh = meshes[index];
            if (!mesh) return;

            mesh.renderOrder = 10;
            meshes.forEach((sib, i) => {
                if (i !== index) {
                    gsap.to(sib.material.uniforms.uAlpha, { value: 0.0, duration: 0.8, ease: "power2.out" });
                }
            });

            // Smooth cross-fade to detail variation texture, resetting distortions
            gsap.to(mesh.material.uniforms.uTransition, { value: 1.0, duration: 1.2, ease: "power4.inOut" });
            gsap.to(mesh.material.uniforms.uVelocity, { value: 0.0, duration: 0.8, ease: "power2.out" });
            gsap.to(mesh.material.uniforms.uOffset, { value: 0.0, duration: 0.8, ease: "power2.out" });

            const { width, height } = getDimensions();

            // Calculate precise target width and X displacement for split screen (cut off under the right details panel)
            let targetWidth = width;
            let targetX = 0;
            if (window.innerWidth > 1024) {
                const panelWidth = width * 0.32;
                targetWidth = width - panelWidth;
                targetX = -panelWidth / 2;
            } else if (window.innerWidth > 640) {
                const panelWidth = width * 0.50;
                targetWidth = width - panelWidth;
                targetX = -panelWidth / 2;
            }

            gsap.killTweensOf(mesh.position);
            gsap.killTweensOf(mesh.scale);
            gsap.to(mesh.position, { x: targetX, y: 0, z: 50, duration: 1.2, ease: "power4.inOut" });
            gsap.to(mesh.material.uniforms.uPlaneAspect, { value: targetWidth / height, duration: 1.2, ease: "power4.inOut" });
            gsap.to(mesh.scale, { x: targetWidth, y: height, duration: 1.2, ease: "power4.inOut", onComplete: () => {
                    setIsAnimating(false);
                    isAnimatingRef.current = false;
                }
            });
        };

        const handleThreeClose = (e) => {
            const index = e.detail.index;
            const scrollToId = e.detail.scrollToId;
            isAnimatingRef.current = true;
            setActiveCard(null); // Instantly trigger concurrent right-side CSS panel slide-out
            
            const mesh = meshes[index];
            if (!mesh) return;

            const el = placeholders[index];
            const geom = cachedGeometries[index];
            const { width, height } = getDimensions();
            
            let targetX, targetY, targetWidth, targetHeight;
            if (geom) {
                const leftRelative = geom.initialLeftRelative + state.x;
                targetX = leftRelative - width / 2 + geom.width / 2;
                targetY = -geom.localTop + height / 2 - geom.height / 2;
                targetWidth = geom.width;
                targetHeight = geom.height;
            } else {
                const rect = el.getBoundingClientRect();
                const secRect = section.getBoundingClientRect();
                targetX = (rect.left - secRect.left) - width / 2 + rect.width / 2;
                targetY = -(rect.top - secRect.top) + height / 2 - rect.height / 2;
                targetWidth = rect.width;
                targetHeight = rect.height;
            }

            meshes.forEach((sib, i) => {
                if (i !== index) {
                    gsap.to(sib.material.uniforms.uAlpha, { value: 1.0, duration: 1.0, ease: "power2.out" });
                }
            });

            // Seamless cross-fade back to track thumbnail texture
            gsap.to(mesh.material.uniforms.uTransition, { value: 0.0, duration: 1.0, ease: "power4.inOut" });

            // Slide out of detail panel is handled concurrently by native, hardware-accelerated CSS transitions
            // which react automatically to the removal of the ".active" overlay class in React.

            gsap.killTweensOf(mesh.position);
            gsap.killTweensOf(mesh.scale);
            gsap.to(mesh.position, { x: targetX, y: targetY, z: 0, duration: 1.0, ease: "power4.inOut" });
            gsap.to(mesh.material.uniforms.uPlaneAspect, { value: targetWidth / targetHeight, duration: 1.0, ease: "power4.inOut" });
            gsap.to(mesh.scale, { x: targetWidth, y: targetHeight, duration: 1.0, ease: "power4.inOut", onComplete: () => {
                    mesh.renderOrder = 0;
                    activeCardRef.current = null;
                    setIsAnimating(false);
                    isAnimatingRef.current = false;
                    
                    // Unlocked overflow allows scrolling to fire perfectly on next macro-task (Bug 1 Fix)
                    if (scrollToId) {
                        setTimeout(() => {
                            const element = document.getElementById(scrollToId);
                            if (element) {
                                element.scrollIntoView({ behavior: "smooth" });
                            }
                        }, 50);
                    }
                }
            });
        };

        window.addEventListener("three-click", handleThreeClick);
        window.addEventListener("three-close", handleThreeClose);

        let animationFrameId;
        const lerp = (a, b, n) => (1 - n) * a + n * b;

        const animate = () => {
            // Highly optimized off-screen rendering guard to completely bypass draw calls and GPU shaders when scrolled away
            if (!isVisible) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            if (activeCardRef.current === null) {
                state.x = lerp(state.x, state.targetX, 0.08);
                track.style.transform = `translateX(${state.x}px)`;
                state.velocity = state.targetX - state.x;
            } else {
                state.velocity = 0;
            }

            const sectionWidth = cacheGeometries.sectionW || window.innerWidth;
            const sectionHeight = cacheGeometries.sectionH || window.innerHeight;
            const sectionLeft = cacheGeometries.sectionLeft || 0;

            meshes.forEach((mesh, index) => {
                if (activeCardRef.current === index) return;
                
                const geom = cachedGeometries[index];
                if (!geom) return;

                const rectWidth = geom.width;
                const rectHeight = geom.height;
                const leftRelative = geom.initialLeftRelative + state.x;

                mesh.scale.set(rectWidth, rectHeight, 1);
                mesh.material.uniforms.uPlaneAspect.value = rectWidth / rectHeight;
                mesh.position.x = leftRelative - sectionWidth / 2 + rectWidth / 2;
                mesh.position.y = -geom.localTop + sectionHeight / 2 - geom.height / 2;
                mesh.position.z = 0;

                // Screen position based depth parallax window calculation (completely math-based, NO DOM reads!)
                const screenCenterX = leftRelative + sectionLeft + rectWidth / 2;
                const offsetRatio = (screenCenterX / window.innerWidth) - 0.5;
                mesh.material.uniforms.uOffset.value = offsetRatio;

                // 3x reduced subtle bending scale (Awwwards-level elegance)
                const shaderVelocity = state.velocity * 0.005;
                mesh.material.uniforms.uVelocity.value = lerp(mesh.material.uniforms.uVelocity.value, shaderVelocity, 0.1);
            });

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        window.addEventListener("resize", updateCameraFOV);

        return () => {
            disposed = true;
            cancelAnimationFrame(animationFrameId);
            observer.disconnect(); // Disconnect IntersectionObserver to prevent memory leaks
            window.removeEventListener("resize", updateCameraFOV);
            window.removeEventListener("three-click", handleThreeClick);
            window.removeEventListener("three-close", handleThreeClose);
            track.removeEventListener("mousedown", onStart);
            track.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onEnd);
            track.removeEventListener("touchstart", onStart);
            track.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onEnd);
            meshes.forEach(mesh => {
                mesh.geometry.dispose();
                mesh.material.dispose();
            });
            renderer.dispose();
        };
    }, []);

    // Staggered reveal animation orchestrator for details (now fully automated via robust GPU-accelerated CSS)
    useEffect(() => {
        if (activeCard === null) return;
        setDisplayCard(activeCard);
    }, [activeCard]);

    return (
        <section 
            id="estrutura" 
            ref={sectionRef} 
            className={`chateau-gallery-section w-screen h-screen ${activeCard !== null ? "detail-view-active" : ""}`}
        >
            <canvas className="chateau-gallery-canvas" ref={canvasRef} />

            <div className="chateau-gallery-header">
                <p className="chateau-gallery-subtitle">A Pousada Por Dentro</p>
                <h2 className="chateau-gallery-title">Nossos Espaços</h2>
            </div>

            <div className="chateau-gallery-track" ref={trackRef}>
                {chateauSpacesData.map((item, index) => (
                    <div 
                        key={index} 
                        className="chateau-gallery-card"
                    >
                        <div className="chateau-gallery-mobile-copy">
                            <h3>{item.headline}</h3>
                            <p>{item.desc}</p>
                            <div className="chateau-gallery-mobile-meta">
                                <span>{item.num}</span>
                                <span>{String(chateauSpacesData.length).padStart(2, "0")}</span>
                            </div>
                        </div>

                        <div className="chateau-gallery-img-placeholder img-placeholder" />
                        
                        {/* Premium Circular Action Arrow button with scale-rotation hover effect */}
                        <div 
                            className="chateau-gallery-card-action"
                            onClick={() => {
                                if (activeCard !== null || isAnimating || scrollState.current.hasMoved) return;
                                if (isCompactViewport()) {
                                    setDisplayCard(index);
                                    activeCardRef.current = index;
                                    setActiveCard(index);
                                    return;
                                }
                                setIsAnimating(true);
                                setActiveCard(index);
                                const clickEvent = new CustomEvent("three-click", { detail: { index } });
                                window.dispatchEvent(clickEvent);
                            }}
                        >
                            <span>Ver detalhes</span>
                            <MdArrowOutward size={22} />
                        </div>

                        <div className="chateau-gallery-info">
                            <span className="chateau-gallery-name">{item.name}</span>
                            <span className="chateau-gallery-num">{item.num}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Portal-rendered Floating Glassmorphic detail panel - Kept mounted for smooth slide-out transitions */}
            {createPortal(
                <div className={`chateau-detail-overlay ${activeCard !== null ? "active" : ""}`}>
                    <div className="chateau-detail-panel">
                        <button 
                            className="chateau-detail-close-btn"
                            onClick={() => {
                                // Synchronous ref guards protect from rapid double dispatch glitches (Bug 2 double click)
                                if (isCompactViewport()) {
                                    activeCardRef.current = null;
                                    isAnimatingRef.current = false;
                                    setIsAnimating(false);
                                    setActiveCard(null);
                                    return;
                                }
                                if (isAnimating || isAnimatingRef.current) return;
                                isAnimatingRef.current = true;
                                setIsAnimating(true);
                                // Utilizes ultra-stable displayCard state (Bug 5 activeCard null edge case)
                                const closeEvent = new CustomEvent("three-close", { detail: { index: displayCard } });
                                window.dispatchEvent(closeEvent);
                            }}
                        >
                            <IoMdClose size={22} />
                        </button>

                        <div className="chateau-detail-body">
                            <span className="chateau-detail-number">
                                {chateauSpacesData[displayCard].num}
                            </span>
                            <h2 className="chateau-detail-title">
                                {chateauSpacesData[displayCard].headline}
                            </h2>
                            <p className="chateau-detail-para">
                                {chateauSpacesData[displayCard].desc}
                            </p>
                        </div>

                        <div className="chateau-detail-footer">
                            <button 
                                className="chateau-detail-cta"
                                onClick={() => {
                                    // Synchronous ref guards protect from rapid double dispatch glitches (Bug 2 double click)
                                    if (isCompactViewport()) {
                                        activeCardRef.current = null;
                                        isAnimatingRef.current = false;
                                        setIsAnimating(false);
                                        setActiveCard(null);
                                        setTimeout(() => {
                                            document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
                                        }, 80);
                                        return;
                                    }
                                    if (isAnimating || isAnimatingRef.current) return;
                                    isAnimatingRef.current = true;
                                    setIsAnimating(true);
                                    // Utilizes stable displayCard state and safely queues smooth scroll until animation finishes (Bug 1 & 5)
                                    const closeEvent = new CustomEvent("three-close", { 
                                        detail: { 
                                            index: displayCard, 
                                            scrollToId: "contato" 
                                        } 
                                    });
                                    window.dispatchEvent(closeEvent);
                                }}
                            >
                                Reservar Experiência
                                <MdArrowOutward />
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
};

export default ChateauGallery;
