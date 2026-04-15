import { Target } from "lucide-react";
import { ServicePageLayout } from "@/components/ServicePageLayout";

export function JobMatch() {
    return (
        <ServicePageLayout
            icon={Target}
            title="JOB MATCH"
            subtitle="Know Your Odds Before You Apply."
            description="Our AI-powered job matching algorithm analyzes your resume against job descriptions to give you an accurate compatibility score, helping you focus on opportunities where you're most likely to succeed."
            features={[
                "Instant compatibility percentage",
                "Skills gap identification",
                "Experience level matching",
                "Qualification alignment analysis",
                "Salary range estimation",
                "Company culture fit assessment"
            ]}
            howItWorks={[
                {
                    step: 1,
                    title: "Submit Your Resume",
                    description: "Upload your resume and paste the job description you're interested in applying for."
                },
                {
                    step: 2,
                    title: "AI-Powered Analysis",
                    description: "Our algorithm compares your qualifications against 40+ relevance points from the job posting."
                },
                {
                    step: 3,
                    title: "Get Your Match Score",
                    description: "Receive a detailed breakdown showing your compatibility percentage and areas of strength."
                },
                {
                    step: 4,
                    title: "Optimize Your Approach",
                    description: "Use our recommendations to tailor your application or identify skill gaps to address."
                }
            ]}
            benefits={[
                "Save time by focusing on roles where you're most competitive",
                "Understand exactly what employers are looking for",
                "Identify hidden opportunities in job requirements",
                "Reduce application anxiety with data-driven insights",
                "Improve your success rate with targeted applications",
                "Make informed decisions about career opportunities"
            ]}
            ctaText="Calculate Your Match"
            apiEndpoint="job-suitability"
        />
    );
}
