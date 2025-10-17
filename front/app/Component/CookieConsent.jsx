// components/CookieConsent.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie'; 
import { FaCookieBite, FaTimes } from 'react-icons/fa'; // أيقونات إضافية للجمالية

const CONSENT_NAME = 'cookie_consent_status';

// ✨ دالة وهمية: يتم استدعاؤها فقط عند الموافقة
const loadAnalyticsScripts = (status) => {
    if (status === 'accepted') {
        // **[الأهم]: هنا يتم تحميل سكريبتات التتبع فعليًا**
        // مثال: إذا كنت تستخدم Google Analytics، يتم تحميل السكريبت هنا
        // window.dataLayer = window.dataLayer || [];
        // function gtag(){dataLayer.push(arguments);}
        // gtag('js', new Date());
        // gtag('config', 'YOUR_GA_ID');
        console.log("Analytics Scripts Loaded: User Accepted Cookies.");
    } else {
        // التأكد من تعطيلها (في حال وجودها)
        console.log("Analytics Scripts Disabled: User Rejected Cookies.");
    }
};

const CookieConsent = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    
    // 🧠 التحقق من الحالة عند تحميل الصفحة
    useEffect(() => {
        const consentStatus = Cookies.get(CONSENT_NAME);

        // 1. إذا اتخذ المستخدم قرارًا، حمّل السكريبتات المناسبة
        if (consentStatus) {
            loadAnalyticsScripts(consentStatus);
        } 
        
        // 2. إذا لم يتخذ قرارًا، اعرض الرسالة
        if (!consentStatus) {
            // تأخير بسيط لتحسين الـ UX (اختياري)
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []);

    // 💡 دالة لحفظ القرار
    const handleConsent = (status) => {
        // حفظ القرار لمدة سنة (365 يوم)
        Cookies.set(CONSENT_NAME, status, { expires: 365, sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' });
        setIsVisible(false); // إخفاء الرسالة

        // تحميل السكريبتات بناءً على القرار
        loadAnalyticsScripts(status);
    };


    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed bottom-0 left-0 right-0 z-[1000] bg-gray-900/95 backdrop-blur-sm text-white shadow-2xl p-4 sm:p-6 border-t border-blue-500/30"
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* النص الأساسي */}
                    <div className="flex-1 text-sm flex items-center gap-3">
                        <FaCookieBite size={24} className="text-blue-400 flex-shrink-0 hidden sm:block" />
                        <p>
                            {t("This website uses cookies for personalization and analysis. By clicking 'Accept', you agree to the use of all cookies.")}
                            {' '}
                            <Link 
                                href="/privacy-policy" 
                                className="text-blue-400 hover:text-blue-300 underline font-medium"
                            >
                                {t("Privacy Policy")}
                            </Link>
                        </p>
                    </div>

                    {/* الأزرار */}
                    <div className="flex flex-shrink-0 gap-3 w-full sm:w-auto">
                        {/* زر الرفض */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleConsent('rejected')}
                            className="flex-1 sm:flex-auto px-6 py-2 text-sm rounded-lg bg-gray-700 hover:bg-red-500/20 text-white font-medium border border-gray-700 transition"
                        >
                            {t("Reject All")}
                        </motion.button>
                        
                        {/* زر القبول */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleConsent('accepted')}
                            className="flex-1 sm:flex-auto px-6 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
                        >
                            {t("Accept All")}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CookieConsent;