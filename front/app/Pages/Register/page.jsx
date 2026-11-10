'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/redux/hooks';
import { FiArrowRight, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';
import AuthShell from '@/app/Component/Auth/AuthShell';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { registerNewUser } = useAuth();

  const handleChange = (event) => {
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError(t('You must agree to the Terms and Conditions to register.'));
      return;
    }

    const { email, password, username } = formData;
    if (!email.trim() || !password || !username.trim()) {
      setError(t('Please fill all required fields correctly.'));
      return;
    }

    setLoading(true);
    try {
      await registerNewUser(username.trim(), email.trim(), password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Get started"
      title={t('Create Account')}
      description="Set up your profile and find your people."
      storyTitle={<>Your next<br />chapter starts <span className="text-indigo-300">here.</span></>}
      storyDescription="Make a little room for new ideas, familiar faces, and the things you love to share."
      footer={
        <p className="mt-7 text-center text-sm text-slate-500">
          {t('Already have an account?')}{' '}
          <Link href="/Pages/Login" className="font-semibold text-indigo-700 transition hover:text-indigo-500">
            {t('Sign In')}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="register-username" className="mb-2 block text-sm font-medium text-slate-700">
            {t('Username')}
          </label>
          <div className="relative">
            <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              id="register-username"
              type="text"
              name="username"
              autoComplete="username"
              placeholder={t('Choose a username')}
              value={formData.username}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-slate-700">
            {t('Email address')}
          </label>
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              id="register-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-slate-700">
            {t('Password')}
          </label>
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              placeholder={t('Create a password')}
              value={formData.password}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 pt-1 text-sm leading-5 text-slate-600">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(event) => setAgreeTerms(event.target.checked)}
            className="peer sr-only"
          />
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${agreeTerms ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-transparent peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-500/20'}`}>
            <FiCheck size={13} strokeWidth={3} />
          </span>
          <span>
            {t('I agree to the')}{' '}
            <Link
              href="/Pages/Terms"
              onClick={(event) => event.stopPropagation()}
              className="font-medium text-indigo-700 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-500"
            >
              {t('Terms and Conditions')}
            </Link>
          </span>
        </label>

        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              {t('Creating account...')}
            </>
          ) : (
            <>
              {t('Create Account')}
              <FiArrowRight className="transition-transform group-hover:translate-x-1" size={17} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <FiLock size={13} />
        <span>{t('Your information stays private and secure')}</span>
      </div>
    </AuthShell>
  );
};

export default Register;
