'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiHeart, HiNoSymbol, HiChatBubbleLeftRight, HiShieldCheck } from 'react-icons/hi2';

const CommunityGuidelines = () => {
    const rules = [
        {
            title: "Be Kind and Respectful",
            icon: <HiHeart className="w-6 h-6 text-pink-500" />,
            content: "We're all in this together to create a welcoming environment. Let's treat everyone with respect. Healthy debates are natural, but kindness is required."
        },
        {
            title: "No Hate Speech or Bullying",
            icon: <HiNoSymbol className="w-6 h-6 text-red-500" />,
            content: "Make sure everyone feels safe. Bullying of any kind isn't allowed, and degrading comments about things like race, religion, culture, sexual orientation, gender or identity will not be tolerated."
        },
        {
            title: "Respect Privacy",
            icon: <HiShieldCheck className="w-6 h-6 text-emerald-500" />,
            content: "Being part of this group requires mutual trust. Authentic, expressive discussions make groups great, but may also be sensitive and private. What's shared in the group should stay in the group."
        },
        {
            title: "Be Constructive",
            icon: <HiChatBubbleLeftRight className="w-6 h-6 text-blue-500" />,
            content: "Feedback is welcome if it's constructive. If you have a problem with something, explain why and offer a solution. Don't just complain."
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
                        Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Guidelines</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        We want Sluchitt to be a place where people can come together to discuss their interests and passions. To help everyone do that, we have a few rules.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rules.map((rule, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative p-8 rounded-3xl bg-gray-50 dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 hover:border-pink-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 flex flex-col items-center text-center"
                        >
                            <div className="p-4 rounded-2xl bg-white dark:bg-white/5 shadow-sm group-hover:scale-110 transition-transform duration-300 mb-6">
                                {rule.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {rule.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {rule.content}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunityGuidelines;
