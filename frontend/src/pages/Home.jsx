import HeroSection from "../sections/HeroSection";
import StatsSection from "../sections/StatsSection";
import ProgramSection from "../sections/ProgramsSection";


export default function Home() {
    return (
        <>
            <div className="p-6 bg-white dark:bg-black text-black dark:text-white">
                If this changes, dark mode works
            </div>

            <HeroSection />
            <StatsSection />
            <ProgramSection />

        </>
    )
}