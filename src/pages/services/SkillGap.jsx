import { BarChart3 } from "lucide-react";
import { ServicePageLayout } from "@/components/ServicePageLayout";

export function SkillGap() {
    return (
        <ServicePageLayout
            icon={BarChart3}
            title="SKILL GAP"
            subtitle="Bridge the Gap to Your Dream Role."
            description="Our AI-powered skill gap analysis identifies exactly what skills you're missing for your target role and provides a personalized roadmap to acquire them quickly and effectively."
            features={[
                "Comprehensive skills assessment",
                "Priority-ranked learning paths",
                "Course and certification recommendations",
                "Time-to-competency estimates",
                "Industry trend insights",
                "Progress tracking dashboard"
            ]}
            howItWorks={[
                {
                    step: 1,
                    title: "Define Your Goal",
                    description: "Share your target role and current experience. We'll analyze the skills gap between where you are and where you want to be."
                },
                {
                    step: 2,
                    title: "Skills Mapping",
                    description: "Our AI maps your current skillset against the requirements of your target position across technical and soft skills."
                },
                {
                    step: 3,
                    title: "Gap Identification",
                    description: "Receive a detailed report showing which skills you're missing, their importance, and market demand."
                },
                {
                    step: 4,
                    title: "Learning Roadmap",
                    description: "Get a personalized learning plan with recommended courses, certifications, and practical projects."
                }
            ]}
            benefits={[
                "Focus your learning on the most impactful skills",
                "Accelerate your career progression timeline",
                "Stay ahead of industry trends and requirements",
                "Make informed decisions about professional development",
                "Increase your value in the job market",
                "Build confidence with a clear development plan"
            ]}
            ctaText="Analyze Your Skills"
            apiEndpoint="skill-gap"
        />
    );
}
