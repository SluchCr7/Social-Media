'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiQuestionMarkCircle, HiChatBubbleLeftRight, HiEnvelope, HiChevronDown } from 'react-icons/hi2';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0A0A0A]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-bold text-gray-900 dark:text-white">{question}</span>
                <HiChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SupportPage = () => {
    const faqs = [
        {
            question: "How do I reset my password?",
            answer: "You can reset your password by going to the login page and clicking on 'Forgot Password'. Follow the instructions sent to your email."
        },
        {
            question: "How can I change my username?",
            answer: "Go to your profile settings, click on 'Edit Profile', and you will be able to update your username there."
        },
        {
            question: "Is Sluchitt free to use?",
            answer: "Yes! Sluchitt is free to join and use. We may offer premium features in the future, but the core experience will always be free."
        },
        {
            question: "How do I report a user or post?",
            answer: "Click the three dots icon on any post or profile and select 'Report'. Our team will review it shortly."
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
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 mb-6">
                        <HiChatBubbleLeftRight className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                        How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">help?</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Everything you need to know about using Sluchitt. Can't find the answer you're looking for? Contact our support team.
                    </p>
                </motion.div>

                {/* Search Box could go here */}

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} {...faq} />
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 rounded-3xl bg-indigo-600 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <HiEnvelope className="w-10 h-10 mb-4 opacity-80" />
                                <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                                <p className="text-indigo-100 mb-6">Our support team is just a message away.</p>
                                <button className="w-full py-3 px-6 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                    Contact Support
                                </button>
                            </div>
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full blur-xl transform -translate-x-10 translate-y-10"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
