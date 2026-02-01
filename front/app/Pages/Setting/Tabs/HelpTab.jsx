'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { HiQuestionMarkCircle, HiChatBubbleLeftRight, HiShieldExclamation, HiDocumentText, HiLifebuoy, HiChevronRight } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

const HelpTab = React.memo(() => {
    const { t } = useTranslation();

    const helpLinks = [
        {
            id: 'support',
            title: t('Help Center'),
            desc: t('Get help with using our features and tools.'),
            icon: HiLifebuoy,
            color: 'bg-blue-500',
        },
        {
            id: 'report',
            title: t('Report a Problem'),
            desc: t('Something not working? Let us know.'),
            icon: HiChatBubbleLeftRight,
            color: 'bg-amber-500',
        },
        {
            id: 'safety',
            title: t('Safety Center'),
            desc: t('Learn how we keep our community safe.'),
            icon: HiShieldExclamation,
            color: 'bg-green-500',
        },
        {
            id: 'terms',
            title: t('Legal & Terms'),
            desc: t('Review our Terms of Service and Privacy Policy.'),
            icon: HiDocumentText,
            color: 'bg-purple-500',
        },
    ];

    return (
        <motion.div
            key="help"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl mx-auto p-6 space-y-8"
        >
            <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <HiLifebuoy className="text-indigo-500" />
                    {t('Support & Help')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('Need assistance? Find answers and connect with support.')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpLinks.map((link) => (
                    <motion.button
                        key={link.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 shadow-sm text-left group transition-all hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                    >
                        <div className={`p-3 rounded-xl ${link.color} text-white shadow-lg`}>
                            <link.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-indigo-500 transition-colors">
                                {link.title}
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {link.desc}
                            </p>
                        </div>
                        <HiChevronRight className="text-gray-300 group-hover:text-indigo-500 mt-1 transition-colors" />
                    </motion.button>
                ))}
            </div>

            {/* FAQ Quick Links or Version Info */}
            <section className="mt-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <HiLifebuoy className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{t('Quick Assistance')}</h3>
                    <p className="text-sm opacity-80 mb-6 max-w-sm">
                        {t('Check out our most frequently asked questions for instant answers.')}
                    </p>
                    <button className="px-6 py-2 bg-white text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl">
                        {t('Browse FAQ')}
                    </button>
                </div>
            </section>

            <div className="text-center pt-8">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    Threads V2 • Version 2.4.0 (Stable)
                </p>
            </div>
        </motion.div>
    );
});

HelpTab.displayName = 'HelpTab';
export default HelpTab;
