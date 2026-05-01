import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, CheckCircle2, AlertTriangle, BookOpen, Link as LinkIcon } from 'lucide-react';
import { mockCompanyPlan } from '../data/mockCompanyPlan';

const CompanyPlanModal = ({ isOpen, onClose, companyName }) => {
  if (!isOpen) return null;

  // Use mock data for now
  const plan = mockCompanyPlan;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex-none p-8 border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white z-10"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                AI Generated Plan
              </span>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> {plan.daily_commitment} / day
              </span>
            </div>

            <h2 className="text-3xl font-black uppercase italic tracking-tight mb-2">
              {companyName} <span className="text-amber-500">Prep Plan</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-2xl">
              {plan.plan_summary}
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4 text-green-400">
                  <CheckCircle2 size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Strengths</h4>
                </div>
                <ul className="space-y-2">
                  {plan.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300 font-medium leading-relaxed">• {s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4 text-amber-500">
                  <AlertTriangle size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Key Gaps</h4>
                </div>
                <ul className="space-y-2">
                  {plan.gaps.map((g, i) => (
                    <li key={i} className="text-xs text-slate-300 font-medium leading-relaxed">• {g}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Verdict */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-12">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Verdict</h4>
                  <p className="text-lg font-black text-white capitalize">{plan.verdict.verdict.replace('_', ' ')}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Score</h4>
                  <p className="text-2xl font-black text-amber-500">{plan.verdict.score}/100</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium mb-4">{plan.verdict.message}</p>
              <div className="inline-block px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                Target Apply Date: {plan.verdict.apply_after}
              </div>
            </div>

            {/* Daily Plan */}
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3">
              <Calendar className="text-amber-500" />
              {plan.plan_length_days}-Day Roadmap
            </h3>
            
            <div className="space-y-6">
              {plan.days.map((day) => (
                <div key={day.day_number} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Day {day.day_number}</span>
                      <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1"><Clock size={12}/> {day.total_time}</span>
                    </div>
                    <h4 className="text-base font-black text-white mb-1">{day.title}</h4>
                    <p className="text-xs text-slate-400 italic">{day.theme}</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {day.sessions.map((session, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="w-20 shrink-0 text-right">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">{session.block}</span>
                            <span className="text-[10px] font-bold text-slate-400 block">{session.duration}</span>
                          </div>
                          <div className="w-1 h-full bg-white/5 rounded-full mt-1 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-white mb-1">{session.focus}</p>
                            <a href={session.resource} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase tracking-wider hover:text-amber-400 transition-colors">
                              <BookOpen size={10} /> Study Material <LinkIcon size={10} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompanyPlanModal;
