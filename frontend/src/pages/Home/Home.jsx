import React from 'react'
import Hero from '../../components/Hero/Hero'
import Welcome from '../../components/Welcome/Welcome'
import Choose from '../../components/Choose/Choose'
import StickyCols from '../../components/StickyCols/StickyCols'
import Gallery from '../../components/Gallery/Gallery'
import MarqueeSticky from '../../components/Layouts/MarqueeSticky'
import MapLink from '../../components/MapLink/MapLink'
import Activities from '../../components/Activities/Activities'
import Showcase from '../../components/Showcase/Showcase'
import FooterBanner from '../../components/FooterBanner/FooterBanner'
import { requestSettledScrollRefresh } from '../../lib/scrollRefresh'

// ✅ LAZY LOAD HEAVY COMPONENTS (Removes Three.js WebGL and reviews list from main JS bundle)
const ChateauGallery = React.lazy(() => import('../../components/ChateauGallery/ChateauGallery'));
const Feedback = React.lazy(() => import('../../components/Feedback/Feedback'));

const LazySectionFallback = ({ className = "" }) => (
    <section
        className={`w-full min-h-[100dvh] bg-[#181717] ${className}`}
        aria-hidden="true"
    />
);

const LayoutReadyBoundary = ({ children }) => {
    React.useEffect(() => {
        requestSettledScrollRefresh({ force: false });
    }, []);

    return children;
};

const Home = () => {
    return (
        <div>
            <Hero />
            <Welcome />
            <Choose />
            <Gallery />
            <MapLink />
            <MarqueeSticky />
            <StickyCols />
            <React.Suspense fallback={<LazySectionFallback />}>
                <LayoutReadyBoundary>
                    <ChateauGallery />
                </LayoutReadyBoundary>
            </React.Suspense>
            <Activities />
            <Showcase />
            <React.Suspense fallback={<LazySectionFallback />}>
                <LayoutReadyBoundary>
                    <Feedback />
                </LayoutReadyBoundary>
            </React.Suspense>
            <FooterBanner />
        </div >
    )
}

export default Home
