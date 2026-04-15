import { Link } from "react-router";
import { Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="ds-footer">
            <div className="ds-footer-inner">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="ds-navbar-logo" style={{ display: 'inline-block', marginBottom: '12px' }}>
                            AI POWERED JOB OPTIMIZER
                        </Link>
                        <p className="ds-body-sm" style={{ color: 'var(--text-muted)', marginBottom: '16px', maxWidth: '260px' }}>
                            AI-powered career advancement platform helping professionals achieve their goals.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="ds-footer-heading">QUICK LINKS</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link to="/about" className="ds-footer-link">About Us</Link>
                            <Link to="/services" className="ds-footer-link">Services</Link>
                            <Link to="/#features" className="ds-footer-link">Features</Link>
                            <Link to="/#contact" className="ds-footer-link">Contact</Link>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="ds-footer-heading">RESOURCES</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <a href="#" className="ds-footer-link">FAQ</a>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="ds-footer-heading">STAY UPDATED</h3>
                        <p className="ds-body-sm" style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Get the latest updates and insights delivered to your inbox.</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="email" placeholder="Your email" className="ds-input" style={{ height: '40px', fontSize: '13px', flex: 1 }} />
                            <button className="ds-btn ds-btn-primary" style={{ height: '40px', padding: '0 14px', flexShrink: 0 }}>
                                <Mail style={{ width: '16px', height: '16px' }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    paddingTop: '20px', borderTop: '1px solid var(--border)',
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
                }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>© 2026 AI Powered Job Optimizer. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <a href="#" className="ds-footer-link" style={{ fontSize: '12px' }}>Privacy Policy</a>
                        <a href="#" className="ds-footer-link" style={{ fontSize: '12px' }}>Terms of Service</a>
                        <a href="#" className="ds-footer-link" style={{ fontSize: '12px' }}>Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
