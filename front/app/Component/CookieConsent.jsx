'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { FaCookieBite } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

const CONSENT_NAME = 'cookie_consent_status';

const loadAnalyticsScripts = (status) => {
    if (status === 'accepted') {
        console.log("Analytics Scripts Loaded: User Accepted Cookies.");
    } else {
        console.log("Analytics Scripts Disabled: User Rejected Cookies.");
    }
};

const CookieConsent = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consentStatus = Cookies.get(CONSENT_NAME);
        if (consentStatus) {
            loadAnalyticsScripts(consentStatus);
        } else {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000); // Delayed entry for better UX
            return () => clearTimeout(timer);
        }
    }, []);

    const handleConsent = (status) => {
        Cookies.set(CONSENT_NAME, status, {
            expires: 365,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production'
        });
        setIsVisible(false);
        loadAnalyticsScripts(status);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 100, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 100, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="fixed bottom-6 right-6 z-[9999] w-full max-w-[380px] p-6 bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-2xl rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            >
                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/10 blur-[40px] pointer-events-none rounded-full" />

                {/* Close Button (Force dismiss) */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white p-2"
                >
                    <FiX size={18} />
                </button>

                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-2xl text-white text-xl shadow-lg shadow-blue-600/20">
                            <FaCookieBite />
                        </div>
                        <div>
                            <h3 className="text-sm font-black dark:text-white uppercase tracking-widest">{t("Data Policy")}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t("Cookie Authorization")}</p>
                        </div>
                    </div>

                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 leading-relaxed">
                        {t("We use neural cookies to enhance your experience, analyze subspace traffic, and personalize content.")}
                        {' '}
                        <Link
                            href="/privacy-policy"
                            className="text-blue-500 hover:text-blue-400 underline decoration-2 underline-offset-4"
                        >
                            {t("Review Policy")}
                        </Link>
                    </p>

                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleConsent('rejected')}
                            className="flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent"
                        >
                            {t("Reject")}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleConsent('accepted')}
                            className="flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-all"
                        >
                            {t("Allow All")}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CookieConsent;