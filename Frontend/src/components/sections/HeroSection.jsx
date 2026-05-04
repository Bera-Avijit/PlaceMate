import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Brain,
  FileSearch,
  Target,
  Workflow,
  ArrowRight,
  Code2,
  BookOpen,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserResults } from "../../services/resumeService";

const Counter = ({ to, suffix = "" }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString() + suffix);

  useEffect(() => {
    const controls = animate(count, to, { duration: 2.2, ease: "easeOut" });
    return controls.stop;
  }, [count, to]);

  return <motion.span>{rounded}</motion.span>;
};

const ParticleField = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-500"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.15 }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const orbitItems = [
  { icon: FileSearch, label: "OCR", angle: 0 },
  { icon: Code2, label: "DSA", angle: 90 },
  { icon: Target, label: "MATCH", angle: 180 },
  { icon: Workflow, label: "FLOW", angle: 270 },
];

const AIOrb = () => {
  const radius = 130;

  return (
    <div className="relative w-[320px] h-[320px] flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border border-amber-500/10 animate-pulse" />
      <div className="absolute inset-[-20px] rounded-full border border-amber-500/5" />
      <div className="absolute inset-[-40px] rounded-full border border-amber-500/[0.03]" />

      <motion.div
        className="absolute inset-[-10px] rounded-full"
        style={{ background: "transparent", border: "1px dashed rgba(245,158,11,0.15)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute"
        style={{ width: radius * 2, height: radius * 2 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {orbitItems.map((item, i) => {
          const rad = (item.angle * Math.PI) / 180;
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);

          return (
            <motion.div
              key={i}
              className="absolute flex flex-col items-center justify-center"
              style={{ width: 60, height: 60, left: radius + x - 30, top: radius + y - 30 }}
            >
              <motion.div
                className="w-[58px] h-[58px] rounded-2xl border border-white/10 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-1 cursor-pointer group"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                whileHover={{
                  scale: 1.15,
                  borderColor: "rgba(245,158,11,0.6)",
                  boxShadow: "0 0 24px rgba(245,158,11,0.3)",
                }}
              >
                <item.icon size={18} className="text-amber-400/70 group-hover:text-amber-400 transition-colors" />
                <span className="text-[7px] font-black tracking-widest text-slate-600 group-hover:text-amber-500 transition-colors uppercase">
                  {item.label}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="relative z-10 w-[110px] h-[110px] rounded-3xl bg-gradient-to-br from-amber-500/15 to-black border border-amber-500/30 flex flex-col items-center justify-center gap-2 cursor-pointer"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ borderColor: "rgba(245,158,11,0.7)", boxShadow: "0 0 40px rgba(245,158,11,0.25)" }}
      >
        <div className="absolute inset-0 rounded-3xl bg-amber-500/5 blur-xl" />
        <Brain size={30} className="text-amber-400 relative z-10" />
        <span className="text-[8px] font-black tracking-[0.35em] text-amber-500 uppercase relative z-10">AI Core</span>
      </motion.div>

      <motion.div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none" style={{ opacity: 0.06 }}>
        <motion.div
          className="absolute inset-x-0 h-px bg-amber-400"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

const StatPill = ({ icon: Icon, value, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay + 0.5, duration: 0.5 }}
    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm"
  >
    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
      <Icon size={14} className="text-amber-400" />
    </div>
    <div>
      <p className="text-base font-black text-white leading-none">
        <Counter to={value} suffix="+" />
      </p>
      <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  </motion.div>
);

const FeatureTag = ({ children, delay }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-500/20 text-amber-500/70 bg-amber-500/5"
  >
    {children}
  </motion.span>
);

const HeroSection = () => {
  const [hovered, setHovered] = useState(false);
  const [roadmapCompany, setRoadmapCompany] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadRoadmapCompany = async () => {
      if (!user?.uid) {
        setRoadmapCompany("");
        return;
      }

      const data = await getUserResults(user.uid);
      setRoadmapCompany(data?.companies?.[0]?.name || "");
    };

    loadRoadmapCompany();
  }, [user?.uid]);

  const handleStartPreparing = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/dashboard");
  };

  const handleExploreRoadmap = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (roadmapCompany) {
      navigate(`/plan/${roadmapCompany}`);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <section className="relative h-screen min-h-[650px] flex items-center justify-center overflow-hidden bg-[#080808] pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.08),transparent)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-amber-500/[0.025] blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <ParticleField />

      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Precision Drive 2026</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-4"
          >
            <h1 className="text-[60px] lg:text-[76px] font-black leading-[0.88] tracking-[-0.04em] text-white">
              <span className="block italic" style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: "1px rgba(245,158,11,0.6)" }}>
                Target.
              </span>
              <span className="block text-white">Train.</span>
              <span className="block text-amber-400">Triumph.</span>
            </h1>
          </motion.div>

          <motion.div className="flex flex-wrap gap-2 mb-4" />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[14px] text-slate-400 max-w-md mb-8 leading-relaxed"
          >
            The definitive AI ecosystem for placement mastery. Crack DSA, ace mock interviews,
            and land your dream offer - all in one precision-built platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap items-center gap-4 mb-8"
          >
            <motion.button
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartPreparing}
              className="relative group px-8 py-[17px] bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[11px] rounded-2xl transition-colors flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Start Preparing</span>
              <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
                <ArrowRight size={16} className="relative z-10" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExploreRoadmap}
              className="px-8 py-[17px] rounded-2xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 font-bold uppercase tracking-widest text-[11px] transition-all flex items-center gap-2"
            >
              <BookOpen size={14} />
              Explore Roadmap
            </motion.button>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            <StatPill icon={Target} value={24} label="Companies" delay={0.1} />
            <StatPill icon={TrendingUp} value={86} label="Readiness" delay={0.2} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center justify-center gap-5"
        >
          <AIOrb />

          <div className="grid grid-cols-2 gap-2 w-full max-w-[420px]">
            {[
              { icon: Code2, title: "DSA Practice", desc: "500+ curated problems" },
              { icon: Target, title: "Mock Drives", desc: "Real company patterns" },
              { icon: Brain, title: "AI Feedback", desc: "Instant code review" },
              { icon: TrendingUp, title: "Progress Track", desc: "Visual growth map" },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  borderColor: "rgba(245,158,11,0.3)",
                  backgroundColor: "rgba(245,158,11,0.05)",
                }}
                className="p-3 rounded-xl border border-white/6 bg-white/[0.02] cursor-pointer transition-colors group flex items-center gap-3"
              >
                <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <card.icon size={14} className="text-amber-400 group-hover:text-amber-300 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-white mb-0.5 uppercase tracking-wide">{card.title}</p>
                  <p className="text-[8px] text-slate-500 leading-tight">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
