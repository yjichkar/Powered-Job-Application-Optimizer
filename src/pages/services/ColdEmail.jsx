import { Mail } from "lucide-react";
import { ServicePageLayout } from "@/components/ServicePageLayout";

export function ColdEmail() {
    return (
        <ServicePageLayout
            icon={Mail}
            title="COLD EMAIL"
            subtitle="Get Responses, Not Silence."
            description="Our AI-powered cold email generator creates personalized, compelling outreach messages that cut through the noise and get responses from hiring managers and recruiters."
            features={[
                "Personalized message templates",
                "Subject line optimization",
                "Follow-up sequence builder",
                "LinkedIn message variants",
                "A/B testing suggestions",
                "Response rate analytics"
            ]}
            howItWorks={[
                {
                    step: 1,
                    title: "Identify Your Target",
                    description: "Share the company and role you're targeting. We'll help you craft the perfect outreach strategy."
                },
                {
                    step: 2,
                    title: "AI Message Generation",
                    description: "Our AI creates personalized emails that reference your background and the recipient's context."
                },
                {
                    step: 3,
                    title: "Refine & Customize",
                    description: "Edit and personalize the generated messages to add your unique voice and specific details."
                },
                {
                    step: 4,
                    title: "Send & Track",
                    description: "Send your messages and use our follow-up templates to maintain momentum in your outreach."
                }
            ]}
            benefits={[
                "Stand out in crowded inboxes with personalized messaging",
                "Save hours writing and rewriting outreach emails",
                "Increase response rates with proven templates",
                "Build meaningful professional connections",
                "Access hidden job opportunities through networking",
                "Follow up effectively without being pushy"
            ]}
            ctaText="Generate Cold Email"
            apiEndpoint="cold-email"
        />
    );
}
