import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function HeroSection() {
    return (
        <section className="ds-hero">
            {/* Background glow */}
            <div
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(191, 255, 10, 0.08) 0%, transparent 70%)'
                }}
            />

            <div className="ds-hero-content">
                <h1 className="ds-title-hero">
                    AI POWERED JOB OPTIMIZER
                </h1>

                <p className="ds-hero-subtitle">
                    AI-powered precision matchmaking for modern career strategy via next-gen adaptive algorithms
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Link to="/signup">
                        <button className="ds-btn ds-btn-primary ds-btn-lg">
                            GET STARTED FREE
                            <ArrowRight style={{ width: '18px', height: '18px' }} />
                        </button>
                    </Link>
                    <a href="#services">
                        <button className="ds-btn ds-btn-outline ds-btn-lg">
                            LEARN MORE
                        </button>
                    </a>
                </div>

                <p className="ds-trust">
                    100% Free • No Credit Card Required
                </p>
            </div>

            {/* Scroll Indicator */}
            <div className="ds-scroll-indicator">
                <div className="ds-scroll-indicator-pill">
                    <div className="ds-scroll-indicator-dot" />
                </div>
            </div>
        </section>
    );
}
