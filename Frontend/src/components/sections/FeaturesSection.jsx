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
  ChevronRight,
  Star,
  ArrowRight,
} from "lucide-react";

/* ─── Data ─── */
const FREE_FEATURES = [
  "Resume Parsing (3/month)",
  "5 AI-predicted questions/day",
  "Basic DSA problem set",
  "Mock Interview (text only)",
  "Progress dashboard",
];

const PAID_FEATURES = [
  "Unlimited resume parsing",
  "Unlimited AI question generation",
  "Company-specific question bank",
  "Voice + Video mock interviews",
  "Real-time AI coaching loop",
  "Priority drive alerts",
  "Dedicated mentor access",
  "Offer negotiation toolkit",
];

const CORE_FEATURES = [
  {
    icon: FileText,
    tag: "Step 01",
    title: "Resume Intelligence",
    subtitle: "Parse. Score. Perfect.",
    description:
      "Drop your resume and our AI dissects every line — skills, gaps, ATS score, keyword density. Get a recruiter-eye-view before they even see it.",
    bullets: [
      "ATS compatibility score",
      "Skill gap analysis vs JD",
      "Auto-suggest improvements",
      "Section-by-section feedback",
    ],
    badge: "Free · 3/month",
    badgePaid: "Paid · Unlimited",
    accent: "from-amber-500/20 to-transparent",
    free: true,
  },
  {
    icon: BrainCircuit,
    tag: "Step 02",
    title: "Predicted Questions",
    subtitle: "Company-matched. AI-generated.",
    description:
      "Our model studies hiring patterns from 200+ companies and generates the exact questions you're likely to face — technical, HR, and situational.",
    bullets: [
      "Role & company-specific",
      "Difficulty auto-calibrated",
      "STAR format suggestions",
      "Refresh anytime",
    ],
    badge: "Free · 5/day",
    badgePaid: "Paid · Unlimited",
    accent: "from-orange-500/15 to-transparent",
    free: true,
  },
  {
    icon: RefreshCw,
    tag: "Step 03",
    title: "Daily Practice Loop",
    subtitle: "Automated. Adaptive. Relentless.",
    description:
      "Every morning you get a fresh personalized queue — DSA problems, mock questions, revision cards — all auto-selected by your weak zones and target companies.",
    bullets: [
      "Auto-curated daily plan",
      "Spaced repetition engine",
      "Streak tracking",
      "Loop never breaks",
    ],
    badge: "Free · Basic loop",
    badgePaid: "Paid · Full automation",
    accent: "from-yellow-500/15 to-transparent",
    free: true,
  },
  {
    icon: MessageSquare,
    tag: "Step 04",
    title: "AI Mock Interviews",
    subtitle: "Speak. Get judged. Improve.",
    description:
      "Full-blown mock sessions with an AI interviewer that adapts in real-time. Get scored on accuracy, communication, confidence, and structure.",
    bullets: [
      "Text & voice modes",
      "Instant scoring rubric",
      "Follow-up questions",
      "Debrief + suggestions",
    ],
    badge: "Free · Text only",
    badgePaid: "Paid · Voice + Video",
    accent: "from-amber-600/15 to-transparent",
    free: false,
  },
];

/* ─── Sub-components ─── */
const Tag = ({ children, glow }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border
    ${glow
        ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
        : "border-white/8 text-slate-500 bg-white/[0.03]"
      }`}
  >
    {children}
  </span>
);

const Bullet = ({ text, locked }) => (
  <div className="flex items-center gap-3 py-1">
    {locked ? (
      <Lock size={12} className="text-slate-700 shrink-0" />
    ) : (
      <CheckCircle2 size={12} className="text-amber-500/70 shrink-0" />
    )}
    <span className={`text-[12px] ${locked ? "text-slate-700" : "text-slate-400"}`}>{text}</span>
  </div>
);

const FeatureCard = ({ feature, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group"
    >
      <motion.div
        whileHover={{ scale: 1.015 }}
        className="relative rounded-3xl border border-white/6 bg-[#0a0a0a] overflow-hidden cursor-pointer transition-all hover:border-amber-500/20"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Top gradient accent */}
        <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${feature.accent} via-amber-500/30 to-transparent`} />
        <div className={`absolute -top-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-br ${feature.accent} blur-2xl pointer-events-none`} />

        <div className="relative p-7">
          {/* Header row */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center shrink-0">
                <feature.icon size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-600 mb-0.5">
                  {feature.tag}
                </p>
                <h3 className="text-[16px] font-black text-white leading-tight">{feature.title}</h3>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={16} className="text-slate-600 group-hover:text-amber-500 transition-colors mt-1" />
            </motion.div>
          </div>

          {/* Subtitle */}
          <p className="text-[11px] font-black uppercase tracking-widest text-amber-500/60 mb-3">
            {feature.subtitle}
          </p>

          {/* Description */}
          <p className="text-[13px] text-slate-500 leading-relaxed mb-5">{feature.description}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <Tag glow={false}>{feature.badge}</Tag>
            <Tag glow={true}>
              <Zap size={8} />
              {feature.badgePaid}
            </Tag>
          </div>

          {/* Expandable bullets */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/5 pt-5 space-y-0.5">
                  {feature.bullets.map((b, i) => (
                    <Bullet key={i} text={b} locked={!feature.free && i >= 2} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};


/* ─── Automation Pipeline Visual ─── */
const PipelineBar = () => {
  const steps = [
    { label: "Upload Resume", icon: FileText },
    { label: "AI Parses & Scores", icon: Sparkles },
    { label: "Questions Generated", icon: BrainCircuit },
    { label: "Daily Loop Starts", icon: RefreshCw },
    { label: "Mock & Refine", icon: Target },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mt-20 rounded-3xl border border-white/6 bg-[#0a0a0a] p-8 overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/3 via-transparent to-orange-500/3 pointer-events-none" />
      <p className="text-[9px] font-black uppercase tracking-[0.35em] text-amber-500/60 mb-6 text-center">
        Full Automation Pipeline
      </p>
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="flex flex-col items-center gap-2 shrink-0"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
                <step.icon size={18} className="text-amber-400" />
              </div>
              <span className="text-[9px] font-bold text-slate-500 text-center max-w-[70px] leading-tight">
                {step.label}
              </span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.1 }}
                className="flex-1 h-px bg-gradient-to-r from-amber-500/30 to-amber-500/10 origin-left min-w-[20px]"
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-center text-[11px] text-slate-600 mt-6">
        100% automated · Zero manual setup · Works from Day 1
      </p>
    </motion.div>
  );
};

/* ─── Main Section ─── */
const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 px-6 lg:px-12 bg-[#080808] border-t border-white/5 relative overflow-hidden">
      {/* Ambient bg */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-amber-500 font-black uppercase tracking-[0.35em] text-[10px] mb-5 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-amber-500/50" />
            The System Inside
            <span className="w-6 h-px bg-amber-500/50" />
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.9] mb-6">
            Everything Automated.
            <br />
            <span className="text-amber-400 italic">Nothing Left to Chance.</span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            From resume to offer letter — our AI handles the entire pipeline. You just show up and practice.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CORE_FEATURES.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>

        {/* Automation pipeline */}
        <PipelineBar />

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-24 mb-8"
        >
        </motion.div>
        {/* <PricingCards /> */}
      </div>
    </section>
  );
};

export default FeaturesSection;