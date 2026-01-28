'use client';
import React, { useState } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import { FiEye, FiEyeOff, FiLock, FiArrowRight } from 'react-icons/fi';
import { useVerify } from '@/app/Context/VerifyContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Reset = ({ params }) => {
  const { id, token } = params;
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { ResetPassword } = useVerify();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (password) {
        ResetPassword(id, token, password);
      } else {
        setError('Please enter a valid password');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiLock className="text-indigo-400 text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Set New Password</h2>
          <p className="text-gray-400 text-sm">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">New Password</label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Reset Password <FiArrowRight />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/Pages/Login" className="text-gray-500 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Reset;
