import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, CheckCircle2, AlertTriangle, BookOpen, Link as LinkIcon, ArrowLeft, Lock, Unlock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { generateCompanyPlan, getUserResults, getUserProgress } from '../services/resumeService';

const CompanyPlan = () => {
  const { companyName } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {

    console.log
    const fetchPlanAndProgress = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const profile = await getUserResults(user.uid);
        if (!profile || !profile.companies) {
          throw new Error("Could not find your profile data. Please upload your resume first.");
        }

        const companyObj = profile.companies.find(c => c.name === companyName);
        if (!companyObj) {
          throw new Error("Company not found in your target list.");
        }

        // Fetch user progress for unlocking days
        const progressData = await getUserProgress(user.uid, companyName);
        setProgress(progressData);

        const result = await generateCompanyPlan(user.uid, user.displayName || "User", profile.level, companyObj);
        if (result.success && result.data) {
          setPlan(result.data);
        } else {
          setError("Failed to generate plan. Please ensure the backend is available.");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanAndProgress();
  }, [companyName, user]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-inter">
      <Navbar />
      
      <main className="max-w-7xl w-full mx-auto px-6 pt-32 pb-24">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-amber-500 transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-[#0a0a0a] border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
             <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-8" />
             <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Generating AI Plan</h2>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">Running {companyName} pipeline via n8n...</p>
          </div>
        ) : error ? (
          <div className="bg-[#0a0a0a] border border-red-500/20 rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[80px] -mt-32 rounded-full pointer-events-none" />
             <AlertTriangle size={48} className="text-red-500 mx-auto mb-6" />
             <h2 className="text-2xl font-black uppercase tracking-widest mb-4">Generation Failed</h2>
             <p className="text-slate-400 text-sm font-medium mb-8 max-w-md mx-auto">{error}</p>
             <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors">
               Return to Dashboard
             </button>
          </div>
        ) : plan && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {/* Header Section */}
            <div className="p-10 md:p-16 border-b border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none" />
              
              <div className="flex flex-wrap items-center gap-4 mb-6 relative z-10">
                <span className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Custom AI Roadmap
                </span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  <Clock size={14} className="text-amber-500" /> {plan.daily_commitment} / day
                </span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  <Calendar size={14} className="text-amber-500" /> {plan.plan_length_days} Days
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight mb-4 relative z-10">
                {plan.target_company || companyName} <span className="text-amber-500">Prep Plan</span>
              </h1>
              <p className="text-slate-400 text-base font-medium leading-relaxed max-w-3xl relative z-10">
                {plan.plan_summary}
              </p>
            </div>

            {/* Analysis Grid */}
            <div className="p-10 md:p-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 hover:border-green-500/30 transition-colors group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Profile Strengths</h4>
                  </div>
                  <ul className="space-y-3">
                    {plan.strengths?.map((s, i) => (
                      <li key={i} className="text-sm text-slate-400 font-medium leading-relaxed flex items-start gap-3">
                        <span className="text-green-500 mt-1">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 hover:border-amber-500/30 transition-colors group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                      <AlertTriangle size={24} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Identified Gaps</h4>
                  </div>
                  <ul className="space-y-3">
                    {plan.gaps?.map((g, i) => (
                      <li key={i} className="text-sm text-slate-400 font-medium leading-relaxed flex items-start gap-3">
                        <span className="text-amber-500 mt-1">•</span> {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Verdict Banner */}
              {plan.verdict && (
                <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-[2rem] p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                  <div className="shrink-0 text-center">
                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">Match Score</h4>
                    <div className="text-6xl font-black text-white">{plan.verdict.score}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Out of 100</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-black text-white capitalize mb-4 flex items-center gap-3">
                      {plan.verdict.verdict?.replace('_', ' ')}
                      {plan.verdict.apply_after && (
                        <span className="px-3 py-1 bg-white/10 text-white text-[9px] uppercase tracking-widest rounded-full font-bold">
                          Apply: {plan.verdict.apply_after}
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium mb-6">
                      {plan.verdict.message?.replace(user.uid, user.displayName || "User")}
                    </p>
                    {plan.verdict.careers_url && (
                      <a href={plan.verdict.careers_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-200 transition-colors">
                        Visit Official Careers <LinkIcon size={14} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Day-by-Day Timeline */}
              <div>
                <h3 className="text-2xl font-black uppercase italic tracking-widest mb-10 border-b border-white/5 pb-4">
                  Day-by-Day <span className="text-amber-500">Execution</span>
                </h3>
                
                <div className="space-y-8">
                  {plan.days?.map((day) => {
                    const prevDay = day.day_number - 1;
                    const isPrevDayComplete = prevDay === 0 || (progress[prevDay] && progress[prevDay].total > 0 && progress[prevDay].completed === progress[prevDay].total);
                    const isUnlocked = day.day_number === 1 || isPrevDayComplete;
                    
                    const isCurrentDayComplete = progress[day.day_number] && progress[day.day_number].total > 0 && progress[day.day_number].completed === progress[day.day_number].total;

                    return (
                      <div key={day.day_number} className={`bg-white/[0.02] border rounded-3xl overflow-hidden transition-all duration-300 ${isUnlocked ? 'border-white/5 hover:border-white/10 opacity-100' : 'border-white/5 opacity-50 grayscale pointer-events-none'}`}>
                        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 font-black text-[10px] uppercase tracking-widest rounded-full ${isCurrentDayComplete ? 'bg-green-500 text-black' : isUnlocked ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
                                Day {day.day_number}
                              </span>
                              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                                <Clock size={12}/> {day.total_time}
                              </span>
                            </div>
                            <h4 className="text-xl font-black text-white flex items-center gap-3">
                              {day.title} 
                              {!isUnlocked && <Lock size={16} className="text-slate-500" />}
                              {isCurrentDayComplete && <CheckCircle2 size={16} className="text-green-500" />}
                            </h4>
                          </div>
                          <div className="flex flex-col md:items-end gap-3 mt-4 md:mt-0">
                            <p className="text-sm text-slate-500 italic max-w-md md:text-right">{day.theme}</p>
                            {isUnlocked ? (
                              <button 
                                onClick={() => navigate(`/practice/${companyName}/${day.day_number}`)}
                                className={`px-6 py-2 font-black uppercase text-[10px] tracking-widest rounded-xl transition-colors shadow-lg flex items-center gap-2 ${isCurrentDayComplete ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' : 'bg-white text-black hover:bg-amber-500'}`}
                              >
                                {isCurrentDayComplete ? 'Review Day' : `Practice Day ${day.day_number}`}
                              </button>
                            ) : (
                              <div className="px-6 py-2 bg-white/5 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-xl border border-white/5 flex items-center gap-2">
                                <Lock size={12} /> Locked
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-8 relative">
                          <div className="space-y-6">
                            {day.sessions?.map((session, i) => (
                              <div key={i} className="flex gap-6 items-start">
                                <div className="w-24 shrink-0 text-right pt-1">
                                  <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${isUnlocked ? 'text-amber-500' : 'text-slate-600'}`}>{session.block}</span>
                                  <span className="text-xs font-bold text-slate-500 block">{session.duration}</span>
                                </div>
                                <div className="w-0.5 min-h-[40px] bg-white/10 rounded-full shrink-0 relative mt-2">
                                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${isUnlocked ? 'bg-amber-500' : 'bg-slate-700'}`} />
                                </div>
                                <div className="flex-1 pb-4">
                                  <p className="text-base font-bold text-slate-300 mb-3">{session.focus}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CompanyPlan;
