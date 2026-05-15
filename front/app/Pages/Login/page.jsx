'use client';
import React, { useState } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight, FiHexagon } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (formData.email && formData.password) {
        login(formData.email, formData.password);
      } else {
        setError('Please provide valid credentials.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative font-sans selection:bg-indigo-500/30">
      {/* 🌌 Dynamic Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[30%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-indigo-600/10 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[30%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-violet-600/10 to-transparent blur-[100px]"
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] min-h-[700px] flex mx-4 lg:mx-8 rounded-[2.5rem] bg-[#111111]/80 backdrop-blur-2xl border border-white/[0.05] shadow-2xl overflow-hidden shadow-black/50">

        {/* ✨ Left Side: Abstract Visuals (Hidden on small screens) */}
        <div className="hidden lg:flex w-[45%] relative items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a24] to-[#0d0d14] border-r border-white/[0.05]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
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
              Enter the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Ecosystem</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
              Connect securely, manage your digital footprint, and explore a world built for creators and visionaries.
            </p>
          </motion.div>
        </div>

        {/* 🔐 Right Side: Form */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">

          <motion.div
            initial={{ opacity: 0, x: 20 }}
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
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Welcome back</h2>
              <p className="text-gray-400 text-sm">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Custom Input Group */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-[#1a1a1a] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 outline-none focus:bg-[#202020] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
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

              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-white/[0.1] bg-[#1a1a1a] group-hover:border-indigo-500/50 flex items-center justify-center transition-colors">
                    {/* Fake Checkbox logic if needed */}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                <Link href="/Pages/Forgot" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
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
                className="w-full py-3.5 bg-white text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>Sign In <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-white/[0.05]" />
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">or continue with</span>
                <div className="flex-grow border-t border-white/[0.05]" />
              </div>

              <button className="mt-6 w-full py-3 bg-[#1a1a1a] border border-white/[0.05] hover:bg-[#202020] hover:border-white/[0.1] rounded-xl flex items-center justify-center gap-3 transition-all text-sm text-gray-300 font-medium">
                <FcGoogle size={20} />
                Google
              </button>
            </div>

            <p className="mt-8 text-center text-gray-500 text-sm">
              Do not have an account?{' '}
              <Link href="/Pages/Register" className="text-white font-medium hover:text-indigo-300 transition-colors">
                Sign up
              </Link>
            </p>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;