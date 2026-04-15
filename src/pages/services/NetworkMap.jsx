import { Network } from "lucide-react";
import { ServicePageLayout } from "@/components/ServicePageLayout";

export function NetworkMap() {
    return (
        <ServicePageLayout
            icon={Network}
            title="NETWORK MAP"
            subtitle="Find the Right People, Make the Right Connections."
            description="Our AI-powered Network Map tool identifies key decision-makers, recruiters, and team members at your target companies, helping you build strategic connections that lead to opportunities."
            features={[
                "Decision-maker identification",
                "Recruiter discovery",
                "Team member insights",
                "Connection strategy tips",
                "LinkedIn profile analysis",
                "Networking priority ranking"
            ]}
            howItWorks={[
                {
                    step: 1,
                    title: "Target Your Company",
                    description: "Share the company and role you're interested in. We'll analyze the organization structure."
                },
                {
                    step: 2,
                    title: "People Discovery",
                    description: "Our AI identifies relevant recruiters, hiring managers, and team members to connect with."
                },
                {
                    step: 3,
                    title: "Connection Strategy",
                    description: "Receive personalized suggestions on who to reach out to first and how to approach them."
                },
                {
                    step: 4,
                    title: "Build Your Network",
                    description: "Use our outreach templates to make meaningful connections that can lead to referrals."
                }
            ]}
            benefits={[
                "Skip the application black hole with direct connections",
                "Identify hidden opportunities through networking",
                "Get insider insights about company culture and roles",
                "Increase your chances of getting referrals",
                "Build a professional network that supports your career",
                "Access the 80% of jobs that are never publicly posted"
            ]}
            ctaText="Map Your Network"
            apiEndpoint="linkedin-people"
        />
    );
}
