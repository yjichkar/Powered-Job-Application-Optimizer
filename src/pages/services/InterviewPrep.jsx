import { MessageSquare } from "lucide-react";
import { ServicePageLayout } from "@/components/ServicePageLayout";

export function InterviewPrep() {
    return (
        <ServicePageLayout
            icon={MessageSquare}
            title="INTERVIEW PREP"
            subtitle="Walk In Confident. Walk Out Hired."
            description="Our AI-powered interview preparation tool generates role-specific questions and provides coaching on how to deliver compelling answers that resonate with hiring managers."
            features={[
                "Role-specific question bank",
                "Behavioral interview coaching",
                "Technical question practice",
                "STAR method guidance",
                "Answer feedback and scoring",
                "Mock interview simulations"
            ]}
            howItWorks={[
                {
                    step: 1,
                    title: "Share the Role",
                    description: "Provide the job description and your resume so we can generate personalized interview questions."
                },
                {
                    step: 2,
                    title: "Practice Questions",
                    description: "Work through a curated set of likely interview questions tailored to your target role and experience."
                },
                {
                    step: 3,
                    title: "Get AI Feedback",
                    description: "Receive detailed feedback on your answers with suggestions for improvement and stronger examples."
                },
                {
                    step: 4,
                    title: "Build Confidence",
                    description: "Practice until you feel confident, then walk into your interview ready to impress."
                }
            ]}
            benefits={[
                "Know what questions to expect before your interview",
                "Learn how to structure compelling answers",
                "Practice in a stress-free environment",
                "Identify and strengthen weak points in your responses",
                "Build confidence through repetition and feedback",
                "Stand out from unprepared candidates"
            ]}
            ctaText="Start Practicing"
            apiEndpoint="interview-prep"
        />
    );
}
