'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, ShieldCheck, Settings } from 'lucide-react';

const CookiesPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200/40 dark:border-gray-700/40 transition">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <Cookie className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-gray-50">
            Cookies Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We use cookies to enhance your experience, analyze site traffic, and serve personalized content.
          </p>
        </motion.div>

        {/* Sections */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed"
        >
          {/* What are Cookies */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
              What are Cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help us
              recognize your device, remember preferences, and provide a personalized experience.
            </p>
          </div>

          {/* How We Use Cookies */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
              How We Use Cookies
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To remember your login details and preferences.</li>
              <li>To improve website performance and usability.</li>
              <li>To analyze traffic and understand user behavior.</li>
              <li>To deliver personalized content and ads.</li>
            </ul>
          </div>

          {/* Types of Cookies */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
              Types of Cookies We Use
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Essential Cookies:</strong> Required for core functionality.</li>
              <li><strong>Performance Cookies:</strong> Analyze performance and usability.</li>
              <li><strong>Functional Cookies:</strong> Remember user preferences.</li>
              <li><strong>Advertising Cookies:</strong> Serve relevant ads.</li>
            </ul>
          </div>

          {/* Your Choices */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
              Your Choices
            </h2>
            <p>
              You can accept or decline cookies. Most browsers automatically accept cookies,
              but you can modify settings to decline them if you prefer.
            </p>
            <p className="mt-2">
              Please note some website features may not function properly if you disable cookies.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
              Contact Us
            </h2>
            <p>
              For any questions, contact us at{' '}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 dark:text-blue-400 underline hover:opacity-80"
              >
                support@example.com
              </a>.
            </p>
          </div>
        </motion.section>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col md:flex-row gap-4"
        >
          <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md">
            <ShieldCheck className="w-5 h-5" /> Accept All Cookies
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 px-6 py-3 rounded-xl font-semibold transition shadow-md">
            <Settings className="w-5 h-5" /> Manage Preferences
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Zocial. All rights reserved.
      </footer>
    </div>
  );
};

export default CookiesPolicyPage;
