import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  BrainCircuit,
  RefreshCw,
  Target,
  MessageSquare,
  CheckCircle2,
  Lock,
  Zap,
  ChevronRight
} from "lucide-react";

/* ─── Data ─── */
const CORE_FEATURES = [
  {
    icon: FileText,
    tag: "Step 01",
    title: "Resume Intelligence",
    subtitle: "Parse. Score. Perfect.",
    description:
      "Drop your resume and our AI dissects every line - skills, gaps, ATS score, keyword density. Get a recruiter-eye-view before they even see it.",
    bullets: [
      "ATS compatibility score",
      "Skill gap analysis vs JD",
      "Auto-suggest improvements",
    ],
    accent: "from-amber-500/20 to-transparent",
    iconColor: "text-amber-400",
  },
  {
    icon: BrainCircuit,
    tag: "Step 02",
    title: "Predicted Questions",
    subtitle: "Company-matched. AI-generated.",
    description:
      "Our model studies hiring patterns from 200+ companies and generates the exact questions you're likely to face - technical, HR, and situational.",
    bullets: [
      "Role & company-specific",
      "Difficulty auto-calibrated",
      "STAR format suggestions",
    ],
    accent: "from-orange-500/20 to-transparent",
    iconColor: "text-orange-400",
  },
  {
    icon: RefreshCw,
    tag: "Step 03",
    title: "Daily Practice Loop",
    subtitle: "Automated. Adaptive. Relentless.",
    description:
      "Every morning you get a fresh personalized queue - DSA problems, mock questions, revision cards - all auto-selected by your weak zones.",
    bullets: [
      "Auto-curated daily plan",
      "Spaced repetition engine",
      "Streak tracking",
    ],
    accent: "from-yellow-500/20 to-transparent",
    iconColor: "text-yellow-400",
  },
  {
    icon: MessageSquare,
    tag: "Step 04",
    title: "AI Mock Interviews",
    subtitle: "Speak. Get judged. Improve.",
    description:
      "Full-blown mock sessions with an AI interviewer that adapts in real-time. Get scored on accuracy, communication, confidence, and structure.",
    bullets: [
      "Voice & text modes",
      "Instant scoring rubric",
      "Actionable debriefs",
    ],
    accent: "from-amber-600/20 to-transparent",
    iconColor: "text-amber-500",
  },
];

/* ─── Main Section ─── */
const FeaturesSection = () => {
  return (
    <section id="features" className="pt-16 pb-8 px-6 lg:px-12 bg-[#080808] relative overflow-hidden">
      {/* Ambient bg */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-500 font-black uppercase tracking-[0.35em] text-[12px] mb-6 flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-amber-500/50" />
            The System Inside
            <span className="w-12 h-px bg-amber-500/50" />
          </p>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.9] mb-8">
            Everything Automated.
            <br />
            <span className="text-amber-400 italic">Nothing Left to Chance.</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            From resume parsing to offer negotiation - our AI handles the entire pipeline. You just show up and practice.
          </p>
        </motion.div>

        {/* Interactive Hover Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {CORE_FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-[2rem] border border-white/5 bg-[#0a0a0a] overflow-hidden cursor-pointer transition-all duration-500 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1"
            >
              {/* Background Accent on Hover */}
              <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${feature.accent} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br ${feature.accent} blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <div className="relative p-8 flex flex-col h-full w-full">
                {/* Default Visible Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/20">
                      <feature.icon size={28} className={feature.iconColor} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-500/80 mb-1">
                        {feature.tag}
                      </p>
                      <h3 className="text-2xl font-black text-white leading-tight">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  {/* Hover Hint Icon */}
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-white/5 text-slate-500 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-black group-hover:rotate-90">
                    <ChevronRight size={16} />
                  </div>
                </div>

                {/* Always readable description */}
                <p className="text-base text-slate-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Expandable Extra Details via CSS Grid trick */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                  <div className="overflow-hidden">
                    <div className="pt-6 mt-6 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                      <p className="text-sm font-black uppercase tracking-widest text-amber-400 mb-4">
                        {feature.subtitle}
                      </p>
                      <div className="space-y-3">
                        {feature.bullets.map((b, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                            <span className="text-base font-bold text-slate-300">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;