'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiChatBubbleLeftRight,
    HiEnvelope,
    HiChevronDown,
    HiGlobeAlt,
    HiPhone,
    HiMapPin,
    HiSparkles,
    HiArrowTopRightOnSquare
} from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import InfoHero from '@/app/Component/Management/InfoHero';

const SupportPage = () => {
    const { t } = useTranslation();
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    const contactMethods = [
        {
            title: t('Direct Mail'),
            desc: t('Official correspondence'),
            info: 'support@sluchitt.net',
            icon: <HiEnvelope className="w-6 h-6" />,
            color: 'text-blue-500'
        },
        {
            title: t('Global Pulse'),
            desc: t('Live network status'),
            info: 'status.sluchitt.net',
            icon: <HiGlobeAlt className="w-6 h-6" />,
            color: 'text-indigo-500'
        },
        {
            title: t('Emergency Uplink'),
            desc: t('High priority only'),
            info: '+1 (800) SLUCHIT',
            icon: <HiPhone className="w-6 h-6" />,
            color: 'text-purple-500'
        }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]">
            <InfoHero
                title={t('Support Center')}
                subtitle={t('Connect with our resonance team for technical assistance or network inquiries.')}
                icon={HiChatBubbleLeftRight}
                gradient="from-indigo-600 to-cyan-500"
            />

            <div className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Contact Methods */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                                <HiSparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white">
                                {t('Uplinks')}
                            </h3>
                        </div>

                        {contactMethods.map((method, i) => (
                            <motion.div
                                key={method.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-indigo-500/20 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center ${method.color} shadow-inner`}>
                                        {method.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-gray-900 dark:text-white">{method.title}</h4>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{method.desc}</p>
                                    </div>
                                </div>
                                <div className="mt-4 text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-indigo-500 transition-colors">
                                    {method.info}
                                </div>
                            </motion.div>
                        ))}

                        {/* Social Links placeholder */}
                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-500/20 overflow-hidden relative">
                            <div className="relative z-10">
                                <h4 className="text-xl font-black uppercase tracking-widest mb-2">{t('Real-time updates')}</h4>
                                <p className="text-sm opacity-80 mb-6 font-medium">{t('Follow our official channels for peak hour updates.')}</p>
                                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all">
                                    <HiArrowTopRightOnSquare className="w-4 h-4" />
                                    {t('Follow Sluchitt')}
                                </button>
                            </div>
                            <HiGlobeAlt className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 animate-spin-slow" />
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-[#080808] border border-gray-100 dark:border-white/5 rounded-[3.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden"
                        >
                            {/* Success Overlay */}
                            <AnimatePresence>
                                {sent && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 z-20 bg-white/90 dark:bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20"
                                        >
                                            <HiSparkles className="w-12 h-12" />
                                        </motion.div>
                                        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase mb-4">{t('Signal Transmitted')}</h3>
                                        <p className="text-gray-500 font-medium max-w-sm mb-12">{t('We have received your uplink request. A resonance specialist will prioritize your case shortly.')}</p>
                                        <button
                                            onClick={() => setSent(false)}
                                            className="px-12 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all"
                                        >
                                            {t('New Transmission')}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-2">
                                        {t('Send a Signal')}
                                    </h3>
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                        {t('Initialize a direct support protocol')}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">{t('Origin Name')}</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 outline-none px-6 text-sm font-bold focus:border-indigo-500/50 transition-all dark:text-white"
                                                placeholder="Node-401..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">{t('Contact Email')}</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 outline-none px-6 text-sm font-bold focus:border-indigo-500/50 transition-all dark:text-white"
                                                placeholder="pulse@network.net"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">{t('Subject Protocol')}</label>
                                        <select className="w-full h-16 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 outline-none px-6 text-sm font-bold focus:border-indigo-500/50 transition-all dark:text-white appearance-none">
                                            <option>{t('Account Access')}</option>
                                            <option>{t('Billing Inquiry')}</option>
                                            <option>{t('Report Misconduct')}</option>
                                            <option>{t('Commercial Partnerships')}</option>
                                            <option>{t('Technical Glitch')}</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">{t('Core Message')}</label>
                                        <textarea
                                            required
                                            rows={6}
                                            className="w-full rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 outline-none p-8 text-sm font-bold focus:border-indigo-500/50 transition-all dark:text-white resize-none"
                                            placeholder={t('Describe the system abnormality or inquiry details...')}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-20 rounded-[2rem] bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-indigo-500/50 border-t-indigo-500 rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <HiEnvelope className="w-5 h-5" />
                                                {t('Broadcast Transmission')}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
