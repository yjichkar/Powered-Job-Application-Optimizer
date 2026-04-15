import { ServiceCard } from "@/components/ServiceCard";
import { Link } from "react-router";
import {
    Scan,
    Target,
    BarChart3,
    MessageSquare,
    FileText,
    Mail,
    Network,
    TrendingUp
} from "lucide-react";

const services = [
    {
        icon: Scan,
        title: "ATS SCANNER",
        description: "Ensure your resume passes through applicant tracking systems with a perfect compatibility score.",
        link: "/services/ats-scanner"
    },
    {
        icon: Target,
        title: "JOB MATCH",
        description: "Calculate your match percentage for any role and discover hidden fit factors.",
        link: "/services/job-match"
    },
    {
        icon: BarChart3,
        title: "SKILL GAP",
        description: "Identify missing skills for your target role and get a personalized learning roadmap.",
        link: "/services/skill-gap"
    },
    {
        icon: MessageSquare,
        title: "INTERVIEW PREP",
        description: "Practice with AI-generated interview questions tailored to your target position.",
        link: "/services/interview-prep"
    },
    {
        icon: FileText,
        title: "CV BUILDER",
        description: "Generate an ATS-optimized resume crafted specifically for your dream role.",
        link: "/services/cv-builder"
    },
    {
        icon: Mail,
        title: "COLD EMAIL",
        description: "Generate personalized outreach emails that actually get opened and responded to.",
        link: "/services/cold-email"
    },
    {
        icon: Network,
        title: "NETWORK MAP",
        description: "Find key decision-makers and warm connections at your target companies.",
        link: "/services/network-map"
    },
    {
        icon: TrendingUp,
        title: "RESPONSE RATE",
        description: "Estimate your callback probability and optimize your application strategy.",
        link: "/services/response-rate"
    }
];

export function ServicesSection() {
    return (
        <section className="services-section" id="services">
            {/* Background layers */}
            <div className="services-section__bg-radial" />
            <div className="services-section__bg-noise" />

            <div className="services-section__content">
                {/* Header row */}
                <div className="services-section__header">
                    <div className="services-section__header-text">
                        <p className="services-section__label">WHAT WE OFFER</p>
                        <h2 className="services-section__title">AVAILABLE SERVICES</h2>
                        <p className="services-section__subtitle">
                            AI-powered tools to supercharge every step of your job search
                        </p>
                    </div>
                    <Link to="/services" className="services-section__explore-btn">
                        <span className="services-section__explore-btn-glow" />
                        <span className="services-section__explore-btn-text">
                            EXPLORE ALL
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </Link>
                </div>

                {/* Cards grid */}
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
    );
}
