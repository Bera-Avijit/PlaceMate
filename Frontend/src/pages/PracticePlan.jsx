import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Clock,
  CheckCircle2,
  Layout,
  AlertTriangle,
  Code
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { generateQuestions, submitAnswer } from "../services/resume";

const PracticePlan = () => {
  const { companyName, dayNumber } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [answers, setAnswers] = useState({});
  const [submittingIds, setSubmittingIds] = useState(new Set());

  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user) return;
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      setLoading(true);
      setError(null);

      try {
        const result = await generateQuestions(
          user.uid,
          companyName,
          dayNumber,
        );
        if (result.success && result.data && result.data.length > 0) {
          const sorted = result.data.sort((a, b) => a.session - b.session);
          console.log(result);
          setQuestions(sorted);
        } else {
          setError(result.error || "No questions generated or backend failed.");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [companyName, dayNumber, user]);

  const handleAnswerChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmitAnswer = async (question) => {
    const userAnswer = answers[question.id] || "";
    if (!userAnswer.trim()) return;

    setSubmittingIds((prev) => new Set(prev).add(question.id));

    try {
      const result = await submitAnswer(user.uid, question.docId, question.id, userAnswer);
      if (result.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === question.id ? { ...q, evaluation: result.data } : q
          )
        );
      } else {
        alert(result.error || "Failed to submit answer.");
      }
    } catch (err) {
      alert("Error submitting answer.");
    } finally {
      setSubmittingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(question.id);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-inter">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-6 pt-32 pb-24">
        <button
          onClick={() => navigate(`/plan/${companyName}`)}
          className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-amber-500 transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Prep Plan
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-[#0a0a0a] border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-8" />
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2">
              Generating Questions
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
              Running AI generation pipeline...
            </p>
          </div>
        ) : error ? (
          <div className="bg-[#0a0a0a] border border-red-500/20 rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[80px] -mt-32 rounded-full pointer-events-none" />
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-widest mb-4">
              Generation Failed
            </h2>
            <p className="text-slate-400 text-sm font-medium mb-8 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={() => navigate(`/plan/${companyName}`)}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
            >
              Return to Prep Plan
            </button>
          </div>
        ) : (
          questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-12 border-b border-white/5 pb-8 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none" />
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full">
                    Day {dayNumber}
                  </span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                    <Clock size={12} className="text-amber-500" />{" "}
                    {questions[0].estimated_total_time || "N/A"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight mb-3">
                  {questions[0].day_title || "Practice Session"}
                </h1>
                <p className="text-slate-400 text-base font-medium max-w-2xl">
                  Complete these practice questions to solidify your
                  understanding before moving on.
                </p>
              </div>

              <div className="space-y-8">
                {questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-amber-500/20 transition-colors shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-transparent opacity-50" />

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-lg">
                        Session {q.session}
                      </span>
                      <span
                        className={`px-3 py-1 border font-black text-[10px] uppercase tracking-widest rounded-lg ${
                          q.difficulty === "easy"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : q.difficulty === "medium"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-auto flex items-center gap-1">
                        <Clock size={12} /> {q.expected_time}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Layout size={14} /> {q.topic}
                    </h3>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-6">
                      <p className="text-lg font-medium text-white leading-relaxed whitespace-pre-line">
                        {q.question}
                      </p>
                    </div>

                    {q.link && (
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-6">
                        <a
                          href={q.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-lg font-medium text-amber-400 leading-relaxed break-all hover:text-amber-300 underline underline-offset-4"
                        >
                          {q.link}
                        </a>
                      </div>
                    )}

                    {q.hint && (
                      <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/10 rounded-xl p-5 mb-6">
                        <Lightbulb
                          size={18}
                          className="text-blue-500 shrink-0 mt-0.5"
                        />
                        <div>
                          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">
                            Hint
                          </h4>
                          <p className="text-sm text-slate-300 font-medium">
                            {q.hint}
                          </p>
                        </div>
                      </div>
                    )}

                    {q.evaluation ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        className="bg-white/[0.02] border border-amber-500/20 rounded-2xl p-6 mt-6 mb-6 overflow-hidden"
                      >
                        <div className="flex flex-wrap items-center gap-3 mb-6 border-b border-white/5 pb-4">
                          <h4 className="font-black uppercase tracking-widest text-amber-500 text-sm">AI Evaluation</h4>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ml-auto ${
                            q.evaluation.verdict === 'correct' ? 'bg-green-500/20 text-green-400' :
                            q.evaluation.verdict === 'partial' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {q.evaluation.verdict} • {q.evaluation.score}/10
                          </span>
                        </div>
                        <div className="space-y-6 text-sm font-medium text-slate-300">
                          <div>
                            <strong className="text-white block mb-2 uppercase text-[10px] tracking-widest">Feedback</strong> 
                            <p className="leading-relaxed">{q.evaluation.feedback}</p>
                          </div>
                          {q.evaluation.improvement && (
                            <div>
                              <strong className="text-white block mb-2 uppercase text-[10px] tracking-widest">Improvement</strong> 
                              <p className="leading-relaxed">{q.evaluation.improvement}</p>
                            </div>
                          )}
                          {q.evaluation.idealAnswer && (
                            <div className="bg-black/50 border border-white/5 p-5 rounded-xl mt-4">
                              <strong className="text-amber-500 flex items-center gap-2 mb-3 text-[10px] uppercase tracking-widest">
                                <Code size={12} /> Ideal Answer
                              </strong>
                              <pre className="text-xs font-mono text-slate-400 whitespace-pre-wrap overflow-x-auto custom-scrollbar">
                                {q.evaluation.idealAnswer}
                              </pre>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="mt-6 mb-6">
                        <textarea
                          value={answers[q.id] || ""}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          placeholder="Type your code or answer here..."
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm font-mono text-slate-300 focus:border-amber-500 outline-none transition-colors min-h-[160px] custom-scrollbar resize-y"
                        />
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => handleSubmitAnswer(q)}
                            disabled={submittingIds.has(q.id) || !answers[q.id]}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 border border-white/10"
                          >
                            {submittingIds.has(q.id) ? (
                              <>
                                <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                Evaluating...
                              </>
                            ) : (
                              "Submit Answer"
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        {q.resource_url && (
                          <a
                            href={q.resource_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-black text-slate-300 uppercase tracking-wider transition-colors"
                          >
                            <BookOpen size={14} /> Review Topic
                          </a>
                        )}
                      </div>
                      <button className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                        <CheckCircle2 size={14} /> Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <button
                  onClick={() => navigate(`/plan/${companyName}`)}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-lg shadow-amber-500/20"
                >
                  Complete Day {dayNumber}
                </button>
              </div>
            </motion.div>
          )
        )}
      </main>
    </div>
  );
};

export default PracticePlan;
