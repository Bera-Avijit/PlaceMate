import React from "react";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6 lg:px-10 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-4">About PlaceMate</h2>
          <p className="text-slate-400 mb-6 max-w-xl">
            PlaceMate is built to bridge the gap between talent and opportunity. We combine
            AI-driven role matching, personalized learning paths, and interview-grade
            mock practice to help students and early-career professionals secure offers faster.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300 mb-6">
            <li className="bg-[#071013] p-3 rounded">Company-specific question banks</li>
            <li className="bg-[#071013] p-3 rounded">Adaptive learning paths</li>
            <li className="bg-[#071013] p-3 rounded">Voice & video mock interviews</li>
            <li className="bg-[#071013] p-3 rounded">Resume intelligence & ATS-ready tips</li>
          </ul>

          <div className="flex gap-4">
            <a href="/register" className="px-6 py-3 bg-amber-500 text-black font-bold rounded-full">Join the Drive</a>
            <a href="#features" className="px-6 py-3 border border-white/8 text-slate-300 rounded-full">See Features</a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#071217] to-[#040405] p-6 rounded-2xl border border-white/5">
          <h3 className="text-white font-bold mb-3">Our Mission</h3>
          <p className="text-slate-400 mb-4">To make placement preparation accessible, data-driven, and outcome-focused — so every candidate can compete with confidence.</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#061017] rounded">Ethical AI</div>
            <div className="p-3 bg-[#061017] rounded">Student-first</div>
            <div className="p-3 bg-[#061017] rounded">Verified resources</div>
            <div className="p-3 bg-[#061017] rounded">Mentor-backed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
