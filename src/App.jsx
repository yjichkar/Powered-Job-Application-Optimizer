import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Link as LinkIcon, ArrowRight, ChevronLeft,
  ScanLine, Percent, BarChart3, FileText, Mail,
  Users, Zap, MessageSquare, CheckCircle2, AlertTriangle,
  Sparkles, X, LogOut, Shield, Loader2, ExternalLink
} from 'lucide-react';

// Firebase imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjSfDLXgeUIKYWezqD7z38qWMC1ZBgRI0",
  authDomain: "job-opt-system.firebaseapp.com",
  projectId: "job-opt-system",
  storageBucket: "job-opt-system.firebasestorage.app",
  messagingSenderId: "892638334342",
  appId: "1:892638334342:web:bbf103af78792bee2b3007"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Backend API Configuration
const BACKEND_URL = 'http://localhost:5000/api';

// Utility function
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Theme Configuration
const THEME = {
  colors: {
    bg: '#0a0a0a',
    surface: '#121212',
    surfaceHighlight: '#1E1E1E',
    text: '#EDEDED',
    muted: '#888888',
    accent: '#CCFF00',
    accentDim: 'rgba(204, 255, 0, 0.1)',
    border: '#333333',
    error: '#FF3333'
  }
};

// Services Configuration with API endpoints
const SERVICES = [
  {
    id: 'ats-scanner',
    title: 'ATS Scanner',
    desc: 'Ensure your resume passes through Applicant Tracking Systems.',
    icon: ScanLine,
    fullDesc: 'Our advanced parsing engine simulates top-tier ATS algorithms to highlight formatting errors.',
    endpoint: '/ats-scanner',
    features: ['Keyword optimization analysis', 'Format compatibility check', 'Section structure validation', 'Scoring against ATS algorithms']
  },
  {
    id: 'job-suitability',
    title: 'Job Suitability %',
    desc: 'Get a percentage match for your profile against job description.',
    icon: Percent,
    fullDesc: 'Get an AI-powered compatibility score that measures how well your experience aligns with job requirements.',
    endpoint: '/job-suitability',
    features: ['Skills matching analysis', 'Experience level comparison', 'Qualification alignment', 'Real-time percentage score']
  },
  {
    id: 'skill-gap',
    title: 'Skill Gap Analysis',
    desc: 'Identify the key skills you are missing for your target role.',
    icon: BarChart3,
    fullDesc: 'Discover exactly which skills you need to develop. Get personalized learning path recommendations.',
    endpoint: '/skill-gap',
    features: ['Missing skills identification', 'Priority ranking of gaps', 'Learning path suggestions', 'Certification recommendations']
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep',
    desc: 'Get AI-powered interview questions and answers for your target role.',
    icon: MessageSquare,
    fullDesc: 'Prepare for your interview with AI-generated questions specific to the job description and company.',
    endpoint: '/interview-prep',
    features: ['Role-specific questions', 'Behavioral question practice', 'Technical question prep', 'STAR method guidance']
  },
  {
    id: 'cv-builder',
    title: 'CV Builder',
    desc: 'Create a tailored, professional resume to impress.',
    icon: FileText,
    fullDesc: 'Build a stunning, ATS-optimized resume tailored specifically for your target role.',
    endpoint: '/cv-builder',
    features: ['ATS-friendly templates', 'Keyword optimization', 'Achievement highlighting', 'Professional formatting']
  },
  {
    id: 'cold-email',
    title: 'Cold Email Generator',
    desc: 'Craft compelling outreach emails to recruiters.',
    icon: Mail,
    fullDesc: 'Generate personalized cold emails that grab attention and get responses from recruiters.',
    endpoint: '/cold-email',
    features: ['Personalized templates', 'Subject line optimization', 'Follow-up sequences', 'LinkedIn message variants']
  },
  {
    id: 'linkedin-people',
    title: 'LinkedIn People',
    desc: 'Find key contacts at your target company on LinkedIn.',
    icon: Users,
    fullDesc: 'Identify the right people to connect with at your target company for networking.',
    endpoint: '/linkedin-people',
    features: ['Decision maker identification', 'Recruiter finder', 'Team member discovery', 'Connection strategy tips']
  },
  {
    id: 'callback-prob',
    title: 'Callback Probability',
    desc: 'Estimate your chances of getting a callback for the role.',
    icon: Zap,
    fullDesc: 'Get a realistic assessment of your chances based on profile match and market conditions.',
    endpoint: '/callback-probability',
    features: ['Success probability score', 'Factor breakdown analysis', 'Improvement suggestions', 'Market competitiveness']
  }
];

// ===== UI COMPONENTS =====

const NoiseBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
    }}
  />
);

const GridOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-0"
    style={{
      backgroundImage: `linear-gradient(${THEME.colors.surfaceHighlight} 1px, transparent 1px), linear-gradient(90deg, ${THEME.colors.surfaceHighlight} 1px, transparent 1px)`,
      backgroundSize: '80px 80px',
      opacity: 0.3
    }}
  />
);

const Navbar = ({ onLogout, userEmail, onLogoClick }) => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center backdrop-blur-sm bg-black/50"
  >
    <div
      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onLogoClick}
    >
      <div className="w-3 h-3 bg-[#CCFF00] rounded-sm" />
      <span className="font-['Syne'] font-bold text-lg tracking-tight text-white">JOB.OPT</span>
    </div>
    <div className="flex items-center gap-6">
      <a href="#services" className="text-gray-400 hover:text-white transition-colors font-['JetBrains_Mono'] text-xs uppercase tracking-wider">Services</a>
      <a href="#" className="text-gray-400 hover:text-white transition-colors font-['JetBrains_Mono'] text-xs uppercase tracking-wider">Manifesto</a>
      <button
        onClick={onLogout}
        className="text-white border border-[#333] px-4 py-1 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-['JetBrains_Mono'] text-xs"
      >
        SIGN IN
      </button>
    </div>
  </motion.nav>
);

const LoadingSpinner = ({ text = "Processing..." }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="relative">
      <div className="w-12 h-12 border-2 border-[#CCFF00] rounded-full animate-spin border-t-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles size={16} className="text-[#CCFF00] animate-pulse" />
      </div>
    </div>
    <p className="mt-4 font-['JetBrains_Mono'] text-[#CCFF00] animate-pulse text-xs tracking-widest uppercase">
      {text}
    </p>
  </div>
);

// ===== LANDING PAGE COMPONENT =====

const AnimatedWaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Wave Lines */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#b8e600" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#99cc00" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Generate multiple wave lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M-100,${700 + i * 12} Q200,${650 + i * 10} 400,${680 + i * 11} T800,${640 + i * 9} T1200,${700 + i * 10} T1600,${650 + i * 8}`}
            stroke="url(#waveGradient)"
            strokeWidth={1.5 - i * 0.05}
            fill="none"
            strokeLinecap="round"
            initial={{
              pathLength: 0,
              opacity: 0,
              pathOffset: 0
            }}
            animate={{
              pathLength: 1,
              opacity: 0.3 + (i * 0.03),
              pathOffset: [0, 0.1, 0]
            }}
            transition={{
              pathLength: { duration: 2, delay: i * 0.1, ease: "easeOut" },
              opacity: { duration: 1.5, delay: i * 0.1 },
              pathOffset: {
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2
              }
            }}
          />
        ))}
      </svg>

      {/* Glowing orb effect */}
      <motion.div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(204,255,0,0.3) 0%, rgba(204,255,0,0) 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

const LandingPage = ({ onInitialize }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated Wave Background */}
      <AnimatedWaveBackground />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Hero Text */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="font-['Syne'] text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9]">
            <motion.span
              className="block text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #CCCCCC 50%, #888888 100%)',
                WebkitBackgroundClip: 'text',
              }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              OUTSMART
            </motion.span>
            <motion.span
              className="block text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #DDDDDD 0%, #AAAAAA 50%, #666666 100%)',
                WebkitBackgroundClip: 'text',
              }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              THE
            </motion.span>
            <motion.span
              className="block text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #BBBBBB 0%, #888888 50%, #444444 100%)',
                WebkitBackgroundClip: 'text',
              }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              ALGORITHM
            </motion.span>
          </h1>
        </motion.div>

        {/* Initialize Button */}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          onClick={onInitialize}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="mt-16 relative group"
        >
          <motion.div
            className="relative px-8 py-4 border border-[#333] rounded-full overflow-hidden"
            whileHover={{ borderColor: '#CCFF00' }}
            transition={{ duration: 0.3 }}
          >
            {/* Button background glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#CCFF00]/0 via-[#CCFF00]/10 to-[#CCFF00]/0"
              initial={{ x: '-100%' }}
              animate={isHovered ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 0.6 }}
            />

            <span className="relative flex items-center gap-3 font-['JetBrains_Mono'] text-sm text-gray-300 group-hover:text-[#CCFF00] transition-colors tracking-widest uppercase">
              Initialize System
              <motion.span
                animate={isHovered ? { x: 5 } : { x: 0 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </span>
          </motion.div>
        </motion.button>
      </div>

      {/* Footer branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-8 flex items-center gap-2"
      >
        <div className="w-3 h-3 bg-[#CCFF00] rounded-sm" />
        <span className="font-['Syne'] font-bold text-lg tracking-tight text-white/50">JOB.OPT</span>
      </motion.div>
    </motion.div>
  );
};

// ===== INPUT ZONE COMPONENT =====

const InputZone = ({ jdUrl, setJdUrl, jdText, setJdText, resumeFile, setResumeFile, resumeText, setResumeText, onScrape, isScraping, isScraped }) => {
  const fileInputRef = useRef(null);
  const [inputMode, setInputMode] = useState('url'); // 'url' or 'text'

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      // We'll extract text on the backend
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleUrlSubmit = () => {
    if (jdUrl.trim()) {
      onScrape(jdUrl);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto mb-16 relative z-10">
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-['Syne'] text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter"
        >
          OPTIMIZE YOUR <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#aaaaaa] to-[#555555]">APPLICATION</span>
        </motion.h1>
        <p className="font-['JetBrains_Mono'] text-gray-500 text-sm uppercase tracking-widest px-4">
          AI-Powered Precision Engineering
        </p>
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mx-4 md:mx-0 bg-[#0f0f0f] border border-[#333] p-2 rounded-2xl shadow-2xl"
      >
        <div className="flex flex-col gap-4 p-4 md:p-6">
          {/* Mode Toggle */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setInputMode('url')}
              className={cn(
                "px-4 py-2 rounded-lg font-['JetBrains_Mono'] text-xs transition-all",
                inputMode === 'url'
                  ? "bg-[#CCFF00] text-black"
                  : "bg-[#1a1a1a] text-gray-400 hover:text-white"
              )}
            >
              Enter URL
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={cn(
                "px-4 py-2 rounded-lg font-['JetBrains_Mono'] text-xs transition-all",
                inputMode === 'text'
                  ? "bg-[#CCFF00] text-black"
                  : "bg-[#1a1a1a] text-gray-400 hover:text-white"
              )}
            >
              Paste Text
            </button>
          </div>

          {/* URL Input or Text Input */}
          {inputMode === 'url' ? (
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <LinkIcon size={18} />
              </div>
              <input
                type="url"
                value={jdUrl}
                onChange={(e) => setJdUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="Paste Job Description URL..."
                className="w-full bg-[#161616] text-white font-['JetBrains_Mono'] pl-12 pr-24 py-4 rounded-xl border border-[#333] focus:border-[#CCFF00] focus:outline-none transition-colors placeholder:text-gray-600 text-sm"
              />
              <button
                onClick={handleUrlSubmit}
                disabled={isScraping || !jdUrl.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#CCFF00] hover:bg-[#b3e600] disabled:bg-[#333] disabled:text-gray-500 text-black font-['JetBrains_Mono'] text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                {isScraping ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                {isScraping ? 'Fetching...' : 'Fetch'}
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-4 text-gray-500">
                <FileText size={18} />
              </div>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste Job Description text here..."
                className="w-full h-32 bg-[#161616] text-white font-['JetBrains_Mono'] pl-12 pr-4 py-4 rounded-xl border border-[#333] focus:border-[#CCFF00] focus:outline-none transition-colors placeholder:text-gray-600 text-sm resize-none"
              />
            </div>
          )}

          {/* Scraped Status */}
          {isScraped && jdText && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0a2a0a] border border-green-800 rounded-lg">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="font-['JetBrains_Mono'] text-xs text-green-400">
                Job description loaded ({jdText.length} characters)
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] flex-1 bg-[#333]"></div>
            <span className="font-['JetBrains_Mono'] text-xs text-gray-600 uppercase">Upload Resume PDF</span>
            <div className="h-[1px] flex-1 bg-[#333]"></div>
          </div>

          <div
            className="border-2 border-dashed border-[#333] hover:border-[#CCFF00] rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
            <Upload size={24} className="text-[#CCFF00] mb-2" />
            <p className="text-gray-400 font-['JetBrains_Mono'] text-sm">
              {resumeFile ? resumeFile.name : 'Click to upload PDF resume'}
            </p>
          </div>

          {/* Status indicator */}
          {(jdText || jdUrl) && resumeFile && (
            <div className="flex items-center justify-center gap-2 py-3 bg-[#0a0a0a] rounded-xl border border-[#222]">
              <CheckCircle2 size={18} className="text-[#CCFF00]" />
              <span className="font-['JetBrains_Mono'] text-sm text-gray-300">
                Ready to use services below
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

// ===== SERVICE CARD COMPONENT =====

const ServiceCard = ({ service, index, onClick, isReady }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 + (index * 0.05) }}
    onClick={onClick}
    className={cn(
      "group bg-[#0f0f0f] border p-6 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col min-h-[220px]",
      isReady
        ? "border-[#222] hover:border-[#CCFF00] hover:bg-[#141414]"
        : "border-[#1a1a1a] opacity-60 cursor-not-allowed"
    )}
  >
    <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center mb-4 text-white group-hover:text-[#CCFF00] transition-colors">
      <service.icon size={20} strokeWidth={1.5} />
    </div>

    <h3 className="font-['Syne'] font-bold text-white text-lg mb-2 leading-tight">{service.title}</h3>
    <p className="font-['JetBrains_Mono'] text-xs text-gray-500 leading-relaxed flex-grow">
      {service.desc}
    </p>

    {isReady && (
      <div className="mt-4 flex items-center gap-2 text-[#CCFF00] opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={14} />
      </div>
    )}
  </motion.div>
);

// ===== SERVICE DETAIL PAGE COMPONENT =====

const ServiceDetailPage = ({ service, onBack, jdText, resumeText, resumeFile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleLaunchTool = async () => {
    if (!jdText) {
      setError('Please provide a job description first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // First, if we have a resume file, we need to extract text from it
      let extractedResumeText = resumeText;

      if (resumeFile && !resumeText) {
        // For services that need resume text, we use the comprehensive endpoint to extract it
        const formData = new FormData();
        formData.append('jd', jdText);
        formData.append('resume_file', resumeFile);

        const extractResponse = await fetch(`${BACKEND_URL}/analyze-comprehensive`, {
          method: 'POST',
          body: formData
        });

        if (extractResponse.ok) {
          const extractData = await extractResponse.json();
          extractedResumeText = extractData.resume_text_content || '';
        }
      }

      // Now call the specific service endpoint
      const response = await fetch(`${BACKEND_URL}${service.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jd: jdText,
          resume: extractedResumeText || ''
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to connect to AI service. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen pt-24 pb-12 px-4 md:px-8"
    >
      {/* Back Button - More Prominent */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onBack();
        }}
        className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] text-[#CCFF00] px-4 py-3 rounded-lg transition-all mb-8 font-['JetBrains_Mono'] text-sm uppercase tracking-wider border border-[#333] hover:border-[#CCFF00] relative z-50 cursor-pointer pointer-events-auto"
        style={{ position: 'relative', zIndex: 100 }}
      >
        <ChevronLeft size={20} />
        Back to Dashboard
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Service Info */}
        <div>
          {/* Service Icon */}
          <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#CCFF00] mb-6">
            <service.icon size={32} strokeWidth={1.5} />
          </div>

          {/* Service Title */}
          <h1 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-4">
            {service.title}
          </h1>

          {/* Description with accent bar */}
          <div className="flex gap-4 mb-6">
            <div className="w-1 bg-[#CCFF00] rounded-full"></div>
            <p className="font-['JetBrains_Mono'] text-sm text-gray-400">
              {service.desc}
            </p>
          </div>

          {/* Full Description */}
          <p className="font-['JetBrains_Mono'] text-sm text-gray-500 mb-8 leading-relaxed">
            {service.fullDesc}
          </p>

          {/* Launch Button */}
          <button
            onClick={handleLaunchTool}
            disabled={isLoading || !jdText}
            className="bg-transparent border-2 border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black disabled:border-gray-600 disabled:text-gray-600 disabled:cursor-not-allowed font-['JetBrains_Mono'] text-sm px-8 py-4 rounded-full transition-all flex items-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                LAUNCH TOOL
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="font-['JetBrains_Mono'] text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Right Column - Results Panel */}
        <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 min-h-[400px] flex flex-col">
          {!result && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {/* Animated Icon Container */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border border-[#333] flex items-center justify-center">
                  <service.icon size={32} className="text-[#CCFF00]" />
                </div>
                {/* Animated rings */}
                <div className="absolute inset-0 rounded-full border border-[#CCFF00]/20 animate-ping" style={{ animationDuration: '2s' }}></div>
              </div>
              <h3 className="font-['Syne'] text-xl text-white mb-2">Module Ready</h3>
              <p className="font-['JetBrains_Mono'] text-xs text-gray-500">Awaiting Input Data</p>
            </div>
          )}

          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Analyzing with AI..." />
            </div>
          )}

          {result && (
            <ResultDisplay result={result} serviceId={service.id} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ===== RESULT DISPLAY COMPONENT =====

const ResultDisplay = ({ result, serviceId }) => {
  const [visibleSections, setVisibleSections] = useState(0);

  useEffect(() => {
    // Progressive reveal animation
    const sectionCount = Object.keys(result).length;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setVisibleSections(current);
      if (current >= sectionCount) {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [result]);

  const renderValue = (key, value) => {
    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          {value.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-2 text-sm text-gray-300 font-['JetBrains_Mono'] bg-[#111] p-3 rounded-lg border border-[#222]"
            >
              {typeof item === 'object' ? (
                <div className="w-full">
                  {Object.entries(item).map(([k, v]) => (
                    <div key={k} className="mb-1">
                      <span className="text-[#CCFF00] text-xs uppercase">{k}: </span>
                      <span className="text-gray-300">{String(v)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <span className="text-[#CCFF00] mt-1">•</span>
                  <span>{String(item)}</span>
                </>
              )}
            </motion.div>
          ))}
        </div>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="bg-[#111] p-3 rounded-lg border border-[#222]">
              <span className="text-[#CCFF00] text-xs uppercase font-['JetBrains_Mono']">{k}</span>
              <p className="text-gray-300 text-sm font-['JetBrains_Mono'] mt-1 whitespace-pre-wrap">{String(v)}</p>
            </div>
          ))}
        </div>
      );
    } else if (typeof value === 'number') {
      return (
        <div className="text-4xl font-['Syne'] font-bold text-[#CCFF00]">
          {value}{key.includes('score') || key.includes('probability') || key.includes('match') ? '%' : ''}
        </div>
      );
    } else {
      return (
        <p className="text-gray-300 text-sm font-['JetBrains_Mono'] whitespace-pre-wrap">{String(value)}</p>
      );
    }
  };

  const formatKey = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const entries = Object.entries(result).filter(([key]) => key !== 'error');

  return (
    <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
      {entries.map(([key, value], idx) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: idx < visibleSections ? 1 : 0, y: idx < visibleSections ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-['Syne'] text-lg text-white mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-[#CCFF00]" />
            {formatKey(key)}
          </h3>
          {renderValue(key, value)}
        </motion.div>
      ))}
    </div>
  );
};

// ===== MAIN APP COMPONENT =====

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Input state
  const [jdUrl, setJdUrl] = useState('');
  const [jdText, setJdText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [isScraped, setIsScraped] = useState(false);

  // Navigation state
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard' | 'service'
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleScrapeUrl = async (url) => {
    setIsScraping(true);
    try {
      const response = await fetch(`${BACKEND_URL}/scrape-jd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (data.success) {
        setJdText(data.jd_text);
        setIsScraped(true);
      } else {
        alert(`Could not fetch job description: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to fetch URL. Please try pasting the text instead.');
      console.error(err);
    } finally {
      setIsScraping(false);
    }
  };

  const handleServiceClick = (service) => {
    if (!jdText && !jdUrl) {
      alert('Please enter a job description URL or paste the text first.');
      return;
    }
    if (!resumeFile) {
      alert('Please upload your resume PDF first.');
      return;
    }
    setSelectedService(service);
    setCurrentView('service');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedService(null);
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedService(null);
  };

  const handleInitialize = () => {
    setCurrentView('dashboard');
  };

  const isReady = (jdText || (jdUrl && isScraped)) && resumeFile;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden selection:bg-[#CCFF00] selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');
      `}</style>

      {currentView !== 'landing' && (
        <>
          <NoiseBackground />
          <GridOverlay />
        </>
      )}

      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <LandingPage key="landing" onInitialize={handleInitialize} />
        ) : currentView === 'dashboard' ? (
          <>
            <Navbar onLogout={handleLogout} userEmail={user?.email} onLogoClick={handleBackToLanding} />
            <motion.main
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-32 pb-20 px-4 relative z-10 w-full flex flex-col items-center"
            >
              <InputZone
                jdUrl={jdUrl}
                setJdUrl={setJdUrl}
                jdText={jdText}
                setJdText={setJdText}
                resumeFile={resumeFile}
                setResumeFile={setResumeFile}
                resumeText={resumeText}
                setResumeText={setResumeText}
                onScrape={handleScrapeUrl}
                isScraping={isScraping}
                isScraped={isScraped}
              />

              <div id="services" className="w-full max-w-6xl px-4">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-['Syne'] text-2xl font-bold text-white">AVAILABLE MODULES</h2>
                  <div className="h-[1px] flex-1 bg-[#222]"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {SERVICES.map((service, idx) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      index={idx}
                      onClick={() => handleServiceClick(service)}
                      isReady={isReady}
                    />
                  ))}
                </div>
              </div>

              <footer className="w-full max-w-6xl mt-32 pt-8 border-t border-[#222] flex flex-col md:flex-row justify-between items-center text-gray-600 font-['JetBrains_Mono'] text-xs gap-4 md:gap-0 px-4">
                <p>&copy; 2025 JOB.OPT SYSTEM</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
                  <a href="#" className="hover:text-white transition-colors">TERMS</a>
                  <a href="#" className="hover:text-white transition-colors">CONTACT</a>
                </div>
              </footer>
            </motion.main>
          </>
        ) : (
          <>
            <Navbar onLogout={handleLogout} userEmail={user?.email} onLogoClick={handleBackToLanding} />
            <ServiceDetailPage
              key="service"
              service={selectedService}
              onBack={handleBackToDashboard}
              jdText={jdText}
              resumeText={resumeText}
              resumeFile={resumeFile}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}