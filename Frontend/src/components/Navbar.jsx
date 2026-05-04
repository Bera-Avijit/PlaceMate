import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCircle, LogOut, Zap, Menu, X, LayoutDashboard, CreditCard } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import DailyPrepSection from "./sections/DailyPrepSection";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showDailyPrep, setShowDailyPrep] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const dailyPrepRef = useRef(null);

  const goToRoute = (path) => {
    setOpen(false);
    setShowDailyPrep(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
      if (dailyPrepRef.current && !dailyPrepRef.current.contains(e.target)) {
        setShowDailyPrep(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setShowDailyPrep(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/[0.04] h-20 flex items-center shadow-2xl">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-full">
        {/* Logo & Company Name */}
        <Link to="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative">
              <img
                src={logo}
                alt="PlaceMate"
                className="h-12 w-12 object-contain rounded-lg group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 rounded-lg bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors" />
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-none tracking-tight">
                Place
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-500 leading-none tracking-tight">
                Mate
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold">
          <a
            href="/"
            onClick={(e) => {
              // If already on home, just scroll to top smoothly.
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                // Not on home - navigate programmatically to avoid full reload
                e.preventDefault();
                navigate("/");
              }
            }}
            className="text-slate-300 hover:text-amber-500 transition-colors border-b-2 border-transparent hover:border-amber-500 pb-1"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-slate-300 hover:text-amber-500 transition-colors border-b-2 border-transparent hover:border-amber-500 pb-1"
          >
            Features
          </a>
          <a
            href="#about"
            className="text-slate-300 hover:text-amber-500 transition-colors border-b-2 border-transparent hover:border-amber-500 pb-1"
          >
            About
          </a>
          <button
            type="button"
            onClick={() => goToRoute('/mock-interview')}
            className="text-slate-300 hover:text-amber-500 transition-colors border-b-2 border-transparent hover:border-amber-500 pb-1"
          >
            Mock Interview
          </button>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden lg:flex items-center gap-4 sm:gap-6">
            {!user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToRoute('/login')}
                  className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToRoute('/register')}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm uppercase tracking-wider rounded-full transition-all shadow-lg"
                >
                  Get Started
                </motion.button>
              </>
            ) : (
              <div className="flex items-center gap-4 sm:gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToRoute('/resume-parsing')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-semibold text-xs uppercase rounded-lg transition-all"
                >
                  📄 Resume
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToRoute('/mock-interview')}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-amber-300 font-semibold text-xs uppercase rounded-lg transition-all border border-amber-500/20"
                >
                  Mock Interview
                </motion.button>
                
                <div ref={dailyPrepRef} className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDailyPrep(!showDailyPrep)}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-amber-300 font-semibold text-xs uppercase rounded-lg transition-all border border-amber-500/20"
                  >
                    <Zap size={14} />
                    Daily Prep
                  </motion.button>
                  {showDailyPrep && user && <DailyPrepSection user={user} />}
                </div>

                <span className="hidden md:block text-xs font-bold text-amber-500 uppercase tracking-widest">
                  {user.displayName || user.email.split('@')[0]}
                </span>
                <div
                  ref={menuRef}
                  className="relative"
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer"
                    onClick={() => setOpen((v) => !v)}
                  >
                    <UserCircle className="text-amber-500 hover:text-amber-300 transition-colors" size={32} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.14 }}
                    className="absolute top-full right-0 mt-3 w-52 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl transform-origin-top-right"
                    style={{ pointerEvents: open ? "auto" : "none" }}
                  >
                    <button
                      onClick={() => {
                        goToRoute('/dashboard');
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all rounded-t-2xl"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        goToRoute('/pricing');
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all border-t border-white/5"
                    >
                      Pricing & Plans
                    </button>
                    <button
                      onClick={() => {
                        setOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-semibold text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-between border-t border-white/5 rounded-b-2xl"
                    >
                      Logout
                      <LogOut size={14} />
                    </button>
                  </motion.div>
                </div>
              </div>
            )}
          </div>

          <div ref={mobileMenuRef} className="lg:hidden relative">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 bg-white/[0.04] text-white hover:border-amber-500/30 hover:text-amber-400 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={mobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 top-full mt-3 w-[min(92vw,22rem)] rounded-3xl border border-white/10 bg-[#0d0d0d] shadow-2xl overflow-hidden"
              style={{ pointerEvents: mobileMenuOpen ? 'auto' : 'none' }}
            >
              <div className="p-4 border-b border-white/5">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Menu</div>
                <div className="text-sm font-bold text-white">{user ? (user.displayName || user.email.split('@')[0]) : 'Guest'}</div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (window.location.pathname === '/') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      navigate('/');
                    }
                  }}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (window.location.pathname !== '/') {
                      navigate('/');
                      setTimeout(() => {
                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    } else {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (window.location.pathname !== '/') {
                      navigate('/');
                      setTimeout(() => {
                        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    } else {
                      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all"
                >
                  About
                </button>

                <div className="my-2 h-px bg-white/5" />

                {!user ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/register');
                      }}
                      className="w-full px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest text-black bg-amber-500 hover:bg-amber-400 transition-all"
                    >
                      Get Started
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => goToRoute('/mock-interview')}
                      className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all"
                    >
                      Mock Interview
                    </button>
                    <button
                      onClick={() => {
                        goToRoute('/resume-parsing');
                      }}
                      className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-all flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} /> Resume Parsing
                    </button>
                    <button
                      onClick={() => {
                        goToRoute('/dashboard');
                      }}
                      className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        goToRoute('/pricing');
                      }}
                      className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                      <CreditCard size={16} /> Pricing & Plans
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all flex items-center justify-between"
                    >
                      Logout
                      <LogOut size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
