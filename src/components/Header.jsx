import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header({ user, onLogout }) {
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSmoothScroll = (e, targetId) => {
        if (isHomePage) {
            e.preventDefault();
            const element = document.querySelector(targetId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
        setMobileMenuOpen(false);
    };

    return (
        <header className="ds-navbar">
            <div className="ds-navbar-inner">
                <Link to="/" className="ds-navbar-logo">
                    AI POWERED JOB OPTIMIZER
                </Link>

                <nav className="ds-navbar-links hidden md:flex">
                    {isHomePage ? (
                        <>
                            <a href="#services" onClick={(e) => handleSmoothScroll(e, "#services")} className="ds-navbar-link">SERVICES</a>
                            <a href="#features" onClick={(e) => handleSmoothScroll(e, "#features")} className="ds-navbar-link">FEATURES</a>
                        </>
                    ) : (
                        <Link to="/#services" className="ds-navbar-link">SERVICES</Link>
                    )}
                    <Link to="/about" className="ds-navbar-link">ABOUT US</Link>
                    {isHomePage ? (
                        <a href="#contact" onClick={(e) => handleSmoothScroll(e, "#contact")} className="ds-navbar-link">CONTACT</a>
                    ) : (
                        <Link to="/#contact" className="ds-navbar-link">CONTACT</Link>
                    )}
                </nav>

                <div className="ds-navbar-actions hidden md:flex">
                    {user ? (
                        <>
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{user.email}</span>
                            <button className="ds-btn ds-btn-ghost" onClick={onLogout}>LOGOUT</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"><button className="ds-btn ds-btn-ghost">LOGIN</button></Link>
                            <Link to="/signup"><button className="ds-btn ds-btn-primary" style={{ height: '40px', padding: '0 20px', fontSize: '12px' }}>GET STARTED FREE</button></Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div style={{ padding: '0 24px 20px', borderTop: '1px solid var(--border)', background: 'rgba(10,10,10,0.95)' }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '12px' }}>
                        {isHomePage ? (
                            <>
                                <a href="#services" onClick={(e) => handleSmoothScroll(e, "#services")} className="ds-navbar-link" style={{ padding: '10px 0' }}>SERVICES</a>
                                <a href="#features" onClick={(e) => handleSmoothScroll(e, "#features")} className="ds-navbar-link" style={{ padding: '10px 0' }}>FEATURES</a>
                            </>
                        ) : (
                            <Link to="/#services" className="ds-navbar-link" onClick={() => setMobileMenuOpen(false)} style={{ padding: '10px 0' }}>SERVICES</Link>
                        )}
                        <Link to="/about" className="ds-navbar-link" onClick={() => setMobileMenuOpen(false)} style={{ padding: '10px 0' }}>ABOUT US</Link>
                        {isHomePage ? (
                            <a href="#contact" onClick={(e) => handleSmoothScroll(e, "#contact")} className="ds-navbar-link" style={{ padding: '10px 0' }}>CONTACT</a>
                        ) : (
                            <Link to="/#contact" className="ds-navbar-link" onClick={() => setMobileMenuOpen(false)} style={{ padding: '10px 0' }}>CONTACT</Link>
                        )}
                        <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {user ? (
                                <button className="ds-btn ds-btn-ghost ds-btn-full" onClick={() => { onLogout(); setMobileMenuOpen(false); }}>LOGOUT</button>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}><button className="ds-btn ds-btn-ghost ds-btn-full">LOGIN</button></Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}><button className="ds-btn ds-btn-primary ds-btn-full">GET STARTED FREE</button></Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
