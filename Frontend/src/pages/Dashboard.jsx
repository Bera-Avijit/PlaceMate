import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { uploadResume } from '../services/resumeService';

const Dashboard = () => {
  const { user } = useAuth();
  // State for resume status
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadResume(file, user.uid, user.email);
      
      if (result.success) {
        setHasUploaded(true);
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
        <header className="mb-12">
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
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Conditional Onboarding Section */}
            <AnimatePresence mode="wait">
              {!hasUploaded ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0a0a0a] border border-amber-500/20 rounded-[2.5rem] p-12 relative overflow-hidden group shadow-2xl shadow-amber-500/5"
                >
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
              ) : (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* AI Analysis Result (Example Card) */}
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 hover:border-amber-500/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                        <CheckCircle className="text-green-500" size={24} />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
                    </div>
                    <h3 className="text-lg font-black mb-2 uppercase tracking-wide">Resume Intelligence</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">Your skills have been indexed. Our AI is currently identifying high-impact career paths based on your profile.</p>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                    </div>
                  </div>

                  {/* Target Match Placeholder (Example Card) */}
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 hover:border-amber-500/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        <Target className="text-amber-500" size={24} />
                      </div>
                      <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full uppercase tracking-widest">Processing</span>
                    </div>
                    <h3 className="text-lg font-black mb-2 uppercase tracking-wide">Company Matches</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">Scanning top tier organizations including Google, Microsoft, and Uber to find your perfect fit.</p>
                    <div className="flex -space-x-3">
                       {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-white/10 flex items-center justify-center text-[10px] font-bold">JD</div>)}
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
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="lg:col-span-4 space-y-8">
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
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
