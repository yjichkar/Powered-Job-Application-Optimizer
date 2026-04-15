import { Scan } from "lucide-react";
import { ServicePageLayout } from "@/components/ServicePageLayout";

export function ATSScanner() {
    return (
        <ServicePageLayout
            icon={Scan}
            title="ATS SCANNER"
            subtitle="Beat the Bots. Get Your Resume Seen by Humans."
            description="Our AI-powered ATS Scanner analyzes your resume against the same algorithms used by Fortune 500 companies, ensuring your application passes through Applicant Tracking Systems and reaches actual recruiters."
            features={[
                "Real-time ATS compatibility score",
                "Keyword optimization suggestions",
                "Format and structure analysis",
                "Industry-specific recommendations",
                "File format validation",
                "Section completeness check"
            ]}
            howItWorks={[
                {
                    step: 1,
                    title: "Upload Your Resume",
                    description: "Drop your resume in PDF, DOCX, or TXT format. Our system accepts all major file types used by real ATS systems."
                },
                {
                    step: 2,
                    title: "Instant AI Analysis",
                    description: "Our advanced AI scans your resume using the same algorithms as major ATS platforms like Taleo, Workday, and Greenhouse."
                },
                {
                    step: 3,
                    title: "Get Detailed Report",
                    description: "Receive a comprehensive breakdown of your ATS score, missing keywords, formatting issues, and actionable improvements."
                },
                {
                    step: 4,
                    title: "Optimize & Resubmit",
                    description: "Apply our suggestions, rescan your updated resume, and watch your compatibility score improve to 90%+."
                }
            ]}
            benefits={[
                "Increase your interview callback rate by up to 300%",
                "Ensure your resume passes automated screening filters",
                "Save hours of manual keyword research and formatting",
                "Understand exactly what recruiters' systems are looking for",
                "Get specific, actionable feedback instead of generic advice",
                "Compatible with all major ATS platforms used by employers"
            ]}
            ctaText="Scan Your Resume Now"
            apiEndpoint="ats-scanner"
        />
    );
}
