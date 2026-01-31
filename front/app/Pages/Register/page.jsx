'use client';
import React, { useState } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import { FiEye, FiEyeOff, FiMail, FiUser, FiLock, FiArrowRight, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gray-50 dark:bg-[#050505] overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 bg-white dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[650px]"
      >
        {/* Left Side: Visual/Branding */}
        <div className="hidden md:flex flex-col items-center justify-center relative p-12 bg-gradient-to-br from-blue-900/50 to-indigo-900/50">
          <div className="absolute inset-0 bg-black/20" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 text-center"
          >
            <div className="w-64 h-64 relative mx-auto mb-8">
              <Image
                src="/register2.svg"
                alt="Register"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">{t('Join the Future')}</h2>
            <p className="text-blue-200 text-lg max-w-sm mx-auto leading-relaxed">
              {t('Create your account today and start your journey with thousands of others.')}
            </p>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col justify-center p-10 md:p-14 bg-white dark:bg-black/20 overflow-y-auto custom-scrollbar">
          <div className="md:hidden text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('Create Account')}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t('Join us securely')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto w-full">

            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{t('Username')}</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" size={20} />
                <input
                  type="text"
                  name="username"
                  placeholder={t('John Doe')}
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{t('Email Address')}</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder={t('you@example.com')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{t('Password')}</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={t('••••••••')}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-500/50 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 mt-2 group cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
              <div className={`w-5 h-5 rounded border border-gray-300 dark:border-white/20 flex items-center justify-center transition-all mt-0.5 ${agreeTerms ? 'bg-blue-500 border-blue-500' : 'bg-transparent'}`}>
                {agreeTerms && <FiCheck className="text-white text-xs" />}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
                {t('I agree to the')}{' '}
                <Link href="/Pages/Terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors underline decoration-blue-500/30 dark:decoration-blue-400/30 hover:decoration-blue-500 dark:hover:decoration-blue-300">
                  {t('Terms and Conditions')}
                </Link>
              </p>
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
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t('Create Account')} <FiArrowRight />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-xs uppercase tracking-widest">{t('OR')}</span>
              <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
            </div>

            {/* Social Register */}
            <button
              type="button"
              className="w-full py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-gray-700 dark:text-white font-medium group"
            >
              <FcGoogle className="text-xl group-hover:scale-110 transition-transform" />
              <span>{t('Sign up with Google')}</span>
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
              {t('Already have an account?')}{' '}
              <Link href="/Pages/Login" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-bold transition-colors">
                {t('Login')}
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
