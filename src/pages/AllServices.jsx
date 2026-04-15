import { ServiceCard } from "@/components/ServiceCard";
import { Scan, Target, BarChart3, MessageSquare, FileText, Mail, Network, TrendingUp } from "lucide-react";

const services = [
    { icon: Scan, title: "ATS SCANNER", description: "Ensure your resume passes through applicant tracking systems with our AI-powered analysis.", link: "/services/ats-scanner" },
    { icon: Target, title: "JOB MATCH", description: "Calculate your match percentage for any role and understand your compatibility.", link: "/services/job-match" },
    { icon: BarChart3, title: "SKILL GAP", description: "Identify missing skills and get a personalized roadmap to your target role.", link: "/services/skill-gap" },
    { icon: MessageSquare, title: "INTERVIEW PREP", description: "Practice with AI-generated interview questions tailored to your target role.", link: "/services/interview-prep" },
    { icon: FileText, title: "CV BUILDER", description: "Generate an optimized, ATS-friendly resume for your target position.", link: "/services/cv-builder" },
    { icon: Mail, title: "COLD EMAIL", description: "Generate personalized outreach messages that get responses from hiring managers.", link: "/services/cold-email" },
    { icon: Network, title: "NETWORK MAP", description: "Find key decision-makers and recruiters at your target companies.", link: "/services/network-map" },
    { icon: TrendingUp, title: "RESPONSE RATE", description: "Estimate your callback probability and get recommendations to improve it.", link: "/services/response-rate" }
];

export function AllServices() {
    return (
        <>
            {/* Compact Hero */}
            <section className="ds-hero-compact">
                <div
                    style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(191,255,10,0.06) 0%, transparent 70%)'
                    }}
                />
                <div className="ds-hero-content">
                    <span className="ds-label">OUR TOOLKIT</span>
                    <h1 className="ds-title-hero" style={{ fontSize: 'clamp(32px, 6vw, 52px)' }}>ALL SERVICES</h1>
                    <p className="ds-hero-subtitle">
                        Explore our complete suite of AI-powered career tools designed to help you land your dream job.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="ds-section">
                <div className="ds-container-wide" style={{ maxWidth: 'var(--container-wide)' }}>
                    <div className="services-section__grid">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={service.title}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                                index={index}
                                link={service.link}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
