import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Link as LinkIcon, ArrowRight, ChevronLeft,
  ScanLine, Percent, BarChart3, FileText, Mail,
  Users, Zap, MessageSquare, CheckCircle2, AlertTriangle,
  Sparkles, X, LogOut, Shield, Loader2, ExternalLink,
  QrCode, TrendingUp, Send
} from 'lucide-react';
import { PrismFluxLoader } from './components/ui/PrismFluxLoader';

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

// Services Configuration with API endpoints
const SERVICES = [
  {
    id: 'ats-scanner',
    title: 'ATS Scanner',
    desc: 'Ensure your resume passes through applicant tracking systems.',
    icon: QrCode,
    actionText: 'Scan Resume',
    fullDesc: 'Our advanced parsing engine simulates top-tier ATS algorithms.',
    endpoint: '/ats-scanner',
    features: ['Keyword optimization', 'Format check', 'Structure validation', 'ATS scoring']
  },
  {
    id: 'job-suitability',
    title: 'Job Match',
    desc: 'Calculate your match percentage for any role.',
    icon: Percent,
    actionText: 'Calculate',
    fullDesc: 'AI-powered compatibility scoring across 40+ relevance points.',
    endpoint: '/job-suitability',
    features: ['Skills matching', 'Experience comparison', 'Qualification alignment', 'Match score']
  },
  {
    id: 'skill-gap',
    title: 'Skill Gap',
    desc: 'Identify missing skills for your target role.',
    icon: TrendingUp,
    actionText: 'Analyze',
    fullDesc: 'Discover skills to develop with personalized recommendations.',
    endpoint: '/skill-gap',
    features: ['Skill identification', 'Priority ranking', 'Learning paths', 'Certifications']
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep',
    desc: 'Practice with AI-generated interview questions.',
    icon: MessageSquare,
    actionText: 'Practice',
    fullDesc: 'Neural-network-driven mock interviews for your target role.',
    endpoint: '/interview-prep',
    features: ['Role-specific Q&A', 'Behavioral prep', 'Technical prep', 'STAR method']
  },
  {
    id: 'cv-builder',
    title: 'CV Builder',
    desc: 'Generate an optimized resume for your target role.',
    icon: FileText,
    actionText: 'Build CV',
    fullDesc: 'Impact-focused templates for both AI scanners and humans.',
    endpoint: '/cv-builder',
    features: ['ATS templates', 'Keyword optimization', 'Achievements', 'Formatting']
  },
  {
    id: 'cold-email',
    title: 'Cold Email',
    desc: 'Generate personalized outreach that gets responses.',
    icon: Mail,
    actionText: 'Generate',
    fullDesc: 'Hyper-personalized communication protocols.',
    endpoint: '/cold-email',
    features: ['Templates', 'Subject lines', 'Follow-ups', 'LinkedIn messages']
  },
  {
    id: 'linkedin-people',
    title: 'Network Map',
    desc: 'Find key decision-makers at target companies.',
    icon: Users,
    actionText: 'Find People',
    fullDesc: 'Identify the right people to connect with for networking.',
    endpoint: '/linkedin-people',
    features: ['Decision makers', 'Recruiters', 'Team discovery', 'Strategy tips']
  },
  {
    id: 'callback-prob',
    title: 'Response Rate',
    desc: 'Estimate your callback probability.',
    icon: Zap,
    actionText: 'Calculate',
    fullDesc: 'Real-time estimation based on market trends.',
    endpoint: '/callback-probability',
    features: ['Probability score', 'Factor analysis', 'Suggestions', 'Competition']
  }
];

// ===== UI COMPONENTS =====

const LoadingSpinner = ({ text = "Processing..." }) => (
  <PrismFluxLoader size={40} speed={5} />
);

// ===== LANDING PAGE COMPONENT =====

const AnimatedWaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1400 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4FF00" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#b8e600" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#99cc00" stopOpacity="0.4" />
          </linearGradient>
        </defs>

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

      <motion.div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,255,0,0.3) 0%, rgba(212,255,0,0) 70%)',
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
      <AnimatedWaveBackground />

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="font-['Inter'] text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]">
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
            whileHover={{ borderColor: '#D4FF00' }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#D4FF00]/0 via-[#D4FF00]/10 to-[#D4FF00]/0"
              initial={{ x: '-100%' }}
              animate={isHovered ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 0.6 }}
            />

            <span className="relative flex items-center gap-3 font-['JetBrains_Mono'] text-sm text-gray-300 group-hover:text-[#D4FF00] transition-colors tracking-widest uppercase">
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-8 flex items-center gap-2"
      >
        <div className="w-3 h-3 bg-[#D4FF00] rounded-sm" />
        <span className="font-['Inter'] font-bold text-lg tracking-tight text-white/50">APPLICATION</span>
      </motion.div>
    </motion.div>
  );
};

// ===== NAVBAR COMPONENT =====

const Navbar = ({ onLogout, userEmail, onLogoClick }) => (
  <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
    <div className="max-w-[1920px] mx-auto px-12 h-20 flex items-center justify-between">
      <button onClick={onLogoClick} className="font-['JetBrains_Mono'] font-bold text-2xl tracking-tighter text-white">
        APP<span className="text-[#D4FF00]">LICATION</span>
      </button>
      <div className="hidden md:flex items-center space-x-12 text-xs font-['JetBrains_Mono'] uppercase tracking-widest">
        <a className="hover:text-[#D4FF00] transition-colors text-slate-400" href="#features">Services</a>
        <a className="hover:text-[#D4FF00] transition-colors text-slate-400" href="#how-it-works">Methodology</a>
        <span className="text-slate-500">{userEmail}</span>
        <button
          onClick={onLogout}
          className="px-6 py-2.5 border border-[#D4FF00] text-[#D4FF00] hover:bg-[#D4FF00] hover:text-black transition-all font-bold"
        >
          LOGOUT
        </button>
      </div>
    </div>
  </nav>
);

// ===== SCROLLING MARQUEE =====

const ScrollingMarquee = () => (
  <section className="bg-[#c8e600] py-3 overflow-hidden">
    <style>{`
      @keyframes marquee-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-content {
        animation: marquee-scroll 50s linear infinite;
      }
      .marquee-text {
        letter-spacing: 0.1em;
        word-spacing: 0.8em;
      }
    `}</style>
    <div className="flex whitespace-nowrap">
      <div className="marquee-content text-black/80 font-semibold text-sm tracking-wide uppercase flex items-center">
        <span className="mx-8 marquee-text">ATS OPTIMIZED</span>
        <span className="w-1.5 h-1.5 bg-black/40 rounded-full flex-shrink-0"></span>
        <span className="mx-8 marquee-text">DATA DRIVEN</span>
        <span className="w-1.5 h-1.5 bg-black/40 rounded-full flex-shrink-0"></span>
        <span className="mx-8 marquee-text">AI MATCHING</span>
        <span className="w-1.5 h-1.5 bg-black/40 rounded-full flex-shrink-0"></span>
        <span className="mx-8 marquee-text">CAREER BOOST</span>
        <span className="w-1.5 h-1.5 bg-black/40 rounded-full flex-shrink-0"></span>
        <span className="mx-8 marquee-text">ATS OPTIMIZED</span>
        <span className="w-1.5 h-1.5 bg-black/40 rounded-full flex-shrink-0"></span>
        <span className="mx-8 marquee-text">DATA DRIVEN</span>
        <span className="w-1.5 h-1.5 bg-black/40 rounded-full flex-shrink-0"></span>
        <span className="mx-8 marquee-text">AI MATCHING</span>
        <span className="w-1.5 h-1.5 bg-black/40 rounded-full flex-shrink-0"></span>
        <span className="mx-8 marquee-text">CAREER BOOST</span>
        <span className="w-1.5 h-1.5 bg-black/40 rounded-full flex-shrink-0"></span>
        <span className="mx-8 marquee-text">ATS OPTIMIZED</span>
        <span className="w-1.5 h-1.5 bg-black/40 rounded-full flex-shrink-0"></span>
        <span className="mx-8 marquee-text">DATA DRIVEN</span>
        <span className="w-1.5 h-1.5 bg-black/40 rounded-full flex-shrink-0"></span>
        <span className="mx-8 marquee-text">AI MATCHING</span>
        <span className="w-1.5 h-1.5 bg-black/40 rounded-full flex-shrink-0"></span>
        <span className="mx-8 marquee-text">CAREER BOOST</span>
      </div>
    </div>
  </section>
);

// ===== INPUT ZONE COMPONENT =====

const InputZone = ({ jdUrl, setJdUrl, jdText, setJdText, resumeFile, setResumeFile, resumeText, setResumeText, onScrape, isScraping, isScraped }) => {
  const fileInputRef = useRef(null);
  const [inputMode, setInputMode] = useState('url');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
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
    <section className="relative py-16 md:py-20 overflow-hidden" style={{
      backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)',
      backgroundSize: '50px 50px'
    }}>
      {/* Centered Container - 1280px max */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12">

        {/* 2-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12">
          {/* Left: Headline (60% width feel) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3 font-['Inter'] leading-tight">
              AI-Powered Career <span className="text-[#D4FF00]">Optimization</span>
            </h1>
            <p className="font-['JetBrains_Mono'] text-sm text-slate-400 leading-relaxed max-w-sm">
              Analyze your CV and job descriptions using ATS-optimized intelligence.
            </p>
          </motion.div>

          {/* Right: Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/40"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/40"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/40"></div>
              </div>
              <span className="font-['JetBrains_Mono'] text-[9px] text-slate-600 uppercase">Analysis Preview</span>
            </div>
            <div className="h-2.5 bg-[#D4FF00]/15 rounded-full overflow-hidden mb-3">
              <motion.div className="h-full bg-[#D4FF00] rounded-full" initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 1.2, ease: "easeOut" }} />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-black/50 rounded-lg p-2.5 border border-white/5">
                <p className="text-[9px] font-['JetBrains_Mono'] text-slate-500 mb-0.5">Match</p>
                <p className="text-lg font-bold text-[#D4FF00]">82%</p>
              </div>
              <div className="bg-black/50 rounded-lg p-2.5 border border-white/5">
                <p className="text-[9px] font-['JetBrains_Mono'] text-slate-500 mb-0.5">ATS</p>
                <p className="text-lg font-bold text-white">PASS</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 md:p-8 shadow-lg"
        >
          {/* Workspace Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="w-2 h-2 bg-[#D4FF00] rounded-full"></div>
            <h2 className="font-['Inter'] text-base font-semibold text-white">Start Your Analysis</h2>
          </div>

          {/* Step 1: Job Description */}
          <div className="mb-6">
            <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-slate-500 mb-2">
              Step 1: Job Description
            </label>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setInputMode('url')}
                className={cn(
                  "text-xs font-['JetBrains_Mono'] px-3 py-1.5 rounded-md transition-all duration-200",
                  inputMode === 'url'
                    ? "bg-[#D4FF00] text-black font-bold"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                )}
              >
                URL
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={cn(
                  "text-xs font-['JetBrains_Mono'] px-3 py-1.5 rounded-md transition-all duration-200",
                  inputMode === 'text'
                    ? "bg-[#D4FF00] text-black font-bold"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                )}
              >
                Paste
              </button>
            </div>
          </div>

          {/* URL Input or Text Input */}
          {inputMode === 'url' ? (
            <div className="relative mb-6">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="url"
                value={jdUrl}
                onChange={(e) => setJdUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="Paste job listing URL..."
                className="w-full bg-black/50 border border-white/10 rounded-lg py-4 pl-12 pr-28 font-['JetBrains_Mono'] text-sm focus:ring-2 focus:ring-[#D4FF00]/40 focus:border-[#D4FF00] outline-none transition-all duration-200 placeholder:text-slate-600 text-white"
              />
              <button
                onClick={handleUrlSubmit}
                disabled={isScraping || !jdUrl.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-['JetBrains_Mono'] bg-[#D4FF00] text-black px-4 py-2 rounded-md font-bold hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScraping ? '...' : 'FETCH'}
              </button>
            </div>
          ) : (
            <div className="relative mb-6">
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste job description text here..."
                className="w-full h-32 bg-black/50 border border-white/10 rounded-lg py-4 px-4 font-['JetBrains_Mono'] text-sm focus:ring-2 focus:ring-[#D4FF00]/40 focus:border-[#D4FF00] outline-none transition-all duration-200 placeholder:text-slate-600 text-white resize-none"
              />
            </div>
          )}

          {/* Scraped Status */}
          {isScraped && jdText && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#D4FF00]/10 border border-[#D4FF00]/30 rounded-lg mb-6">
              <CheckCircle2 size={14} className="text-[#D4FF00]" />
              <span className="font-['JetBrains_Mono'] text-xs text-[#D4FF00]">
                Loaded ({jdText.length} chars)
              </span>
            </div>
          )}

          {/* Step 2: Resume Upload */}
          <div className="mb-6">
            <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-slate-500 mb-2">
              Step 2: Your Resume
            </label>
            <div
              className="relative py-8 border border-dashed border-white/15 hover:border-[#D4FF00]/40 rounded-lg transition-all duration-200 cursor-pointer group bg-black/40"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <Upload size={28} className="text-[#D4FF00] mb-2 group-hover:scale-105 transition-transform duration-200" />
                <p className="font-['JetBrains_Mono'] text-xs text-slate-400">
                  {resumeFile ? resumeFile.name : 'Upload PDF Resume'}
                </p>
              </div>
            </div>
            {resumeFile && (
              <div className="flex items-center gap-2 mt-2 text-[#D4FF00]">
                <CheckCircle2 size={12} />
                <span className="font-['JetBrains_Mono'] text-xs">Resume uploaded</span>
              </div>
            )}
          </div>

          {/* Status indicator */}
          {(jdText || jdUrl) && resumeFile && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center justify-center gap-2 py-3 bg-[#D4FF00]/10 border border-[#D4FF00]/30 rounded-lg"
            >
              <CheckCircle2 size={16} className="text-[#D4FF00]" />
              <span className="font-['JetBrains_Mono'] text-sm text-[#D4FF00]">
                Ready — Select a service below
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ===== SERVICE CARD COMPONENT =====

const ServiceCard = ({ service, index, onClick, isReady }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 + (index * 0.03), duration: 0.3 }}
    onClick={onClick}
    className={cn(
      "group bg-[#0D0D0D]/80 border border-white/5 rounded-xl p-6 md:p-8 min-h-[220px] transition-all duration-300 cursor-pointer flex flex-col justify-between backdrop-blur-sm",
      isReady
        ? "hover:-translate-y-1 hover:border-[#D4FF00]/50 hover:shadow-[0_8px_30px_rgba(212,255,0,0.08)]"
        : "opacity-50 cursor-not-allowed"
    )}
  >
    <div>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#D4FF00] group-hover:text-black transition-all duration-300 text-slate-400">
          <service.icon size={22} strokeWidth={1.5} />
        </div>
        {isReady && (
          <ArrowRight size={16} className="text-slate-600 group-hover:text-[#D4FF00] transition-colors duration-300 mt-3" />
        )}
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-white mb-2 tracking-tight font-['Inter']">{service.title}</h3>
      <p className="text-sm text-slate-500 font-['JetBrains_Mono'] leading-relaxed line-clamp-2">{service.desc}</p>
    </div>
    {isReady && (
      <div className="mt-4 pt-4 border-t border-white/5">
        <span className="text-[#D4FF00] font-['JetBrains_Mono'] text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {service.actionText}
        </span>
      </div>
    )}
  </motion.div>
);

// ===== SERVICES SECTION =====

const ServicesSection = ({ services, onServiceClick, isReady }) => (
  <section className="py-16 md:py-20 bg-black relative" id="features">
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12">
      {/* Section Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 bg-[#D4FF00] rounded-full"></div>
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-slate-500">
            Available Services
          </span>
        </div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight font-['Inter']">
          AI-Powered Analysis Tools
        </h2>
        <p className="font-['JetBrains_Mono'] text-sm text-slate-500 mt-2 max-w-md">
          Select a tool to analyze your resume and job description
        </p>
      </div>

      {/* Service Cards Grid - 4 columns with 32-40px gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            onClick={() => onServiceClick(service)}
            isReady={isReady}
          />
        ))}
      </div>
    </div>
  </section>
);

// ===== HOW IT WORKS SECTION =====

const HowItWorksSection = () => (
  <section className="py-16 md:py-20 border-t border-white/5 bg-[#050505]" id="how-it-works">
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-10 md:gap-16">
      <div className="w-full lg:w-1/2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-[#D4FF00] rounded-full"></div>
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-slate-500">
            How It Works
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-['Inter']">
          Beat the <span className="text-[#D4FF00]">Algorithm</span>
        </h2>
        <p className="text-base text-slate-400 mb-8 max-w-md leading-relaxed">
          Modern recruitment is automated. Our platform gives you the same tools corporations use to optimize your profile for maximum algorithmic visibility.
        </p>
        <ul className="space-y-4 font-['JetBrains_Mono'] text-sm text-slate-300">
          <li className="flex items-center gap-3">
            <CheckCircle2 className="text-[#D4FF00] flex-shrink-0" size={18} />
            <span>Semantic keyword mapping</span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle2 className="text-[#D4FF00] flex-shrink-0" size={18} />
            <span>Multi-format structure verification</span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle2 className="text-[#D4FF00] flex-shrink-0" size={18} />
            <span>Contextual influence analysis</span>
          </li>
        </ul>
      </div>
      <div className="w-full lg:w-1/2 relative">
        <div className="bg-[#0D0D0D] rounded-xl p-6 md:p-8 border border-white/10 shadow-[0_0_60px_rgba(212,255,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
            </div>
            <div className="text-[10px] font-['JetBrains_Mono'] text-slate-600 uppercase tracking-wider">Analysis Running...</div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-[#D4FF00]/10 rounded-full overflow-hidden border border-[#D4FF00]/20">
              <motion.div
                className="h-full bg-[#D4FF00] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '87.4%' }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/50 rounded-lg p-4 border border-white/5">
                <p className="text-[10px] font-['JetBrains_Mono'] mb-1 text-slate-500 uppercase">Match</p>
                <p className="text-2xl md:text-3xl font-bold text-[#D4FF00]">87.4%</p>
              </div>
              <div className="bg-black/50 rounded-lg p-4 border border-white/5">
                <p className="text-[10px] font-['JetBrains_Mono'] mb-1 text-slate-500 uppercase">Risk</p>
                <p className="text-2xl md:text-3xl font-bold text-white">LOW</p>
              </div>
            </div>
            <div className="bg-black/50 rounded-lg p-4 font-['JetBrains_Mono'] text-[11px] leading-relaxed text-slate-500 border border-white/5 h-32 overflow-y-auto">
              <span className="text-[#D4FF00]">&gt; INITIALIZED</span><br />
              &gt; [CRITICAL] Missing: "Distributed Systems"<br />
              &gt; [SUGGEST] Upgrade "Leadership"<br />
              &gt; [OK] Format verified<br />
              &gt; [INFO] 1,204 profiles analyzed
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4FF00]/10 blur-[100px] -z-10"></div>
      </div>
    </div>
  </section>
);

// ===== CTA SECTION =====

const CTASection = ({ onScrollToTop }) => (
  <section className="py-16 md:py-20 bg-[#0D0D0D] border-y border-white/5">
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 text-center">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight font-['Inter']">
        Ready to Optimize Your Career?
      </h2>
      <p className="text-sm text-slate-400 font-['JetBrains_Mono'] mb-8 max-w-md mx-auto">
        Join professionals who have accelerated their trajectory with AI-powered optimization.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={onScrollToTop}
          className="px-6 py-3 bg-[#D4FF00] text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white transition-all duration-200"
        >
          Start Analysis
        </button>
        <button className="px-6 py-3 border border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:border-[#D4FF00] hover:text-[#D4FF00] transition-all duration-200">
          Learn More
        </button>
      </div>
    </div>
  </section>
);

// ===== FOOTER =====

const Footer = () => (
  <footer className="bg-black py-12 md:py-16 border-t border-white/5">
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <div className="font-['JetBrains_Mono'] font-bold text-xl tracking-tight text-white mb-4">
            APP<span className="text-[#D4FF00]">LICATION</span>
          </div>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed font-['JetBrains_Mono']">
            AI-powered career optimization through algorithmic precision.
          </p>
        </div>
        <div>
          <h4 className="font-['JetBrains_Mono'] text-xs font-bold text-white mb-4 uppercase tracking-wider">Services</h4>
          <ul className="space-y-2 text-sm text-slate-500 font-['JetBrains_Mono']">
            <li><a className="hover:text-[#D4FF00] transition-colors" href="#">ATS Scanner</a></li>
            <li><a className="hover:text-[#D4FF00] transition-colors" href="#">Job Match</a></li>
            <li><a className="hover:text-[#D4FF00] transition-colors" href="#">CV Builder</a></li>
            <li><a className="hover:text-[#D4FF00] transition-colors" href="#">Interview Prep</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-['JetBrains_Mono'] text-xs font-bold text-white mb-4 uppercase tracking-wider">Newsletter</h4>
          <p className="text-slate-500 mb-4 font-['JetBrains_Mono'] text-xs">Get updates on market trends.</p>
          <div className="relative flex">
            <input className="flex-1 bg-white/5 border border-white/10 rounded-l-lg py-3 px-4 text-sm focus:ring-1 focus:ring-[#D4FF00] outline-none text-white font-['JetBrains_Mono'] placeholder:text-slate-600" placeholder="Email" type="email" />
            <button className="px-4 bg-[#D4FF00] text-black font-bold text-sm rounded-r-lg hover:bg-white transition-all">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 gap-4">
        <p className="font-['JetBrains_Mono'] text-xs text-slate-600 text-center md:text-left">
          © 2024 Application. All rights reserved.
        </p>
        <div className="flex gap-6 font-['JetBrains_Mono'] text-xs text-slate-600">
          <a className="hover:text-white transition-colors" href="#">Privacy</a>
          <a className="hover:text-white transition-colors" href="#">Terms</a>
        </div>
      </div>
    </div>
  </footer>
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
      // LinkedIn People - Get search data and open LinkedIn
      if (service.id === 'linkedin-people') {
        const response = await fetch(`${BACKEND_URL}${service.endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jd: jdText })
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          // Use the first simple search string
          const searchQuery = data.simple_searches?.[0] || `${data.company_name} Recruiter`;

          // Open LinkedIn with simple search
          const linkedinUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchQuery)}`;
          window.open(linkedinUrl, '_blank');

          // Store result for display
          setResult({
            ...data,
            search_query: searchQuery,
            linkedin_url: linkedinUrl,
            message: 'LinkedIn search opened in new tab. Search for HR professionals and recruiters.'
          });
        }
        setIsLoading(false);
        return;
      }

      // For other services - standard flow
      let extractedResumeText = resumeText;

      if (resumeFile && !resumeText) {
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
      className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-[#050505]"
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onBack();
        }}
        className="flex items-center gap-2 bg-[#0D0D0D] hover:bg-[#1a1a1a] text-[#D4FF00] px-4 py-3 transition-all mb-8 font-['JetBrains_Mono'] text-sm uppercase tracking-wider border border-white/10 hover:border-[#D4FF00]"
      >
        <ChevronLeft size={20} />
        Back to Dashboard
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="w-16 h-16 bg-white/5 flex items-center justify-center mb-6 text-[#D4FF00]">
            <service.icon size={32} strokeWidth={1.5} />
          </div>

          <h1 className="font-['Inter'] text-4xl md:text-5xl font-black text-white mb-4 uppercase">
            {service.title}
          </h1>

          <div className="flex gap-4 mb-6">
            <div className="w-1 bg-[#D4FF00]"></div>
            <p className="font-['JetBrains_Mono'] text-sm text-slate-400">
              {service.desc}
            </p>
          </div>

          <p className="font-['JetBrains_Mono'] text-sm text-slate-500 mb-8 leading-relaxed">
            {service.fullDesc}
          </p>

          <button
            onClick={handleLaunchTool}
            disabled={isLoading || !jdText}
            className="bg-[#D4FF00] text-black hover:bg-white disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed font-['JetBrains_Mono'] font-bold text-sm px-8 py-4 transition-all flex items-center gap-3 uppercase tracking-widest"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {service.id === 'linkedin-people' ? 'Generating Search...' : 'Processing...'}
              </>
            ) : (
              <>
                {service.id === 'linkedin-people' ? (
                  <>
                    <Users size={18} />
                    MAP NETWORK
                  </>
                ) : (
                  service.actionText || 'LAUNCH TOOL'
                )}
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500">
              <p className="font-['JetBrains_Mono'] text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 p-8 min-h-[400px] flex flex-col">
          {!result && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 border border-white/10 flex items-center justify-center">
                  <service.icon size={32} className="text-[#D4FF00]" />
                </div>
                <div className="absolute inset-0 border border-[#D4FF00]/20 animate-ping" style={{ animationDuration: '2s' }}></div>
              </div>
              <h3 className="font-['Inter'] text-xl text-white mb-2 uppercase">Module Ready</h3>
              <p className="font-['JetBrains_Mono'] text-xs text-slate-500">Awaiting Input Data</p>
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
              className="flex items-start gap-2 text-sm text-slate-300 font-['JetBrains_Mono'] bg-black p-3 border border-white/5"
            >
              {typeof item === 'object' ? (
                <div className="w-full">
                  {Object.entries(item).map(([k, v]) => (
                    <div key={k} className="mb-1">
                      <span className="text-[#D4FF00] text-xs uppercase">{k}: </span>
                      <span className="text-slate-300">{String(v)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <span className="text-[#D4FF00] mt-1">•</span>
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
            <div key={k} className="bg-black p-3 border border-white/5">
              <span className="text-[#D4FF00] text-xs uppercase font-['JetBrains_Mono']">{k}</span>
              <p className="text-slate-300 text-sm font-['JetBrains_Mono'] mt-1 whitespace-pre-wrap">{String(v)}</p>
            </div>
          ))}
        </div>
      );
    } else if (typeof value === 'number') {
      return (
        <div className="text-4xl font-['Inter'] font-black text-[#D4FF00]">
          {value}{key.includes('score') || key.includes('probability') || key.includes('match') ? '%' : ''}
        </div>
      );
    } else {
      return (
        <p className="text-slate-300 text-sm font-['JetBrains_Mono'] whitespace-pre-wrap">{String(value)}</p>
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
          <h3 className="font-['Inter'] text-lg text-white mb-3 flex items-center gap-2 uppercase">
            <Sparkles size={16} className="text-[#D4FF00]" />
            {formatKey(key)}
          </h3>
          {renderValue(key, value)}
        </motion.div>
      ))}
    </div>
  );
};

// ===== LOGIN MODAL COMPONENT =====

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, ''));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0D0D0D] border border-white/10 p-8 md:p-12 w-full max-w-md relative"
        >
          {/* Corner accents */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#D4FF00]"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4FF00]"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#D4FF00]"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#D4FF00]"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/5 flex items-center justify-center mb-6 mx-auto">
              <Shield size={32} className="text-[#D4FF00]" />
            </div>
            <h2 className="font-['Inter'] text-2xl font-black text-white uppercase tracking-tight">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            <p className="font-['JetBrains_Mono'] text-xs text-slate-500 mt-2 uppercase tracking-widest">
              {isSignUp ? 'JOIN THE SYSTEM' : 'AUTHENTICATION REQUIRED'}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30">
              <p className="font-['JetBrains_Mono'] text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-['JetBrains_Mono'] text-xs text-slate-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 py-4 px-4 font-['JetBrains_Mono'] text-sm focus:ring-1 focus:ring-[#D4FF00] focus:border-[#D4FF00] outline-none transition-all text-white placeholder:text-slate-700"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block font-['JetBrains_Mono'] text-xs text-slate-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-black/40 border border-white/10 py-4 px-4 font-['JetBrains_Mono'] text-sm focus:ring-1 focus:ring-[#D4FF00] focus:border-[#D4FF00] outline-none transition-all text-white placeholder:text-slate-700"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D4FF00] text-black hover:bg-white disabled:bg-slate-700 disabled:text-slate-500 font-['JetBrains_Mono'] font-bold text-sm py-4 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Toggle sign up / sign in */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="font-['JetBrains_Mono'] text-xs text-slate-500 hover:text-[#D4FF00] transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
  const [currentView, setCurrentView] = useState('landing');
  const [selectedService, setSelectedService] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingService, setPendingService] = useState(null);

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

    if (service.id !== 'linkedin-people' && !resumeFile) {
      alert('Please upload your resume PDF first.');
      return;
    }

    // Check if user is authenticated
    if (!user) {
      setPendingService(service);
      setShowLoginModal(true);
      return;
    }

    setSelectedService(service);
    setCurrentView('service');
  };

  const handleLoginSuccess = () => {
    // If there was a pending service, navigate to it
    if (pendingService) {
      setSelectedService(pendingService);
      setCurrentView('service');
      setPendingService(null);
    }
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isReady = (jdText || (jdUrl && isScraped)) && resumeFile;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-['Inter'] transition-colors duration-300 overflow-x-hidden selection:bg-[#D4FF00] selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Inter:wght@300;400;600;800;900&display=swap');
      `}</style>

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
              <ScrollingMarquee />
              <ServicesSection
                services={SERVICES}
                onServiceClick={handleServiceClick}
                isReady={isReady || jdText}
              />
              <HowItWorksSection />
              <CTASection onScrollToTop={scrollToTop} />
              <Footer />
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

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingService(null);
        }}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}