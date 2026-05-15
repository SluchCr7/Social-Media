'use client';
import React, { useState } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import { FiEye, FiEyeOff, FiMail, FiUser, FiLock, FiArrowRight, FiCheck, FiHexagon } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { registerNewUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      const { email, password, username } = formData;

      if (!agreeTerms) {
        setError(t('You must agree to the Terms and Conditions to register.'));
        return;
      }

      if (email && password && username) {
        registerNewUser(username, email, password);
      } else {
        setError(t('Please fill all required fields correctly.'));
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative font-sans selection:bg-indigo-500/30">
      {/* 🌌 Dynamic Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[30%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-bl from-indigo-600/10 to-transparent blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[30%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-violet-600/10 to-transparent blur-[100px]" 
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] min-h-[750px] flex mx-4 lg:mx-8 rounded-[2.5rem] bg-[#111111]/80 backdrop-blur-2xl border border-white/[0.05] shadow-2xl overflow-hidden shadow-black/50">
        
        {/* ✨ Left Side: Abstract Visuals */}
        <div className="hidden lg:flex w-[45%] relative items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a24] to-[#0d0d14] border-r border-white/[0.05]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-transparent to-transparent" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 p-12 text-left w-full"
          >
            <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FiHexagon className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              Join the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Future</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
              Create your account today and start your journey with thousands of others building the next generation community.
            </p>
          </motion.div>
        </div>

        {/* 🔐 Right Side: Form */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md mx-auto"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <FiHexagon className="text-white text-2xl" />
              </div>
            </div>

            <div className="mb-10 lg:text-left text-center">
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">{t('Create Account')}</h2>
              <p className="text-gray-400 text-sm">{t('Join us securely')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-4">
                {/* Username */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder={t('Username')}
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-[#1a1a1a] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 outline-none focus:bg-[#202020] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('Email address')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-[#1a1a1a] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 outline-none focus:bg-[#202020] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder={t('Password')}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-12 py-3.5 bg-[#1a1a1a] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 outline-none focus:bg-[#202020] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 mt-4 group cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
                <div className={`w-5 h-5 rounded border flex flex-shrink-0 items-center justify-center transition-all mt-0.5 ${agreeTerms ? 'bg-indigo-500 border-indigo-500' : 'bg-[#1a1a1a] border-white/[0.1] group-hover:border-indigo-500/50'}`}>
                  {agreeTerms && <FiCheck className="text-white text-xs" />}
                </div>
                <p className="text-sm text-gray-400 leading-snug select-none group-hover:text-gray-300 transition-colors">
                  {t('I agree to the')}{' '}
                  <Link href="/Pages/Terms" className="text-indigo-400 hover:text-indigo-300 transition-colors underline decoration-indigo-400/30 hover:decoration-indigo-300">
                    {t('Terms and Conditions')}
                  </Link>
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium mt-2">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-white text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>{t('Create Account')} <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-white/[0.05]" />
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-widest">{t('OR')}</span>
                <div className="flex-grow border-t border-white/[0.05]" />
              </div>
              
              <button className="mt-6 w-full py-3 bg-[#1a1a1a] border border-white/[0.05] hover:bg-[#202020] hover:border-white/[0.1] rounded-xl flex items-center justify-center gap-3 transition-all text-sm text-gray-300 font-medium">
                <FcGoogle size={20} />
                {t('Sign up with Google')}
              </button>
            </div>

            <p className="mt-8 text-center text-gray-500 text-sm">
              {t('Already have an account?')}{' '}
              <Link href="/Pages/Login" className="text-white font-medium hover:text-indigo-300 transition-colors">
                {t('Sign In')}
              </Link>
            </p>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
