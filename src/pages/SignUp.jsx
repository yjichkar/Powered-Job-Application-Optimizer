import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) { setError("Passwords do not match."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            switch (err.code) {
                case "auth/email-already-in-use": setError("An account with this email already exists."); break;
                case "auth/invalid-email": setError("Invalid email address."); break;
                case "auth/weak-password": setError("Password is too weak. Use at least 6 characters."); break;
                default: setError("Sign up failed. Please try again.");
            }
        } finally { setLoading(false); }
    };

    const inputStyle = { position: 'relative' };
    const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'var(--text-faint)' };

    return (
        <section className="ds-auth-section">
            <div
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 50% 40% at 50% 40%, rgba(191,255,10,0.06) 0%, transparent 70%)'
                }}
            />

            <div className="ds-auth-container">
                <div className="ds-auth-header">
                    <h1 className="ds-title-hero" style={{ fontSize: 'clamp(28px, 5vw, 40px)' }}>JOIN FREE</h1>
                    <p className="ds-subtitle-centered">Create your account and start optimizing</p>
                </div>

                <div className="ds-auth-card">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {error && <div className="ds-error">{error}</div>}

                        <div>
                            <label className="ds-form-label">Full Name</label>
                            <div style={inputStyle}>
                                <User style={iconStyle} />
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="ds-input ds-input-icon" />
                            </div>
                        </div>

                        <div>
                            <label className="ds-form-label">Email</label>
                            <div style={inputStyle}>
                                <Mail style={iconStyle} />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="ds-input ds-input-icon" />
                            </div>
                        </div>

                        <div>
                            <label className="ds-form-label">Password</label>
                            <div style={inputStyle}>
                                <Lock style={iconStyle} />
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required className="ds-input ds-input-icon" style={{ paddingRight: '44px' }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                    {showPassword ? <EyeOff style={{ width: '18px', height: '18px', color: 'var(--text-faint)' }} /> : <Eye style={{ width: '18px', height: '18px', color: 'var(--text-faint)' }} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="ds-form-label">Confirm Password</label>
                            <div style={inputStyle}>
                                <Lock style={iconStyle} />
                                <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required className="ds-input ds-input-icon" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="ds-btn ds-btn-primary ds-btn-lg ds-btn-full" style={{ marginTop: '4px' }}>
                            {loading ? "Creating account..." : "CREATE ACCOUNT"}
                            {!loading && <ArrowRight style={{ width: '18px', height: '18px' }} />}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            Already have an account?{" "}
                            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Log in</Link>
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '8px' }}>
                            100% Free • No Credit Card Required
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
