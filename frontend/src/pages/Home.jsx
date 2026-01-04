import HeroSection from "../sections/HeroSection";
import StatsSection from "../sections/StatsSection";
import ProgramSection from "../sections/ProgramsSection";
import Footer from "../components/Footer";

export default function Home(){
    return (
        <>
            <HeroSection />
            <StatsSection />
            <ProgramSection />
            <Footer />
        </>
    )
}