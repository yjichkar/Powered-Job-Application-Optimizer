import { TrendingUp } from "lucide-react";
import { ServicePageLayout } from "@/components/ServicePageLayout";

export function ResponseRate() {
    return (
        <ServicePageLayout
            icon={TrendingUp}
            title="RESPONSE RATE"
            subtitle="Know Your Chances Before You Apply."
            description="Our AI-powered Response Rate predictor analyzes your profile against job requirements and market conditions to estimate your callback probability and suggest improvements."
            features={[
                "Callback probability score",
                "Factor breakdown analysis",
                "Competitive landscape insights",
                "Improvement recommendations",
                "Market timing suggestions",
                "Application strategy tips"
            ]}
            howItWorks={[
                {
                    step: 1,
                    title: "Submit Your Profile",
                    description: "Upload your resume and share the job posting you're interested in applying for."
                },
                {
                    step: 2,
                    title: "Market Analysis",
                    description: "Our AI analyzes current market conditions, competition levels, and hiring trends for the role."
                },
                {
                    step: 3,
                    title: "Probability Calculation",
                    description: "Receive a detailed probability score based on your qualifications and market factors."
                },
                {
                    step: 4,
                    title: "Optimization Tips",
                    description: "Get specific recommendations on how to improve your chances of getting a callback."
                }
            ]}
            benefits={[
                "Set realistic expectations for your job search",
                "Prioritize applications with higher success probability",
                "Understand what factors influence hiring decisions",
                "Identify areas to improve for better outcomes",
                "Make data-driven decisions about where to apply",
                "Reduce frustration and optimize your time"
            ]}
            ctaText="Check Your Odds"
            apiEndpoint="callback-probability"
        />
    );
}
