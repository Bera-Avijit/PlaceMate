import React from 'react';

const HeatmapPanel = ({ parsedData }) => {
  const companies = parsedData?.companies || [];

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Match Heatmap</h4>
      <p className="text-xs text-slate-400 mb-4">Visual overview of your match strength across targets.</p>

      <div className="space-y-3">
        {companies.slice(0,6).map((c, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-28 text-[12px] font-black uppercase text-slate-300">{c.name}</div>
            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
              <div style={{ width: `${Math.min(100, c.matchScore || 0)}%` }} className="h-full bg-amber-500" />
            </div>
            <div className="w-12 text-right text-[12px] font-black">{c.matchScore}%</div>
          </div>
        ))}
        {!companies.length && <div className="text-slate-500 text-sm">No companies to show yet.</div>}
      </div>
    </div>
  );
};

export default HeatmapPanel;
