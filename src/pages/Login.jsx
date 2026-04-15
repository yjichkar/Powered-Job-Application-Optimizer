import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            switch (err.code) {
                case "auth/invalid-credential": setError("Invalid email or password."); break;
                case "auth/user-not-found": setError("No account found with this email."); break;
                case "auth/wrong-password": setError("Incorrect password."); break;
                case "auth/too-many-requests": setError("Too many attempts. Please try again later."); break;
                default: setError("Login failed. Please try again.");
            }
        } finally { setLoading(false); }
    };

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
                    <h1 className="ds-title-hero" style={{ fontSize: 'clamp(28px, 5vw, 40px)' }}>WELCOME BACK</h1>
                    <p className="ds-subtitle-centered">Log in to your account to continue</p>
                </div>

                <div className="ds-auth-card">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {error && <div className="ds-error">{error}</div>}

                        <div>
                            <label className="ds-form-label">Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'var(--text-faint)' }} />
                                <input
                                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com" required
                                    className="ds-input ds-input-icon"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="ds-form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'var(--text-faint)' }} />
                                <input
                                    type={showPassword ? "text" : "password"} value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password" required
                                    className="ds-input ds-input-icon" style={{ paddingRight: '44px' }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                    {showPassword ? <EyeOff style={{ width: '18px', height: '18px', color: 'var(--text-faint)' }} /> : <Eye style={{ width: '18px', height: '18px', color: 'var(--text-faint)' }} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="ds-btn ds-btn-primary ds-btn-lg ds-btn-full" style={{ marginTop: '4px' }}>
                            {loading ? "Signing in..." : "LOG IN"}
                            {!loading && <ArrowRight style={{ width: '18px', height: '18px' }} />}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            Don't have an account?{" "}
                            <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign up free</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
