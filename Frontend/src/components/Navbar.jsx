import React from "react";
import { motion } from "framer-motion";
import { UserCircle, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 h-20 flex items-center shadow-2xl">
      <div className="w-full max-w-7xl mx-auto px-8 flex items-center justify-between h-full">
        {/* Extreme Logo Size as requested */}
        <div className="flex items-center h-full relative">
          <Link to="/">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={logo}
              alt="PlaceMate Logo"
              className="!h-32 w-auto max-w-none object-contain cursor-pointer absolute top-1/2 -translate-y-1/2 left-0 z-[60]"
            />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-12 text-[12px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <a
            href="#features"
            className="hover:text-amber-500 transition-colors border-b border-transparent hover:border-amber-500 pb-1"
          >
            Platform
          </a>
          <a
            href="#process"
            className="hover:text-amber-500 transition-colors border-b border-transparent hover:border-amber-500 pb-1"
          >
            Process
          </a>
          <Link
            to="/about"
            className="hover:text-amber-500 transition-colors border-b border-transparent hover:border-amber-500 pb-1"
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="px-10 py-4 bg-amber-500 text-black text-[12px] font-black uppercase tracking-[0.2em] rounded-full transition-all hover:bg-amber-400 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
              >
                Join the Drive
              </button>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <span className="hidden md:block text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">
                {user.displayName || user.email.split('@')[0]}
              </span>
              <div className="relative group">
                <UserCircle
                  className="text-amber-500 cursor-pointer hover:text-amber-400 transition-colors"
                  size={36}
                />
                <div className="absolute top-full right-0 mt-4 w-48 bg-[#0a0a0a] border border-white/5 p-2 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                   <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full text-left p-3 text-[10px] font-bold uppercase text-slate-400 hover:text-amber-500 transition-colors"
                   >
                     Dashboard
                   </button>
                   <button 
                    onClick={logout}
                    className="w-full text-left p-3 text-[10px] font-bold uppercase text-red-500 hover:text-red-400 transition-colors flex items-center justify-between"
                   >
                     Logout
                     <LogOut size={14} />
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
