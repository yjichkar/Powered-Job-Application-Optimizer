import { Check, Zap, Target, BarChart3, MessageSquare, FileText } from "lucide-react";

const features = [
    { title: "ATS OPTIMIZATION", description: "AI-powered resume optimization with real-time feedback for maximum compatibility.", icon: Zap },
    { title: "SKILL ANALYSIS", description: "Advanced ATS compatibility scoring and gap analysis for your target roles.", icon: BarChart3 },
    { title: "CAREER MAPPING", description: "Personalized career trajectory mapping based on industry trends.", icon: Target },
    { title: "KEYWORD INTEL", description: "Industry-specific keyword intelligence to boost your visibility.", icon: MessageSquare },
    { title: "JOB MATCHING", description: "Automated job matching algorithms that find your perfect fit.", icon: FileText },
    { title: "INTERVIEW PREP", description: "AI-generated interview questions tailored to your target position.", icon: Check }
];

export function FeaturesSection() {
    return (
        <section className="ds-section" id="features">
            <div className="ds-container">
                <div style={{ marginBottom: '40px' }}>
                    <span className="ds-label">WHAT SETS US APART</span>
                    <h2 className="ds-title-section">KEY FEATURES</h2>
                    <p className="ds-subtitle">
                        Everything you need to optimize your job search and land your dream position.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <div key={index} className="ds-card ds-card-accent">
                            <div className="ds-icon-box" style={{ marginBottom: '16px' }}>
                                <feature.icon />
                            </div>
                            <h3 className="ds-title-card" style={{ marginBottom: '8px' }}>{feature.title}</h3>
                            <p className="ds-body-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
