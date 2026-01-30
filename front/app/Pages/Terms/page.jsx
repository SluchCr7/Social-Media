'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiScale, HiDocumentText, HiUserGroup, HiExclamationTriangle } from 'react-icons/hi2';

const TermsAndConditions = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: <HiScale className="w-6 h-6 text-indigo-500" />,
      content: "By accessing and using Sluchitt, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services."
    },
    {
      title: "User Conduct",
      icon: <HiUserGroup className="w-6 h-6 text-blue-500" />,
      content: "You agree that you will not misuse the services or help anyone else to do so. Generally, we expect you to act with respect and honesty. You are solely responsible for your interactions with other users."
    },
    {
      title: "Intellectual Property",
      icon: <HiDocumentText className="w-6 h-6 text-purple-500" />,
      content: "The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary (including but not limited to intellectual property) rights."
    },
    {
      title: "Termination",
      icon: <HiExclamationTriangle className="w-6 h-6 text-red-500" />,
      content: "We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
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
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Service</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our service.
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

export default TermsAndConditions;
