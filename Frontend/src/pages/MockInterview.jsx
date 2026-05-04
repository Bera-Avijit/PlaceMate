import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, RefreshCcw, Sparkles, Volume2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getGeminiMockInterviewReply } from "../services/geminiAssistant";

const starterQuestion = "Tell me about yourself and why you want this role.";

const parseMockInterviewResponse = (text) => {
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      feedback: cleaned,
      nextQuestion: "Can you give me a specific example of a challenge you solved?",
      score: 6,
    };
  }
};

const MockInterview = () => {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(starterQuestion);
  const [feedback, setFeedback] = useState("Press start, answer out loud, and the coach will keep the interview moving.");
  const [lastAnswer, setLastAnswer] = useState("");
  const [round, setRound] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const shouldSubmitRef = useRef(false);
  const conversationRef = useRef([{ role: "assistant", content: starterQuestion }]);

  const speechRecognition = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const submitAnswer = useCallback(async (answerText) => {
    const trimmedAnswer = answerText.trim();
    if (!trimmedAnswer || isThinking) return;

    setIsThinking(true);
    setError("");
    setLastAnswer(trimmedAnswer);

    const conversation = [
      ...conversationRef.current,
      { role: "user", content: trimmedAnswer },
    ];
    conversationRef.current = conversation;

    try {
      const reply = await getGeminiMockInterviewReply({
        messages: conversation,
        companyName: user?.displayName || user?.email?.split("@")[0] || "your target role",
      });

      const parsed = parseMockInterviewResponse(reply);
      const nextQuestion = parsed.nextQuestion || currentQuestion;
      const safeFeedback = parsed.feedback || "Good attempt. Keep building a stronger example.";
      const score = Number.isFinite(Number(parsed.score)) ? Number(parsed.score) : 6;

      setFeedback(`${safeFeedback} Score: ${score}/10.`);
      setCurrentQuestion(nextQuestion);
      setRound((value) => value + 1);
      conversationRef.current = [
        ...conversation,
        { role: "assistant", content: `${safeFeedback} Next question: ${nextQuestion}` },
      ];
      speak(`${safeFeedback} Next question. ${nextQuestion}`);
    } catch (err) {
      const fallback = err.message || "The mock interview coach is unavailable right now.";
      setError(fallback);
      setFeedback(fallback);
    } finally {
      setIsThinking(false);
    }
  }, [currentQuestion, isThinking, speak, user?.displayName, user?.email]);

  useEffect(() => {
    if (!speechRecognition) return undefined;

    const recognition = new speechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      transcriptRef.current = transcript.trim();
      setLastAnswer(transcript.trim());
      setError("");
    };

    recognition.onerror = () => {
      setIsListening(false);
      shouldSubmitRef.current = false;
      setError("Voice input is not available in this browser.");
    };

    recognition.onend = () => {
      setIsListening(false);
      if (shouldSubmitRef.current && transcriptRef.current) {
        void submitAnswer(transcriptRef.current);
      }
      shouldSubmitRef.current = false;
      transcriptRef.current = "";
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [speechRecognition, submitAnswer]);

  const startInterview = () => {
    setStarted(true);
    setError("");
    speak(currentQuestion);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    shouldSubmitRef.current = true;
    transcriptRef.current = "";
    setLastAnswer("");
    setError("");
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch {
      setIsListening(false);
      setError("Unable to start voice input.");
    }
  };

  const stopListening = () => {
    shouldSubmitRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const resetInterview = () => {
    setStarted(false);
    setCurrentQuestion(starterQuestion);
    setFeedback("Press start, answer out loud, and the coach will keep the interview moving.");
    setLastAnswer("");
    setRound(1);
    setIsListening(false);
    setIsThinking(false);
    setError("");
    transcriptRef.current = "";
    shouldSubmitRef.current = false;
    conversationRef.current = [{ role: "assistant", content: starterQuestion }];
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-inter">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] px-6 py-10 sm:px-10 sm:py-12 shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-[90px]" />

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
              <Sparkles size={12} /> Mock Interview
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              Round {round}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tight text-white leading-none">
                Voice Mock Interview
              </h1>
              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-400">
                Speak your answer, hear the next question, and keep the flow going without a typing chat box.
              </p>

              <div className="mt-8 rounded-[2rem] border border-white/5 bg-black/50 p-6 sm:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-3">Interviewer prompt</p>
                <p className="text-xl sm:text-2xl font-semibold leading-relaxed text-white">{currentQuestion}</p>
              </div>

              <div className="mt-5 rounded-[1.75rem] border border-white/5 bg-white/[0.03] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">Coach feedback</p>
                <p className="text-sm leading-relaxed text-slate-300">{feedback}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-[2rem] border border-white/5 bg-[#050505] p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Your last answer</p>
                <p className="mt-3 min-h-28 text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                  {lastAnswer || "Your spoken answer will appear here while you talk."}
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Controls</p>
                {!started ? (
                  <button
                    onClick={startInterview}
                    className="w-full rounded-2xl bg-amber-500 px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-black transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Start interview
                  </button>
                ) : (
                  <div className="grid gap-3">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-[0.22em] transition-all ${isListening ? "bg-red-500 text-white" : "bg-amber-500 text-black"}`}
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                      {isListening ? "Stop speaking" : isThinking ? "Thinking..." : "Answer now"}
                    </button>
                    <button
                      onClick={() => speak(currentQuestion)}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-slate-200 transition-colors hover:border-amber-500/30 hover:text-amber-400"
                    >
                      <Volume2 size={16} /> Repeat question
                    </button>
                    <button
                      onClick={resetInterview}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-transparent px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-slate-400 transition-colors hover:border-white/20 hover:text-white"
                    >
                      <RefreshCcw size={16} /> Reset
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-white/5 bg-black/40 p-5 text-xs uppercase tracking-[0.22em] text-slate-500">
                <p>{isListening ? "Listening..." : isThinking ? "Evaluating answer..." : "Ready for voice input"}</p>
                {error ? <p className="mt-2 normal-case tracking-normal text-red-400">{error}</p> : null}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MockInterview;