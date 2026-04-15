import { createContext, useContext, useState } from "react";

const JobDataContext = createContext(null);

const API_BASE = "http://localhost:5000/api";

// Maps service apiEndpoint to batch result key
const ENDPOINT_TO_KEY = {
    "ats-scanner": "ats_scanner",
    "job-suitability": "job_match",
    "skill-gap": "skill_gap",
    "interview-prep": "interview_prep",
    "cold-email": "cold_email",
    "cv-builder": "cv_builder",
    "linkedin-people": "linkedin_people",
    "callback-probability": "callback_probability"
};

export function JobDataProvider({ children }) {
    const [jobData, setJobData] = useState({
        jobUrl: "",
        resumeFile: null,
        resumeText: "",
        jdText: "",
        submitted: false,
        loading: false,
        error: "",
        allResults: null  // Cached batch results
    });

    const submitJobData = async ({ jobUrl, resumeFile }) => {
        setJobData(prev => ({ ...prev, loading: true, error: "" }));

        try {
            let resumeText = "";
            let jdText = "";

            // 1. Extract resume text (zero AI tokens)
            if (resumeFile) {
                const formData = new FormData();
                formData.append("resume_file", resumeFile);

                const resumeRes = await fetch(`${API_BASE}/extract-resume`, {
                    method: "POST",
                    body: formData
                });
                const resumeData = await resumeRes.json();
                if (resumeData.success && resumeData.resume_text) {
                    resumeText = resumeData.resume_text;
                }
            }

            // 2. Scrape JD (zero AI tokens)
            if (jobUrl) {
                const scrapeRes = await fetch(`${API_BASE}/scrape-jd`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: jobUrl })
                });
                const scrapeData = await scrapeRes.json();
                if (scrapeData.success && scrapeData.jd_text) {
                    jdText = scrapeData.jd_text;
                }
            }

            // 3. Run ALL services in 1 AI call
            let allResults = null;
            if (resumeText || jdText) {
                const batchRes = await fetch(`${API_BASE}/analyze-all`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jd: jdText, resume: resumeText })
                });
                const batchData = await batchRes.json();
                if (!batchData.error) {
                    allResults = batchData;
                }
            }

            setJobData({
                jobUrl,
                resumeFile,
                resumeText,
                jdText,
                submitted: true,
                loading: false,
                error: "",
                allResults
            });

            return { resumeText, jdText };
        } catch (err) {
            setJobData(prev => ({
                ...prev,
                loading: false,
                error: "Failed to process. Please try again."
            }));
            throw err;
        }
    };

    const clearJobData = () => {
        setJobData({
            jobUrl: "",
            resumeFile: null,
            resumeText: "",
            jdText: "",
            submitted: false,
            loading: false,
            error: "",
            allResults: null
        });
    };

    // Get cached result for a service, or fall back to individual API call
    const getServiceResult = (apiEndpoint) => {
        const key = ENDPOINT_TO_KEY[apiEndpoint];
        if (jobData.allResults && key && jobData.allResults[key]) {
            return jobData.allResults[key];
        }
        return null;
    };

    // Fallback: call individual service if batch didn't include it
    const callService = async (endpoint) => {
        // Check cache first
        const cached = getServiceResult(endpoint);
        if (cached) return cached;

        // Fallback to individual call
        const res = await fetch(`${API_BASE}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jd: jobData.jdText,
                resume: jobData.resumeText
            })
        });
        return await res.json();
    };

    return (
        <JobDataContext.Provider value={{ jobData, submitJobData, clearJobData, callService, getServiceResult }}>
            {children}
        </JobDataContext.Provider>
    );
}

export function useJobData() {
    const ctx = useContext(JobDataContext);
    if (!ctx) throw new Error("useJobData must be used within a JobDataProvider");
    return ctx;
}
