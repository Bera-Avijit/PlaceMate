import React from 'react';

const ResumePanel = ({ parsedData }) => {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Resume Summary</h4>
      <div className="text-xl font-black mb-2">Level: <span className="text-amber-500">{parsedData?.level || 'N/A'}</span></div>
      <div className="text-[13px] text-slate-400 mb-4">Companies matched: <span className="font-black text-white">{parsedData?.companies?.length || 0}</span></div>

      <div>
        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Top Skills</h5>
        <div className="flex flex-wrap gap-2">
          {parsedData?.companies?.[0]?.skillOverlap?.slice(0, 8).map((s, i) => (
            <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[11px] font-black uppercase text-slate-300">{s}</span>
          ))}
          {!parsedData?.companies?.[0]?.skillOverlap?.length && (
            <span className="text-slate-500 text-[12px]">No skills detected</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePanel;
