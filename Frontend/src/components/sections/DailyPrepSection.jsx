import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserResults } from '../../services/resume';
import { useNavigate } from 'react-router-dom';
import { Flame, Target, ArrowRight } from 'lucide-react';

const DailyPrepSection = ({ user }) => {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      setLoading(true);
      getUserResults(user.uid)
        .then((data) => {
          setPlanData(data);
        })
        .catch((err) => console.error('Error loading prep data:', err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user || !planData) return null;

  const targetCompany = planData?.companies?.[0]?.name || 'Your Target';
  const readinessScore = planData?.companies?.[0]?.matchScore || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-24 left-1/2 transform -translate-x-1/2 w-96 bg-gradient-to-br from-[#0a0a0a] to-[#151515] border border-amber-500/30 rounded-2xl p-6 shadow-2xl shadow-amber-500/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="text-amber-500" size={20} />
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Daily Prep</h3>
        </div>
        <span className="text-[10px] font-black text-amber-500 bg-amber-500/20 px-3 py-1 rounded-full">Active</span>
      </div>

      <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Today's Target</div>
        <div className="text-lg font-black text-white mb-3">{targetCompany}</div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, readinessScore)}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
            />
          </div>
          <span className="text-sm font-black text-amber-400">{readinessScore}%</span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">Readiness Score</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Skills Match</div>
          <div className="text-lg font-black text-white">{planData?.companies?.length || 0}</div>
          <p className="text-[9px] text-slate-600">Companies</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Your Level</div>
          <div className="text-lg font-black text-amber-400 italic">{planData?.level || 'N/A'}</div>
          <p className="text-[9px] text-slate-600">Profile</p>
        </div>
      </div>

      <button
        onClick={() => navigate(`/plan/${targetCompany}`)}
        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-amber-500/20"
      >
        <Target size={16} />
        Go to Plan & Solve
        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
};

export default DailyPrepSection;
