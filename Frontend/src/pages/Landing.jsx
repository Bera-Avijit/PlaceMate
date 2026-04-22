import React from "react";
import { motion } from "framer-motion";
import {
  FileSearch,
  Trophy,
  MessageSquare,
  Zap,
  Target,
  ArrowRight,
  ShieldCheck,
  LineChart,
  Brain,
  History,
  Workflow,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";

const SectionHeader = ({ subtitle, title, center = true }) => (
  <div className={`mb-16 ${center ? "text-center" : ""}`}>
    <p className="text-amber-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
      {subtitle}
    </p>
    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
      {title}
    </h2>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col items-center text-center"
  >
    <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
      <Icon className="text-amber-500" size={28} />
    </div>
    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const RevolvingIntelligence = () => {
  const duration = 24;

  const items = [
    {
      icon: FileSearch,
      label: "OCR",
      top: 0,
      left: "50%",
      x: "-50%",
      y: "-50%",
    },
    { icon: Target, label: "MATCH", top: "50%", right: 0, x: "50%", y: "-50%" },
    { icon: Zap, label: "DSA", bottom: 0, left: "50%", x: "-50%", y: "50%" },
    {
      icon: Workflow,
      label: "TASK",
      top: "50%",
      left: 0,
      x: "-50%",
      y: "-50%",
    },
  ];

  return (
    <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center">
      <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative z-10 w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-black border border-amber-500/30 flex flex-col items-center justify-center"
      >
        <Brain className="text-amber-500 mb-1" size={32} />
        <span className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase">
          AI CORE
        </span>
      </motion.div>

      <motion.div
        className="absolute w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{
              borderColor: "#f59e0b",
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
            }}
            className="absolute w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-black border border-white/10 flex flex-col items-center justify-center gap-1 group transition-all"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              transform: `translate(${item.x}, ${item.y})`,
            }}
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex flex-col items-center"
            >
              <item.icon
                className="text-amber-500/70 group-hover:text-amber-500 transition-colors"
                size={20}
              />
              <span className="text-[7px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest transition-colors">
                {item.label}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 border border-white/5 rounded-full pointer-events-none opacity-40" />
    </div>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-slate-200 overflow-x-hidden">
      <Navbar />

      {/* Centered & Balanced Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center pt-20 overflow-hidden">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 px-10 items-center">
          <div className="text-left flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-[2px] bg-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">
                Precision Drive 2026
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                <span className="text-amber-500 italic">T</span>arget. <br />
                <span className="text-amber-500 italic">T</span>rain. <br />
                <span className="text-amber-500 italic">T</span>riumph.
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base text-slate-500 max-w-sm mb-10 leading-relaxed"
            >
              The definitive AI ecosystem for recruitment mastery. Trust the
              process, track your growth, and triumph in elite drives.
            </motion.p>

            <div className="flex">
              <button className="group px-10 py-[18px] bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[11px] rounded-full transition-all flex items-center gap-3 active:scale-95 shadow-2xl">
                Start Preparing
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center"
          >
            <RevolvingIntelligence />
          </motion.div>
        </div>
      </section>

      {/* Features & Process remain consistent */}
      <section id="features" className="py-32 px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader subtitle="Features" title="The System Inside." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Target}
              title="Targeting"
              description="Hiring DNA analysis."
            />
            <FeatureCard
              icon={Zap}
              title="Learning"
              description="Adaptive loops."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Verified"
              description="Elite databases."
            />
            <FeatureCard
              icon={MessageSquare}
              title="Mock AI"
              description="Soft skills coaching."
            />
          </div>
        </div>
      </section>

      <footer className="py-24 px-12 border-t border-white/5 bg-black text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl font-black text-white tracking-[0.5em]">
            PLACEMATE
          </h2>
          <div className="h-[2px] w-24 bg-amber-500 mx-auto" />
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.4em] leading-loose">
            Intelligent Placement Systems. <br />
            Built for the Class of 2026.
          </p>
          <p className="text-slate-800 text-[10px] pt-12 uppercase">
            © 2026 PLACEMATE AI. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
