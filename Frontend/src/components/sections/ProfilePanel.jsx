import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePanel = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Profile</h4>
      <div className="text-lg font-black mb-1">{user?.displayName || 'Member'}</div>
      <div className="text-xs text-slate-400 mb-4">{user?.email || 'No email'}</div>
      <div className="flex gap-3">
        <button onClick={() => navigate('/profile')} className="px-4 py-2 bg-white/5 text-white font-black rounded-lg text-sm">Edit Profile</button>
        <button onClick={() => navigate('/settings')} className="px-4 py-2 bg-amber-500 text-black font-black rounded-lg text-sm">Preferences</button>
      </div>
    </div>
  );
};

export default ProfilePanel;
