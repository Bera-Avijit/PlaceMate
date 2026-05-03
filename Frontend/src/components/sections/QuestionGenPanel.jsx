import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { generateQuestions } from '../../services/resume';

const loadingStages = [
  'Reading your resume profile and target company.',
  'Finding the most relevant topics for practice questions.',
  'Selecting difficulty, format, and interview focus.',
  'Building a custom question set from your background.',
  'Finalizing the questions and prep order.'
];

const QuestionGenPanel = ({ user, parsedData }) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!loading) return;

    const timer = window.setInterval(() => {
      setLoadingStep((currentStep) => (currentStep + 1) % loadingStages.length);
    }, 1400);

    return () => window.clearInterval(timer);
  }, [loading]);

  const handleGenerate = async () => {
    if (!user?.uid) return setError('Please sign in to generate questions');
    const companyName = parsedData?.companies?.[0]?.name || 'General';
    setLoading(true);
    setLoadingStep(0);
    setError(null);
    setQuestions([]);
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">
      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Question Generator</h4>
      <p className="text-xs text-slate-400 mb-4">Create targeted practice questions based on your profile, project depth, and target company fit.</p>

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-amber-500 text-black font-black rounded-lg text-sm mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Generating Questions...' : 'Generate Sample Questions'}
      </button>

      {loading && (
        <div className="mb-4 rounded-2xl border border-amber-500/20 bg-white/[0.02] p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center shrink-0">
              <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">AI Generation Running</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Estimated 40 to 50 seconds</span>
              </div>
              <p className="text-white font-black text-sm mb-1">{loadingStages[loadingStep]}</p>
              <p className="text-xs text-slate-500">We are turning your resume and company match into interview-ready questions.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {['Profile', 'Topics', 'Difficulty', 'Answer Style', 'Company Fit', 'Finalize'].map((label, index) => {
              const active = index <= loadingStep;
              return (
                <div
                  key={label}
                  className={`rounded-xl border p-3 transition-colors ${active ? 'border-amber-500/30 bg-amber-500/10' : 'border-white/5 bg-white/[0.03]'}`}
                >
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${active ? 'text-amber-400' : 'text-slate-600'}`}>{label}</div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${active ? 'bg-amber-500/20' : 'bg-white/5'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: active ? '100%' : '18%' }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-amber-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            {[
              'Reading your profile summary and target company',
              'Detecting skills, projects, and experience signals',
              'Choosing the most useful interview topics',
              'Balancing technical, behavioral, and practical questions',
              'Personalizing the set for your company match'
            ].map((step, index) => (
              <div key={step} className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                <div className={`w-2.5 h-2.5 rounded-full ${index <= loadingStep ? 'bg-amber-500 animate-pulse' : 'bg-white/10'}`} />
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

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
    </motion.div>
  );
};

export default QuestionGenPanel;
