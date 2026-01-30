'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiShieldCheck, HiLockClosed, HiEye, HiServer } from 'react-icons/hi2';

const PrivacyPolicy = () => {
    const sections = [
        {
            title: "Data We Collect",
            icon: <HiEye className="w-6 h-6 text-indigo-500" />,
            content: "We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, profile information, and any other information you choose to provide."
        },
        {
            title: "How We Use Your Data",
            icon: <HiServer className="w-6 h-6 text-pink-500" />,
            content: "We use the information we collect to provide, maintain, and improve our services, to develop new features, and to protect Sluchitt and our users. We also use the information to personalize your experience and to send you updates and administrative messages."
        },
        {
            title: "Data Security",
            icon: <HiLockClosed className="w-6 h-6 text-cyan-500" />,
            content: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. Your password is encrypted and we use secure socket layer technology (SSL)."
        },
        {
            title: "Your Choices",
            icon: <HiShieldCheck className="w-6 h-6 text-emerald-500" />,
            content: "You may update, correct or delete information about you at any time by logging into your online account or by contacting us. If you wish to delete or deactivate your account, please contact our support team."
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] pt-24 pb-12 px-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                        Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Policy</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Your privacy is critically important to us. At Sluchitt, we have a few fundamental principles regarding your data.
                    </p>
                </motion.div>

                <div className="grid gap-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative p-8 rounded-3xl bg-gray-50 dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
                        >
                            <div className="flex items-start gap-6">
                                <div className="p-3 rounded-2xl bg-white dark:bg-white/5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    {section.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-center border-t border-gray-200 dark:border-white/10 pt-8"
                >
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
