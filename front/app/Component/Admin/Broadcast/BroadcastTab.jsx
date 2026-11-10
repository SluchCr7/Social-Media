'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiMegaphone,
  HiBolt,
  HiTrash,
  HiClock,
  HiShieldCheck,
  HiSparkles,
  HiInformationCircle,
  HiCheckCircle,
  HiExclamationCircle,
} from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { useAdmin } from '@/app/redux/hooks/useAdmin';

const BroadcastTab = () => {
  const { t } = useTranslation();
  const { broadcastAnnouncement, runSystemCleanup } = useAdmin();

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal'); // 'normal' | 'important' | 'critical'
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Maintenance Job State
  const [activeJob, setActiveJob] = useState(null);
  const [jobResults, setJobResults] = useState({});

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsBroadcasting(true);
    setBroadcastSuccess(false);
    try {
      await broadcastAnnouncement(title.trim(), content.trim());
      setBroadcastSuccess(true);
      setTitle('');
      setContent('');
      setPriority('normal');
      setTimeout(() => setBroadcastSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleRunJob = async (jobType, jobKey) => {
    setActiveJob(jobKey);
    try {
      const res = await runSystemCleanup(jobType);
      setJobResults((prev) => ({
        ...prev,
        [jobKey]: {
          success: true,
          message: res?.message || 'Job executed successfully',
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
    } catch (err) {
      setJobResults((prev) => ({
        ...prev,
        [jobKey]: {
          success: false,
          message: err?.data?.message || 'Job execution failed',
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
    } finally {
      setActiveJob(null);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 md:p-10 space-y-10">
      {/* 🚀 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
            {t('Broadcast')} <span className="text-indigo-500">&amp; {t('Jobs')}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t('Push live announcements to all active users & trigger automated maintenance tasks')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 📢 Broadcast Form & Preview */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <HiMegaphone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                  {t('Live Announcement')}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('Instant push notification via Socket.IO')}
                </p>
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  {t('Announcement Title')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('e.g., Scheduled Maintenance in 30 minutes')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  {t('Message Body')}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={t('Type the announcement message details here...')}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  {t('Priority Level')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'normal', label: 'Normal', color: 'indigo' },
                    { key: 'important', label: 'Important', color: 'amber' },
                    { key: 'critical', label: 'Critical', color: 'rose' },
                  ].map((lvl) => (
                    <button
                      key={lvl.key}
                      type="button"
                      onClick={() => setPriority(lvl.key)}
                      className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                        priority === lvl.key
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                          : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {broadcastSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                  >
                    <HiCheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{t('Announcement has been dispatched to all active users!')}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isBroadcasting || !title.trim() || !content.trim()}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3"
              >
                <HiMegaphone className={`w-5 h-5 ${isBroadcasting ? 'animate-bounce' : ''}`} />
                {isBroadcasting ? t('Broadcasting...') : t('Broadcast to Network')}
              </button>
            </form>
          </motion.div>

          {/* Live Preview Card */}
          <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <HiSparkles className="w-4 h-4 text-indigo-500" />
              {t('Broadcast Preview')}
            </span>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-900 dark:text-white">
                  {title.trim() || t('Announcement Title Preview')}
                </span>
                <span
                  className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                    priority === 'critical'
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      : priority === 'important'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                  }`}
                >
                  {priority}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {content.trim() || t('Your broadcast message preview will appear here in real-time as you type.')}
              </p>
            </div>
          </div>
        </div>

        {/* 🛠️ System Maintenance Jobs */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <HiBolt className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                  {t('Maintenance Operations')}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('Trigger background cleanup & database optimization jobs')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Job 1: Prune Stale Tokens */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                      <HiShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 dark:text-white">
                        {t('Prune Stale Sessions')}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('Remove inactive & revoked refresh tokens across all users')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRunJob('tokens', 'job_tokens')}
                    disabled={activeJob === 'job_tokens'}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-blue-500/20 flex-shrink-0 flex items-center gap-2"
                  >
                    <HiBolt className={`w-3.5 h-3.5 ${activeJob === 'job_tokens' ? 'animate-spin' : ''}`} />
                    {activeJob === 'job_tokens' ? t('Running...') : t('Execute')}
                  </button>
                </div>
                {jobResults.job_tokens && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                      jobResults.job_tokens.success
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}
                  >
                    {jobResults.job_tokens.success ? (
                      <HiCheckCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{jobResults.job_tokens.message}</span>
                    <span className="ml-auto text-[10px] opacity-70">
                      {jobResults.job_tokens.timestamp}
                    </span>
                  </div>
                )}
              </div>

              {/* Job 2: Archive Expired Stories */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                      <HiClock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 dark:text-white">
                        {t('Archive Expired Stories')}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('Clean up 24h stories that have passed their expiration threshold')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRunJob('stories', 'job_stories')}
                    disabled={activeJob === 'job_stories'}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-purple-500/20 flex-shrink-0 flex items-center gap-2"
                  >
                    <HiBolt className={`w-3.5 h-3.5 ${activeJob === 'job_stories' ? 'animate-spin' : ''}`} />
                    {activeJob === 'job_stories' ? t('Running...') : t('Execute')}
                  </button>
                </div>
                {jobResults.job_stories && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                      jobResults.job_stories.success
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}
                  >
                    {jobResults.job_stories.success ? (
                      <HiCheckCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{jobResults.job_stories.message}</span>
                    <span className="ml-auto text-[10px] opacity-70">
                      {jobResults.job_stories.timestamp}
                    </span>
                  </div>
                )}
              </div>

              {/* Job 3: Prune Audit Logs & Cache */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
                      <HiTrash className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 dark:text-white">
                        {t('Prune Old Audit Records')}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('Purge non-critical system and telemetry logs older than 90 days')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRunJob('logs', 'job_logs')}
                    disabled={activeJob === 'job_logs'}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-rose-500/20 flex-shrink-0 flex items-center gap-2"
                  >
                    <HiBolt className={`w-3.5 h-3.5 ${activeJob === 'job_logs' ? 'animate-spin' : ''}`} />
                    {activeJob === 'job_logs' ? t('Running...') : t('Execute')}
                  </button>
                </div>
                {jobResults.job_logs && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                      jobResults.job_logs.success
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}
                  >
                    {jobResults.job_logs.success ? (
                      <HiCheckCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{jobResults.job_logs.message}</span>
                    <span className="ml-auto text-[10px] opacity-70">
                      {jobResults.job_logs.timestamp}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Security note */}
            <div className="mt-8 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-3 text-indigo-500 text-xs font-semibold">
              <HiInformationCircle className="w-5 h-5 flex-shrink-0" />
              <span>
                {t('All maintenance jobs are executed synchronously in safe transactions and recorded into the immutable audit trail.')}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastTab;
