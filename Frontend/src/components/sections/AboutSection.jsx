import React from "react";
import { motion } from "framer-motion";
import { Target, Users, ShieldCheck, Zap } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-12 px-6 lg:px-12 bg-[#080808] relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 blur-[80px] pointer-events-none" />

          {/* Left Side: About Content */}
          <div className="p-8 md:p-12 lg:w-3/5 flex flex-col justify-center relative z-10 border-b lg:border-b-0 lg:border-r border-white/5">
            <p className="text-amber-500 font-black uppercase tracking-[0.35em] text-[10px] mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-amber-500/50" />
              About PlaceMate
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              Bridging the gap between <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">talent & opportunity.</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
              We combine AI-driven role matching, personalized learning paths, and interview-grade mock practice to help students and early-career professionals secure offers faster.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { label: "Company-specific Banks", icon: Target },
                { label: "Adaptive Learning", icon: Zap },
                { label: "Voice & Video Mocks", icon: Users },
                { label: "ATS Intelligence", icon: ShieldCheck },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs font-bold transition-colors hover:bg-white/10 hover:border-amber-500/30">
                  <item.icon size={14} className="text-amber-400" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Mission & Actions */}
          <div className="p-8 md:p-12 lg:w-2/5 flex flex-col relative z-10 bg-white/[0.01]">
            <h3 className="text-xl font-black text-white mb-4">Our Mission</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              To make placement preparation accessible, data-driven, and outcome-focused - so every candidate can compete with absolute confidence.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-auto">
              {[
                "Ethical AI",
                "Student-first",
                "Verified resources",
                "Mentor-backed",
              ].map((tag, i) => (
                <div key={i} className="px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-center text-xs font-bold text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                  {tag}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="/register" className="flex-1 text-center px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-colors">
                Join the Drive
              </a>
              <a href="#features" className="flex-1 text-center px-6 py-3.5 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all">
                See Features
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
