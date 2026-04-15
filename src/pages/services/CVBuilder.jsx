import { FileText } from "lucide-react";
import { ServicePageLayout } from "@/components/ServicePageLayout";

export function CVBuilder() {
    return (
        <ServicePageLayout
            icon={FileText}
            title="CV BUILDER"
            subtitle="Your Resume, Optimized by AI."
            description="Our AI-powered CV builder creates professionally formatted, ATS-optimized resumes tailored to your target role, helping you stand out to both automated systems and human recruiters."
            features={[
                "ATS-friendly templates",
                "Keyword optimization",
                "Achievement-focused formatting",
                "Multiple export formats",
                "Real-time editing suggestions",
                "Industry-specific layouts"
            ]}
            howItWorks={[
                {
                    step: 1,
                    title: "Import Your Data",
                    description: "Upload your existing resume or LinkedIn profile. Our AI will extract and organize your information."
                },
                {
                    step: 2,
                    title: "Choose Your Template",
                    description: "Select from professionally designed, ATS-optimized templates suited to your industry and role level."
                },
                {
                    step: 3,
                    title: "AI Enhancement",
                    description: "Our AI rewrites bullet points to emphasize achievements and incorporates relevant keywords."
                },
                {
                    step: 4,
                    title: "Export & Apply",
                    description: "Download your polished resume in PDF, DOCX, or TXT format, ready to submit to employers."
                }
            ]}
            benefits={[
                "Save hours crafting the perfect resume",
                "Ensure ATS compatibility out of the box",
                "Highlight achievements that resonate with employers",
                "Maintain consistent, professional formatting",
                "Easily customize for different job applications",
                "Stand out with polished, modern design"
            ]}
            ctaText="Build Your CV"
            apiEndpoint="cv-builder"
        />
    );
}
