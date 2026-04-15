import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { CTASection } from "@/components/CTASection";
import { ServiceResultsSection } from "@/components/ServiceResultsSection";

export function ServicePageLayout({
    icon: Icon,
    title,
    subtitle,
    description,
    features,
    howItWorks,
    benefits,
    ctaText = "Get Started Free",
    apiEndpoint
}) {
    return (
        <>
            {/* Hero Section — Compact for service pages */}
            <section className="ds-hero-compact">
                <div
                    style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(191,255,10,0.06) 0%, transparent 70%)'
                    }}
                />
                <div className="ds-hero-content">
                    <div className="ds-icon-box ds-icon-box-lg" style={{ margin: '0 auto 20px' }}>
                        <Icon />
                    </div>

                    <h1 className="ds-title-hero" style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}>{title}</h1>
                    <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>{subtitle}</p>
                    <p className="ds-hero-subtitle">{description}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
                        <a href="#results">
                            <button className="ds-btn ds-btn-primary ds-btn-lg">
                                {ctaText}
                                <ArrowRight style={{ width: '18px', height: '18px' }} />
                            </button>
                        </a>
                        <Link to="/">
                            <button className="ds-btn ds-btn-outline ds-btn-lg">
                                Back to Home
                            </button>
                        </Link>
                    </div>

                    <p className="ds-trust">
                        <CheckCircle style={{ width: '14px', height: '14px', color: 'var(--accent)', display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
                        100% Free Forever • No Credit Card Required
                    </p>
                </div>
            </section>

            {/* AI Analysis Results */}
            {apiEndpoint && (
                <div id="results">
                    <ServiceResultsSection apiEndpoint={apiEndpoint} title={title} />
                </div>
            )}

            {/* Features */}
            <section className="ds-section">
                <div className="ds-container">
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <span className="ds-label">CAPABILITIES</span>
                        <h2 className="ds-title-section">KEY FEATURES</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((feature, index) => (
                            <div key={index} className="ds-card ds-card-accent" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <CheckCircle style={{ width: '18px', height: '18px', color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }} />
                                <p className="ds-body-sm" style={{ color: 'var(--text-primary)' }}>{feature}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="ds-section">
                <div className="ds-container">
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <span className="ds-label">PROCESS</span>
                        <h2 className="ds-title-section">HOW IT WORKS</h2>
                    </div>
                    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {howItWorks.map((step, index) => (
                            <div key={index} className="ds-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <div className="ds-step-badge">{step.step}</div>
                                <div>
                                    <h3 className="ds-title-card" style={{ marginBottom: '4px' }}>{step.title}</h3>
                                    <p className="ds-body-sm">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="ds-section">
                <div className="ds-container">
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <span className="ds-label">ADVANTAGES</span>
                        <h2 className="ds-title-section">WHY USE THIS SERVICE</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        {benefits.map((benefit, index) => (
                            <div key={index} className="ds-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <CheckCircle style={{ width: '18px', height: '18px', color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }} />
                                <p className="ds-body-sm" style={{ color: 'var(--text-primary)' }}>{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <CTASection
                title="Ready to Get Started?"
                description="Join thousands of job seekers who have accelerated their career with our AI-powered tools."
                primaryText={ctaText}
            />
        </>
    );
}
