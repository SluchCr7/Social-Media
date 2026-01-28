
'use client';
import React, { useState } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
        setError('Invalid email or password');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[600px]"
      >
        {/* Left Side: Visual/Branding */}
        <div className="hidden md:flex flex-col items-center justify-center relative p-12 bg-gradient-to-br from-indigo-900/50 to-purple-900/50">
          <div className="absolute inset-0 bg-black/20" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 text-center"
          >
            <div className="w-32 h-32 relative mx-auto mb-8 drop-shadow-2xl">
              <Image src="/Logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Welcome Back</h2>
            <p className="text-indigo-200 text-lg max-w-sm mx-auto leading-relaxed">
              Step back into the future of community. Connect, share, and grow with us.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col justify-center p-10 md:p-14 bg-black/20">
          <div className="md:hidden text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
            <p className="text-gray-400">Welcome back to the community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link href="/Pages/Forgot" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <FiArrowRight />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-widest">Or Continue With</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-white font-medium group"
            >
              <FcGoogle className="text-xl group-hover:scale-110 transition-transform" />
              <span>Google Account</span>
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-400 text-sm mt-6">
              New here?{' '}
              <Link href="/Pages/Register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;