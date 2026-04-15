import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function CTASection({
    title = "READY TO UPGRADE?",
    description = "Join thousands of professionals who have transformed their careers with our AI-powered platform. Start your journey today and unlock your full potential — completely free.",
    primaryText = "START NOW - IT'S FREE",
    secondaryText = "VIEW ALL FEATURES"
}) {
    return (
        <section className="ds-cta-section" id="contact">
            <div className="ds-cta-card">
                <h2 className="ds-title-section">{title}</h2>
                <p className="ds-subtitle-centered" style={{ marginBottom: '4px' }}>
                    {description}
                </p>
                <div className="ds-cta-buttons">
                    <Link to="/signup">
                        <button className="ds-btn ds-btn-primary ds-btn-lg">
                            {primaryText}
                            <ArrowRight style={{ width: '18px', height: '18px' }} />
                        </button>
                    </Link>
                    <Link to="/#features">
                        <button className="ds-btn ds-btn-outline ds-btn-lg">
                            {secondaryText}
                        </button>
                    </Link>
                </div>
                <p className="ds-trust">
                    100% Free Forever • No Credit Card Required • Unlimited Access
                </p>
            </div>
        </section>
    );
}
