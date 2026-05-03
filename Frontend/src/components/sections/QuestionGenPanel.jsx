import React, { useState } from 'react';
import { generateQuestions } from '../../services/resume';

const QuestionGenPanel = ({ user, parsedData }) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!user?.uid) return setError('Please sign in to generate questions');
    const companyName = parsedData?.companies?.[0]?.name || 'General';
    setLoading(true);
    setError(null);
    try {
      const res = await generateQuestions(user.uid, companyName, 1);
      if (res.success) setQuestions(res.data || []);
      else setError(res.error || 'Failed to generate');
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Question Generator</h4>
      <p className="text-xs text-slate-400 mb-4">Create targeted practice questions based on your profile and target company.</p>
      <button onClick={handleGenerate} className="px-4 py-2 bg-amber-500 text-black font-black rounded-lg text-sm mb-4" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Sample Questions'}
      </button>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      {questions.length > 0 && (
        <div className="space-y-3 mt-3">
          {questions.slice(0,5).map((q, i) => (
            <div key={i} className="p-3 bg-white/5 rounded-lg text-sm">
              <div className="font-black text-xs uppercase text-slate-400 tracking-wider">{q.topic || q.title || `Q${i+1}`}</div>
              <div className="mt-1 text-sm">{q.question}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionGenPanel;
