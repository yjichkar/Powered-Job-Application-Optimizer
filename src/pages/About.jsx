import { useEffect, useRef } from "react";
import { CheckCircle, Cpu, BarChart3, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { CTASection } from "@/components/CTASection";

/* ── scroll-reveal hook ─────────────────────────────────────────── */
function useScrollReveal() {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("about-visible");
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
}

/* ── reusable animated wrapper ──────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
    const ref = useScrollReveal();
    return (
        <div
            ref={ref}
            className={`about-reveal ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

/* ── data ────────────────────────────────────────────────────────── */
const features = [
    {
        icon: Cpu,
        title: "ATS Resume Scanner",
        desc: "Our AI dissects your resume the same way Applicant Tracking Systems do — surfacing keyword gaps, formatting issues, and compatibility scores so your application never gets auto-rejected again.",
    },
    {
        icon: BarChart3,
        title: "Job-Match Analysis",
        desc: "Paste any job listing and your resume side-by-side. Our algorithms calculate a match percentage, highlight missing qualifications, and suggest targeted improvements.",
    },
    {
        icon: Sparkles,
        title: "Interview Preparation",
        desc: "Get AI-generated interview questions tailored to the specific role, company, and industry — complete with model answers and coaching tips.",
    },
];

const values = [
    {
        title: "Accessibility",
        description:
            "Career tools shouldn't be reserved for the privileged few. We make professional-grade AI accessible to everyone, completely free.",
    },
    {
        title: "Transparency",
        description:
            "We show you exactly how hiring systems work and help you navigate them effectively. No gatekeeping, no hidden tricks.",
    },
    {
        title: "Empowerment",
        description:
            "We don't just give you tools — we give you knowledge. Understanding the system helps you beat it, now and in the future.",
    },
];

/* ── component ───────────────────────────────────────────────────── */
export function About() {
    return (
        <>
            {/* ─── HERO ─────────────────────────────────────────── */}
            <section className="ds-hero-compact" style={{ paddingBottom: "80px" }}>
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(191,255,10,0.06) 0%, transparent 70%)",
                    }}
                />
                <div className="ds-hero-content">
                    <Reveal>
                        <span className="ds-label">WHO WE ARE</span>
                        <h1 className="ds-title-hero" style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>
                            ABOUT US
                        </h1>
                        <p className="ds-hero-subtitle" style={{ textTransform: "none" }}>
                            We're building the future of career optimization — one AI-powered tool at a time.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* ─── OUR STORY ────────────────────────────────────── */}
            <section className="ds-section">
                <div className="ds-container">
                    <Reveal>
                        <span className="ds-label">OUR STORY</span>
                        <h2 className="ds-title-section">
                            WHY WE <span style={{ color: "var(--accent)" }}>BUILT THIS</span>
                        </h2>
                    </Reveal>

                    <div className="about-story-grid">
                        <Reveal delay={100}>
                            <p className="about-paragraph">
                                The modern job market is fundamentally broken. Every day, millions of
                                qualified candidates have their resumes silently rejected by Applicant
                                Tracking Systems before a human ever reads them. Cold applications
                                vanish into digital black holes. Talented people are filtered out not
                                because they lack skill, but because they lack access to the insider
                                knowledge that gets resumes past the algorithmic gatekeepers.
                            </p>
                        </Reveal>

                        <Reveal delay={200}>
                            <p className="about-paragraph">
                                We started <strong style={{ color: "var(--accent)" }}>AI Powered Job Optimizer</strong> because
                                we experienced this frustration firsthand. After watching countless
                                friends — skilled engineers, talented designers, brilliant marketers —
                                struggle to even get interviews, we realized the system wasn't
                                rewarding merit. It was rewarding those who knew how to game the
                                system. And that knowledge was expensive, locked behind premium career
                                coaches, resume consultants, and exclusive networks.
                            </p>
                        </Reveal>

                        <Reveal delay={300}>
                            <p className="about-paragraph">
                                So we asked a simple question: <em>What if the most powerful career
                                tools were free and available to everyone?</em> What if AI could
                                level the playing field, giving every job seeker — from fresh
                                graduates to career changers — the same unfair advantage that was
                                previously reserved for the privileged few?
                            </p>
                        </Reveal>

                        <Reveal delay={400}>
                            <p className="about-paragraph">
                                That question became our mission. Today, AI Powered Job Optimizer
                                offers a full suite of intelligent career tools — from ATS resume
                                scanning and job-match analysis to AI-driven interview preparation
                                and cold-email generation — all powered by cutting-edge generative AI
                                and all completely free.
                            </p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ─── DIVIDER ──────────────────────────────────────── */}
            <div className="about-divider" />

            {/* ─── WHAT WE DO ───────────────────────────────────── */}
            <section className="ds-section">
                <div className="ds-container">
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: "48px" }}>
                            <span className="ds-label">WHAT WE DO</span>
                            <h2 className="ds-title-section">
                                TOOLS THAT <span style={{ color: "var(--accent)" }}>ACTUALLY WORK</span>
                            </h2>
                            <p className="ds-subtitle-centered">
                                Every tool we build is designed to solve a real, painful problem in
                                the job search process — not to look good on a landing page.
                            </p>
                        </div>
                    </Reveal>

                    <div className="about-features-grid">
                        {features.map((f, i) => (
                            <Reveal key={i} delay={i * 120}>
                                <div className="about-feature-card">
                                    <div className="ds-icon-box">
                                        <f.icon />
                                    </div>
                                    <h3 className="ds-title-card" style={{ margin: "16px 0 8px" }}>
                                        {f.title}
                                    </h3>
                                    <p className="ds-body-sm">{f.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>



            {/* ─── HOW IT WORKS ─────────────────────────────────── */}
            <section className="ds-section">
                <div className="ds-container">
                    <Reveal>
                        <span className="ds-label">UNDER THE HOOD</span>
                        <h2 className="ds-title-section">
                            HOW IT <span style={{ color: "var(--accent)" }}>WORKS</span>
                        </h2>
                    </Reveal>

                    <div className="about-story-grid" style={{ marginTop: "24px" }}>
                        <Reveal delay={100}>
                            <p className="about-paragraph">
                                At its core, AI Powered Job Optimizer is built on top of Google's
                                Gemini large language models — the same family of models powering
                                some of the most advanced AI applications in the world. We fine-tune
                                prompts and processing pipelines specifically for career-related
                                tasks, ensuring outputs are practical, accurate, and immediately
                                actionable.
                            </p>
                        </Reveal>

                        <Reveal delay={200}>
                            <p className="about-paragraph">
                                When you upload a resume or paste a job description, our system
                                doesn't just run a keyword match. It performs deep semantic analysis —
                                understanding context, industry jargon, and the subtle signals that
                                hiring managers look for. The result is nuanced, specific feedback
                                that goes far beyond what generic tools offer.
                            </p>
                        </Reveal>

                        <Reveal delay={300}>
                            <p className="about-paragraph">
                                Our platform is built with a modern React frontend and a Python
                                backend, with Firebase handling authentication. We designed the
                                architecture to be fast, responsive, and scalable — because when
                                you're mid-application and need answers, every second counts.
                            </p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ─── DIVIDER ──────────────────────────────────────── */}
            <div className="about-divider" />

            {/* ─── VALUES ───────────────────────────────────────── */}
            <section className="ds-section">
                <div className="ds-container">
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: "40px" }}>
                            <span className="ds-label">WHAT DRIVES US</span>
                            <h2 className="ds-title-section">
                                OUR <span style={{ color: "var(--accent)" }}>VALUES</span>
                            </h2>
                        </div>
                    </Reveal>

                    <div className="about-values-grid">
                        {values.map((value, index) => (
                            <Reveal key={index} delay={index * 120}>
                                <div className="ds-card ds-card-accent about-value-card">
                                    <CheckCircle
                                        style={{
                                            width: "22px",
                                            height: "22px",
                                            color: "var(--accent)",
                                            marginBottom: "12px",
                                        }}
                                    />
                                    <h3 className="ds-title-card" style={{ marginBottom: "8px" }}>
                                        {value.title}
                                    </h3>
                                    <p className="ds-body-sm">{value.description}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── VISION ───────────────────────────────────────── */}
            <section className="ds-section" style={{ background: "rgba(255,255,255,0.015)" }}>
                <div className="ds-container">
                    <Reveal>
                        <span className="ds-label">LOOKING AHEAD</span>
                        <h2 className="ds-title-section">
                            OUR <span style={{ color: "var(--accent)" }}>VISION</span>
                        </h2>
                    </Reveal>

                    <div className="about-story-grid" style={{ marginTop: "24px" }}>
                        <Reveal delay={100}>
                            <p className="about-paragraph">
                                We envision a world where landing your dream job isn't about who you
                                know or how much you can afford to spend on career services. It should
                                be about what you can do, what you're passionate about, and where you
                                want to grow. Our AI tools are designed to make that vision a reality —
                                stripping away the barriers and letting talent speak for itself.
                            </p>
                        </Reveal>

                        <Reveal delay={200}>
                            <p className="about-paragraph">
                                In the coming months, we're expanding our platform with new tools:
                                LinkedIn profile optimization, salary negotiation coaching, portfolio
                                review for designers and developers, and real-time job market trend
                                analysis. Every feature we add is driven by one question — does this
                                genuinely help someone get closer to the job they deserve?
                            </p>
                        </Reveal>

                        <Reveal delay={300}>
                            <p className="about-paragraph" style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "20px" }}>
                                "Technology should amplify human potential, not gate-keep it. That's
                                the principle at the heart of everything we build."
                            </p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ─── CTA ──────────────────────────────────────────── */}
            <CTASection
                title="Ready to Transform Your Career?"
                description="Join thousands of professionals who have accelerated their job search with our AI-powered tools."
            />
        </>
    );
}
