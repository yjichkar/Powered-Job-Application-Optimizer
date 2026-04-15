import { HeroSection } from "@/components/HeroSection";
import { ScrollingText } from "@/components/ScrollingText";
import { JobInputSection } from "@/components/JobInputSection";
import { ServicesSection } from "@/components/ServicesSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { CTASection } from "@/components/CTASection";
import { useJobData } from "@/context/JobDataContext";

export function Home() {
    const { submitJobData } = useJobData();

    return (
        <>
            <HeroSection />
            <ScrollingText />
            <JobInputSection
                serviceTitle="AI Job Optimizer"
                onSubmit={submitJobData}
            />
            <ServicesSection />
            <FeaturesSection />
            <CTASection />
        </>
    );
}
