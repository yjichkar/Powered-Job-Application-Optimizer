import { useState, useRef } from "react";
import { Upload, Link2, FileText, X, ArrowRight, Loader2, CheckCircle, RefreshCw } from "lucide-react";

export function JobInputSection({ serviceTitle, onSubmit }) {
    const [jobUrl, setJobUrl] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) validateAndSetFile(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) validateAndSetFile(file);
    };

    const validateAndSetFile = (file) => {
        setError("");
        const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
        if (!validTypes.includes(file.type)) { setError("Please upload a PDF, DOCX, or TXT file."); return; }
        if (file.size > 10 * 1024 * 1024) { setError("File size must be under 10MB."); return; }
        setResumeFile(file);
    };

    const removeFile = () => { setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

    const handleSubmit = async () => {
        setError("");
        if (!resumeFile && !jobUrl) { setError("Please upload your resume or paste a job URL."); return; }
        setLoading(true);
        try {
            if (onSubmit) await onSubmit({ jobUrl, resumeFile });
            setSubmitted(true);
        } catch (err) { setError("Something went wrong. Please try again."); }
        finally { setLoading(false); }
    };

    const handleReset = () => {
        setJobUrl(""); setResumeFile(null); setSubmitted(false); setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    // ─── Submitted State ───
    if (submitted) {
        return (
            <section className="ds-cta-section">
                <div className="ds-cta-card" style={{ maxWidth: '640px' }}>
                    <div className="ds-empty-state" style={{ padding: '16px 0' }}>
                        <div className="ds-icon-box ds-icon-box-lg" style={{ margin: '0 auto 16px' }}>
                            <CheckCircle />
                        </div>
                        <h2 className="ds-title-section" style={{ fontSize: '24px' }}>Data Submitted!</h2>
                        <p className="ds-subtitle-centered" style={{ marginBottom: '20px' }}>
                            Your information is ready. All services can now provide personalized results.
                        </p>

                        <div style={{ maxWidth: '380px', margin: '0 auto 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {resumeFile && (
                                <div className="ds-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                                    <FileText style={{ width: '18px', height: '18px', color: 'var(--accent)', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{resumeFile.name}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{formatFileSize(resumeFile.size)}</p>
                                    </div>
                                </div>
                            )}
                            {jobUrl && (
                                <div className="ds-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                                    <Link2 style={{ width: '18px', height: '18px', color: 'var(--accent)', flexShrink: 0 }} />
                                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{jobUrl}</p>
                                </div>
                            )}
                        </div>

                        <button className="ds-btn ds-btn-outline" onClick={handleReset}>
                            <RefreshCw style={{ width: '16px', height: '16px' }} />
                            Upload Different Data
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // ─── Input Form ───
    return (
        <section className="ds-cta-section">
            <div className="ds-cta-card" style={{ maxWidth: '640px', textAlign: 'left' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h2 className="ds-title-section" style={{ fontSize: '24px' }}>Get Started</h2>
                    <p className="ds-subtitle-centered">
                        Upload your resume and paste the job posting URL. All services will use this data for personalized results.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Job URL Input */}
                    <div>
                        <label className="ds-form-label">
                            <Link2 style={{ width: '16px', height: '16px', color: 'var(--accent)' }} />
                            Job Posting URL
                        </label>
                        <input
                            type="url"
                            value={jobUrl}
                            onChange={(e) => setJobUrl(e.target.value)}
                            placeholder="https://example.com/job-posting"
                            className="ds-input"
                        />
                        <p className="ds-form-hint">Paste the URL of the job you're applying to</p>
                    </div>

                    {/* Resume Upload */}
                    <div>
                        <label className="ds-form-label">
                            <FileText style={{ width: '16px', height: '16px', color: 'var(--accent)' }} />
                            Your Resume
                        </label>

                        {resumeFile ? (
                            <div className="ds-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="ds-icon-box" style={{ width: '40px', height: '40px' }}>
                                        <FileText style={{ width: '18px', height: '18px' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{resumeFile.name}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{formatFileSize(resumeFile.size)}</p>
                                    </div>
                                </div>
                                <button onClick={removeFile} style={{
                                    width: '32px', height: '32px', borderRadius: 'var(--radius-full)',
                                    border: 'none', background: 'transparent', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <X style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    padding: '32px', borderRadius: 'var(--radius-lg)',
                                    border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border)'}`,
                                    background: dragActive ? 'var(--accent-soft)' : 'var(--bg-card)',
                                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.25s ease'
                                }}
                            >
                                <Upload style={{ width: '28px', height: '28px', margin: '0 auto 10px', color: dragActive ? 'var(--accent)' : 'var(--text-faint)' }} />
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Click to upload</span> or drag and drop
                                </p>
                                <p style={{ fontSize: '12px', color: 'var(--text-faint)' }}>PDF, DOCX, or TXT (max 10MB)</p>
                            </div>
                        )}

                        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
                    </div>

                    {/* Error */}
                    {error && <div className="ds-error">{error}</div>}

                    {/* Submit */}
                    <button
                        className="ds-btn ds-btn-primary ds-btn-lg ds-btn-full"
                        onClick={handleSubmit}
                        disabled={loading || (!resumeFile && !jobUrl)}
                    >
                        {loading ? (
                            <><Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} /> Processing...</>
                        ) : (
                            <>Submit & Unlock All Services <ArrowRight style={{ width: '18px', height: '18px' }} /></>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
}
