import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Target, 
  LayoutDashboard, 
  Briefcase, 
  BookOpen,
  Settings,
  ArrowRight,
  CloudUpload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { uploadResume, getUserResults } from '../services/resumeService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // State for resume status
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [onboardingMode, setOnboardingMode] = useState('choice'); // choice, upload, basics
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoadingPersistent, setIsLoadingPersistent] = useState(true);

  // Free Tier Logic
  const [unlockedCompany, setUnlockedCompany] = useState(localStorage.getItem('unlockedCompany') || null);

  const handleViewPlan = (companyName) => {
    if (!unlockedCompany) {
      // Free tier: unlock first company
      localStorage.setItem('unlockedCompany', companyName);
      setUnlockedCompany(companyName);
      navigate(`/plan/${companyName}`);
    } else if (unlockedCompany === companyName) {
      // Already unlocked
      navigate(`/plan/${companyName}`);
    } else {
      // Attempting to view a second company on free tier
      navigate('/pricing');
    }
  };

  // Check for existing data on mount
  useEffect(() => {
    const checkExistingData = async () => {
      if (user?.uid) {
        setIsLoadingPersistent(true);
        const existingData = await getUserResults(user.uid);
        if (existingData) {
          setHasUploaded(true);
          setParsedData(existingData);
        }
        setIsLoadingPersistent(false);
      }
    };
    checkExistingData();
  }, [user]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadResume(file, user.uid, user.email);
      
      if (result.success) {
        setHasUploaded(true);
        setParsedData(result.data);
        console.log('✅ AI Parser: Resume Received', result.data);
      } else {
        setError("Network error. Please ensure n8n is active.");
        console.error('❌ AI Parser Error:', result.error);
      }
    } catch (err) {
      setError("Failed to reach intelligence node.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-12">
        {/* Header Section */}
        <header className="mb-12 flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase italic">
              Dashboard<span className="text-amber-500">.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
              Welcome back, {user?.displayName?.split(' ')[0] || 'Member'}
            </p>
          </motion.div>

          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center gap-3 px-6 py-3 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">
              {sidebarOpen ? 'Focus Mode' : 'Show Console'}
            </span>
            <LayoutDashboard size={16} className={sidebarOpen ? 'text-slate-500' : 'text-amber-500'} />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area */}
          <div className={`${sidebarOpen ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-8 transition-all duration-500`}>
            
            {isLoadingPersistent ? (
               <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Checking Persistence...</p>
               </div>
            ) : (
            <>
            <AnimatePresence mode="wait">
              {!hasUploaded && onboardingMode === 'choice' && (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div 
                    onClick={() => setOnboardingMode('upload')}
                    className="bg-[#0a0a0a] border border-amber-500/20 rounded-[2.5rem] p-10 cursor-pointer hover:border-amber-500/50 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                       <FileText size={160} />
                    </div>
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="text-amber-500" size={28} />
                    </div>
                    <h3 className="text-xl font-black mb-2 uppercase italic">I have a Resume</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">Let AI parse your history and find your perfect career match instantly.</p>
                  </div>

                  <div 
                    onClick={() => setOnboardingMode('basics')}
                    className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 cursor-pointer hover:border-amber-500/50 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                       <BookOpen size={160} />
                    </div>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <TrendingUp className="text-amber-500" size={28} />
                    </div>
                    <h3 className="text-xl font-black mb-2 uppercase italic">Start from Basics</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">Early in your journey? Start your preparation roadmap from scratch.</p>
                  </div>
                </motion.div>
              )}

              {!hasUploaded && onboardingMode === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0a0a0a] border border-amber-500/20 rounded-[2.5rem] p-12 relative overflow-hidden group shadow-2xl shadow-amber-500/5"
                >
                  <button 
                    onClick={() => setOnboardingMode('choice')}
                    className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white"
                  >
                    ← Back
                  </button>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:bg-amber-500/10 transition-colors" />
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                      <CloudUpload className="text-amber-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-black mb-4 uppercase tracking-wider">Initialize AI Analysis</h2>
                    <p className="text-slate-500 text-sm max-w-md mb-10 leading-relaxed font-medium">
                      Your career journey starts here. Upload your resume to allow our AI to parse your skills, match you with top companies, and build your personalized roadmap.
                    </p>
                    
                    <label className="cursor-pointer group">
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={isUploading} />
                      <div className="px-12 py-5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-full transition-all flex items-center gap-3 active:scale-95 shadow-xl shadow-amber-500/20">
                        {isUploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Processing Resume...
                          </>
                        ) : (
                          <>
                            Upload Your PDF
                            <ArrowRight size={16} />
                          </>
                        )}
                      </div>
                    </label>
                    <p className="mt-6 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Supports PDF, DOCX (Max 10MB)</p>
                  </div>
                </motion.div>
              )}

              {!hasUploaded && onboardingMode === 'basics' && (
                <motion.div
                  key="basics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-12"
                >
                  <button 
                    onClick={() => setOnboardingMode('choice')}
                    className="mb-8 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white"
                  >
                    ← Back
                  </button>
                  <h2 className="text-2xl font-black mb-4 uppercase italic">Choose Your Target Company</h2>
                  <p className="text-slate-500 text-sm mb-10 font-bold uppercase tracking-widest">Select a company to start your foundational prep roadmap</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Google', 'Microsoft', 'Amazon', 'Meta', 'Firebase', 'MongoDB', 'Netflix', 'Tesla'].map((company) => (
                      <button 
                        key={company}
                        className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-amber-500/50 text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {hasUploaded && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* AI Analysis Result */}
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 hover:border-amber-500/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                        <CheckCircle className="text-green-500" size={24} />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">Analysis Complete</span>
                    </div>
                    <h3 className="text-lg font-black mb-2 uppercase tracking-wide">Resume Intelligence</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">Level Detected: <span className="text-amber-500 font-black uppercase italic">{parsedData?.level || 'N/A'}</span></p>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                    </div>
                  </div>

                  {/* Target Match */}
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 hover:border-amber-500/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        <Target className="text-amber-500" size={24} />
                      </div>
                      <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full uppercase tracking-widest">{parsedData?.companies?.length || 0} Matches Found</span>
                    </div>
                    <h3 className="text-lg font-black mb-2 uppercase tracking-wide">Company Pipeline</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">Your profile is a high match for Tier 1 tech startups and product companies.</p>
                    <div className="flex -space-x-3">
                       {parsedData?.companies?.slice(0, 5).map((c, i) => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-amber-500 flex items-center justify-center text-[8px] font-black text-black uppercase">
                           {c.name.substring(0, 2)}
                         </div>
                       ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* AI Analysis Confirmation & Results */}
            <AnimatePresence>
              {parsedData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-12"
                >
                  {/* Detailed Company Matching Section */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                       <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Career Trajectory Matches</h3>
                       <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-amber-500/20">Deep AI Benchmarking</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8">
                      {parsedData.companies.map((company, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 hover:bg-white/[0.01] transition-all group relative overflow-hidden"
                        >
                          {/* Match Score Indicator (Relative positioning to prevent overlap) */}
                          <div className="flex flex-col md:flex-row gap-10 items-start">
                            {/* Left: Company Identity & Score */}
                            <div className="w-full md:w-64 shrink-0">
                              <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                                    <Target className="text-amber-500" size={24} />
                                  </div>
                                  <div>
                                    <h4 className="text-2xl font-black uppercase italic tracking-tight">{company.name}</h4>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{company.location}</p>
                                  </div>
                                </div>
                                
                                {/* Score Circle */}
                                <div className="relative w-16 h-16 flex items-center justify-center">
                                   <svg className="w-16 h-16 transform -rotate-90">
                                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
                                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={176} strokeDashoffset={176 - (176 * company.matchScore) / 100} className="text-amber-500" />
                                   </svg>
                                   <span className="absolute text-[10px] font-black italic">{company.matchScore}%</span>
                                </div>
                              </div>

                              <div className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 ${company.applyReadiness === 'ready' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                {company.applyReadiness.replace('_', ' ')} • {company.type}
                              </div>
                              
                              <p className="text-slate-400 text-xs leading-relaxed font-medium mb-8 italic">"{company.matchReason}"</p>
                              
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => handleViewPlan(company.name)}
                                  className="px-6 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-amber-400 transition-all active:scale-95 flex items-center gap-2"
                                >
                                  {unlockedCompany === company.name ? 'View Prep Plan' : (unlockedCompany ? 'Unlock Plan 🔒' : 'Unlock Free Plan')}
                                  <ArrowRight size={14} />
                                </button>
                                <a href={company.careersUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-white transition-all">
                                  Careers
                                </a>
                              </div>
                            </div>

                            {/* Right: Technical Deep Dive */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full border-t md:border-t-0 md:border-l border-white/5 pt-10 md:pt-0 md:pl-10">
                              <div>
                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Skill Overlap</h5>
                                <div className="flex flex-wrap gap-2">
                                  {company.skillOverlap.map((skill, si) => (
                                    <span key={si} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase text-slate-300">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Interview Focus</h5>
                                <div className="space-y-2">
                                  {company.interviewFocus.map((focus, fi) => (
                                    <div key={fi} className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                      <div className="w-1 h-1 rounded-full bg-amber-500" />
                                      {focus}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {company.weakAreaWarning !== "None" && (
                                <div className="md:col-span-2 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                   <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-relaxed">⚠️ Warning: {company.weakAreaWarning}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Growth Journey Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Briefcase, label: 'Job Readiness', value: '42%', color: 'text-amber-500' },
                { icon: TrendingUp, label: 'Skill Growth', value: '+12%', color: 'text-green-500' },
                { icon: BookOpen, label: 'Quiz Progress', value: '0/15', color: 'text-blue-500' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-white/5 rounded-xl">
                      <stat.icon className={stat.color} size={18} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-black">{stat.value}</div>
                </div>
              ))}
            </div>
            </>
            )}
          </div>

          {/* Sidebar / Quick Actions */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-4 space-y-8"
              >
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-8 ml-1">Quick Console</h3>
                  <nav className="space-y-4">
                    {[
                      { icon: LayoutDashboard, label: 'Overview', active: true },
                      { icon: FileText, label: 'My Resume' },
                      { icon: Target, label: 'Challenges' },
                      { icon: Settings, label: 'Preferences' }
                    ].map((item, idx) => (
                      <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${item.active ? 'bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/10' : 'hover:bg-white/5 text-slate-500 hover:text-white font-bold text-sm uppercase italic'}`}>
                        <item.icon size={18} />
                        <span className="text-xs uppercase tracking-widest">{item.label}</span>
                      </div>
                    ))}
                  </nav>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2.5rem] p-8 text-black relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] -mr-16 -mt-16 rounded-full" />
                  <h3 className="font-black text-xl mb-4 italic leading-tight">PREMIUM <br/> PLACEMENT <br/> TRACKING</h3>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-6 opacity-80 leading-relaxed">Unlock advanced AI mock interviews and direct HR referrals.</p>
                  <button className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all active:scale-[0.98]">Coming Soon</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
