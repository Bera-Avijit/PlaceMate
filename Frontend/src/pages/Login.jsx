import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getGoogleAuthErrorMessage = (err) => {
  const code = err?.code || '';

  if (code === 'auth/unauthorized-domain') {
    return 'This domain is not authorized in Firebase. Add your Vercel domain in Firebase Auth > Settings > Authorized domains.';
  }

  if (code === 'auth/operation-not-allowed') {
    return 'Google provider is disabled in Firebase Authentication. Enable Google sign-in method.';
  }

  if (code === 'auth/popup-closed-by-user') {
    return 'Google popup was closed before completing sign-in.';
  }

  if (code === 'auth/popup-blocked') {
    return 'Popup was blocked by the browser. Allow popups for this site and try again.';
  }

  if (code === 'auth/invalid-api-key') {
    return 'Firebase API key is invalid. Verify VITE_FIREBASE_API_KEY in Vercel environment variables.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Network error during Google sign-in. Check internet connection and CORS/domain settings.';
  }

  return err?.message || 'Google Sign-in failed.';
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      const userCredential = await loginWithGoogle();
      if (userCredential) {
        window.location.replace('/');
      }
    } catch (err) {
      console.error("Google Sign-in Error:", err);
      setError(getGoogleAuthErrorMessage(err));
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-amber-500/5 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem] shadow-2xl relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-amber-500 transition-colors mb-6 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Return to Explore
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white tracking-widest leading-tight">WELCOME</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="email" required
                className="w-full bg-black border border-white/10 rounded-xl py-4 pl-11 pr-4 text-sm text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-800"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="password" required
                className="w-full bg-black border border-white/10 rounded-xl py-4 pl-11 pr-4 text-sm text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 text-[11px]"
          >
            {loading ? 'Authenticating' : 'Sign In Now'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center text-white/5"><div className="w-full border-t border-current"></div></div>
          <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-widest">
            <span className="bg-[#0a0a0a] px-3 text-slate-600">OR CONTINUE WITH</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] text-xs"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Google Account
        </button>

        <p className="mt-8 text-center text-[10px] text-slate-500 font-medium">
          New here? <Link to="/register" className="text-amber-500 font-black hover:underline uppercase tracking-widest ml-1">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
