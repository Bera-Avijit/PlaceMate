import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Mic, MicOff, Send, X, Sparkles, Volume2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getGeminiAssistantReply } from "../services/geminiAssistant";

const quickPrompts = [
  "Help me improve my resume",
  "How do I start interview practice?",
  "Explain my company plan flow",
  "What should I do next on PlaceMate?",
];

const createWelcomeMessage = (pathname) => ({
  id: "welcome",
  role: "assistant",
  content: `Hi, I’m your PlaceMate assistant. I can guide you on ${pathname === "/" ? "resume prep, interview practice, and company planning" : "the current page and next step"}. Say something or type a question.`,
});

const VoiceAssistant = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([createWelcomeMessage(location.pathname)]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const shouldAutoSendRef = useRef(false);
  const messageListRef = useRef(null);

  const speechRecognition = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }, []);

  useEffect(() => {
    setMessages([createWelcomeMessage(location.pathname)]);
  }, [location.pathname]);

  useEffect(() => {
    if (!speechRecognition) return;

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
      setInput(transcript.trim());
      setError("");
    };

    recognition.onerror = () => {
      setIsListening(false);
      shouldAutoSendRef.current = false;
      setError("Voice input is not available in this browser.");
    };

    recognition.onend = () => {
      setIsListening(false);
      if (shouldAutoSendRef.current && transcriptRef.current) {
        void sendMessage(transcriptRef.current);
      }
      shouldAutoSendRef.current = false;
      transcriptRef.current = "";
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [speechRecognition]);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const appendMessage = (role, content) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role,
        content,
      },
    ]);
  };

  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || isSending) return;

    setIsSending(true);
    setError("");
    setInput("");
    appendMessage("user", text);

    try {
      const reply = await getGeminiAssistantReply({
        messages: [...messages, { role: "user", content: text }],
        locationPathname: location.pathname,
      });
      appendMessage("assistant", reply);
      speak(reply);
    } catch (err) {
      const fallback = err.message || "The assistant is unavailable right now.";
      setError(fallback);
      appendMessage("assistant", fallback);
    } finally {
      setIsSending(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    shouldAutoSendRef.current = true;
    transcriptRef.current = "";
    setInput("");
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
    shouldAutoSendRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[90] flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-black shadow-[0_0_40px_rgba(245,158,11,0.35)] transition-transform hover:scale-105 active:scale-95"
        aria-label="Open voice assistant"
      >
        <Bot size={28} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[90] w-[min(92vw,24rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-[#080808]/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-amber-500">
                  <Sparkles size={12} /> Voice Assistant
                </p>
                <p className="mt-1 text-[11px] text-slate-400">Gemini + free browser speech tools</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 transition-colors hover:text-white" aria-label="Close voice assistant">
                <X size={18} />
              </button>
            </div>

            <div ref={messageListRef} className="max-h-[26rem] space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === "assistant"
                        ? "bg-white/5 text-slate-100"
                        : "bg-amber-500 text-black"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 px-4 py-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300 transition-colors hover:border-amber-500/30 hover:text-amber-400"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black px-3 py-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      void sendMessage();
                    }
                  }}
                  placeholder="Ask me anything about your prep flow..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    isListening ? "bg-red-500 text-white" : "bg-white/5 text-slate-300 hover:text-amber-400"
                  }`}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <button
                  onClick={() => void sendMessage()}
                  disabled={isSending}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-black transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-slate-500">
                <span>{isSending ? "Thinking..." : isListening ? "Listening..." : "Ready"}</span>
                <button
                  onClick={() => speak(messages[messages.length - 1]?.content || "")}
                  className="flex items-center gap-1 text-slate-500 transition-colors hover:text-amber-400"
                >
                  <Volume2 size={12} /> Replay last
                </button>
              </div>

              {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;