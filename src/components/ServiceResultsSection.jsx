import { useState } from "react";
import { useJobData } from "@/context/JobDataContext";
import { ArrowRight, Loader2, Upload, CheckCircle, Link as LinkIcon, ExternalLink, Search, Building2, Users } from "lucide-react";
import { Link } from "react-router";

export function ServiceResultsSection({ apiEndpoint, title }) {
    const { jobData, callService, getServiceResult } = useJobData();

    const cachedResult = getServiceResult(apiEndpoint);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const displayResult = result || cachedResult;

    const handleAnalyze = async () => {
        setError("");
        setLoading(true);
        try {
            const data = await callService(apiEndpoint);
            if (data.error) setError(data.error);
            else setResult(data);
        } catch (err) { setError("Failed to get results. Please try again."); }
        finally { setLoading(false); }
    };

    // ─── No data submitted — polished empty state ───
    if (!jobData.submitted) {
        return (
            <section className="ds-cta-section">
                <div className="ds-cta-card" style={{ maxWidth: '640px' }}>
                    <div className="ds-empty-state">
                        <div className="ds-icon-box ds-icon-box-lg" style={{ margin: '0 auto 16px' }}>
                            <Upload />
                        </div>
                        <h2 className="ds-title-section" style={{ fontSize: '22px', marginBottom: '8px' }}>Upload Your Data First</h2>
                        <p className="ds-subtitle-centered" style={{ marginBottom: '24px' }}>
                            Go to the home page and submit your resume and job URL to unlock this service.
                        </p>
                        <Link to="/">
                            <button className="ds-btn ds-btn-primary ds-btn-lg">
                                Go to Home Page
                                <ArrowRight style={{ width: '18px', height: '18px' }} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    // ─── Results view ───
    if (displayResult) {
        const isLinkedIn = apiEndpoint === "linkedin-people";

        // Extract external links (if present) so they render as buttons, not raw JSON
        const externalLinks = displayResult?._external_links || [];
        const filteredResult = { ...displayResult };
        delete filteredResult._external_links;

        return (
            <section className="ds-section">
                <div className="ds-container">
                    <div className="ds-card-elevated" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div className="ds-icon-box">
                                <CheckCircle />
                            </div>
                            <h2 className="ds-title-section" style={{ fontSize: '20px', margin: 0 }}>
                                {title} Results
                            </h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {isLinkedIn ? renderLinkedInResults(filteredResult) : renderResultData(filteredResult)}
                        </div>

                        {/* External source buttons */}
                        {externalLinks.length > 0 && (
                            <div style={{
                                marginTop: '20px',
                                paddingTop: '16px',
                                borderTop: '1px solid var(--border)',
                                display: 'flex',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}>
                                {externalLinks.map((link, i) => (
                                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                        <button className="ds-btn ds-btn-outline" style={{
                                            fontSize: '13px',
                                            padding: '10px 18px',
                                            gap: '6px',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            {link.label}
                                            <ExternalLink style={{ width: '13px', height: '13px' }} />
                                        </button>
                                    </a>
                                ))}
                            </div>
                        )}

                        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                            <button className="ds-btn ds-btn-outline" onClick={handleAnalyze}>
                                Re-analyze
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ─── Ready to analyze ───
    return (
        <section className="ds-cta-section">
            <div className="ds-cta-card" style={{ maxWidth: '640px' }}>
                <div className="ds-empty-state">
                    <h2 className="ds-title-section" style={{ fontSize: '22px', marginBottom: '8px' }}>Run {title} Analysis</h2>
                    <p className="ds-subtitle-centered" style={{ marginBottom: '20px' }}>
                        Your data is ready. Click below to get your personalized {title.toLowerCase()} results.
                    </p>

                    <div style={{ maxWidth: '380px', margin: '0 auto 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {jobData.resumeFile && (
                            <div className="ds-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                                <CheckCircle style={{ width: '15px', height: '15px', color: 'var(--accent)', flexShrink: 0 }} />
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Resume: {jobData.resumeFile.name}</p>
                            </div>
                        )}
                        {jobData.jobUrl && (
                            <div className="ds-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                                <LinkIcon style={{ width: '15px', height: '15px', color: 'var(--accent)', flexShrink: 0 }} />
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{jobData.jobUrl}</p>
                            </div>
                        )}
                    </div>

                    {error && <div className="ds-error" style={{ marginBottom: '16px' }}>{error}</div>}

                    <button className="ds-btn ds-btn-primary ds-btn-lg" onClick={handleAnalyze} disabled={loading}>
                        {loading ? (
                            <><Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} /> Analyzing...</>
                        ) : (
                            <>Analyze Now <ArrowRight style={{ width: '18px', height: '18px' }} /></>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
}

// ─── LinkedIn Network Map Results ───
function renderLinkedInResults(data) {
    if (!data || typeof data !== "object") return renderResultData(data);

    const company = data.company || "the company";
    const roleTitle = data.role_title || "";
    const people = data.people || [];
    const companyUrl = data.company_linkedin_url || "";

    // Fallback: if old format with "searches" array
    if (!people.length && data.searches) {
        return renderLegacyLinkedInResults(data);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Company header */}
            <div className="ds-card" style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(10, 102, 194, 0.15) 0%, rgba(191, 255, 10, 0.05) 100%)',
                borderColor: 'rgba(10, 102, 194, 0.3)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Building2 style={{ width: '22px', height: '22px', color: '#0a66c2' }} />
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            {company}
                        </h3>
                        {roleTitle && (
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Target Role: {roleTitle}
                            </p>
                        )}
                    </div>
                </div>
                {companyUrl && (
                    <a href={companyUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button className="ds-btn ds-btn-outline" style={{
                            borderColor: '#0a66c2',
                            color: '#0a66c2',
                            fontSize: '13px',
                            padding: '8px 16px',
                            gap: '6px'
                        }}>
                            <Building2 style={{ width: '14px', height: '14px' }} />
                            View Company on LinkedIn
                            <ExternalLink style={{ width: '12px', height: '12px' }} />
                        </button>
                    </a>
                )}
            </div>

            {/* People to connect with */}
            <div>
                <p style={{
                    fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px'
                }}>
                    People to Connect With
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {people.map((person, i) => (
                        <div key={i} className="ds-card" style={{
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            transition: 'border-color 0.2s, transform 0.2s',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Users style={{ width: '16px', height: '16px', color: '#fff' }} />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <p style={{
                                        fontFamily: 'var(--font-display)', fontSize: '14px',
                                        fontWeight: 600, color: 'var(--text-primary)', margin: 0
                                    }}>
                                        {person.title}
                                    </p>
                                    <p style={{
                                        fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                    }}>
                                        {person.search_query}
                                    </p>
                                </div>
                            </div>
                            {person.linkedin_url && (
                                <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flexShrink: 0 }}>
                                    <button className="ds-btn ds-btn-primary" style={{
                                        fontSize: '12px',
                                        padding: '8px 14px',
                                        gap: '6px',
                                        background: '#0a66c2',
                                        borderColor: '#0a66c2',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        <Search style={{ width: '13px', height: '13px' }} />
                                        Search on LinkedIn
                                        <ExternalLink style={{ width: '11px', height: '11px' }} />
                                    </button>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tip */}
            <div className="ds-card" style={{ padding: '14px 16px', borderColor: 'rgba(191, 255, 10, 0.2)' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    💡 <strong style={{ color: 'var(--accent)' }}>Pro Tip:</strong> When reaching out, mention the specific role and how your skills align.
                    Personalized messages get 3x more responses than generic ones.
                </p>
            </div>
        </div>
    );
}

// Fallback for legacy format: { company, searches: ["search1", "search2"] }
function renderLegacyLinkedInResults(data) {
    const company = data.company || "the company";
    const searches = data.searches || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="ds-card" style={{ padding: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</span>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{company}</p>
            </div>
            {searches.map((query, i) => {
                const linkedinUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
                return (
                    <div key={i} className="ds-card" style={{
                        padding: '14px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
                    }}>
                        <p className="ds-body-sm" style={{ color: 'var(--text-primary)', flex: 1 }}>{query}</p>
                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flexShrink: 0 }}>
                            <button className="ds-btn ds-btn-primary" style={{
                                fontSize: '12px', padding: '8px 14px', gap: '6px',
                                background: '#0a66c2', borderColor: '#0a66c2'
                            }}>
                                <Search style={{ width: '13px', height: '13px' }} />
                                LinkedIn
                                <ExternalLink style={{ width: '11px', height: '11px' }} />
                            </button>
                        </a>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Recursive JSON result renderer ───
function renderResultData(data) {
    if (data === null || data === undefined) return null;

    if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
        return <span style={{ color: 'var(--text-secondary)' }}>{String(data)}</span>;
    }

    if (Array.isArray(data)) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {data.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: 'var(--accent)', marginTop: '2px' }}>•</span>
                        <div style={{ flex: 1 }}>
                            {typeof item === "object" ? renderResultData(item) : (
                                <span className="ds-body-sm">{String(item)}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (typeof data === "object") {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(data).map(([key, value]) => {
                    const label = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

                    // Score fields — progress bar
                    if (typeof value === "number" && (key.includes("score") || key.includes("probability") || key.includes("match"))) {
                        const color = value >= 70 ? "var(--accent)" : value >= 40 ? "#FFA500" : "#FF4444";
                        return (
                            <div key={key} className="ds-card" style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color }}>{value}%</span>
                                </div>
                                <div className="ds-progress-track">
                                    <div className="ds-progress-fill" style={{ width: `${value}%`, backgroundColor: color }} />
                                </div>
                            </div>
                        );
                    }

                    // Simple values
                    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                        return (
                            <div key={key} className="ds-card" style={{ padding: '16px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                                <p className="ds-body-sm" style={{ marginTop: '4px', color: 'var(--text-primary)' }}>{String(value)}</p>
                            </div>
                        );
                    }

                    // Nested
                    return (
                        <div key={key} className="ds-card" style={{ padding: '16px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>{label}</span>
                            {renderResultData(value)}
                        </div>
                    );
                })}
            </div>
        );
    }

    return null;
}
