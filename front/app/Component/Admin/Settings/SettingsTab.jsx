'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiCog, HiShieldCheck, HiMoon, HiGlobeAlt } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/Context/ThemeContext';

const SettingsTab = () => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(true);

    const SettingToggle = ({ title, desc, icon, value, onChange }) => (
        <div className="flex items-center justify-between p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-white/10 text-indigo-500 dark:text-white">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
            </div>
            <button
                onClick={onChange}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${value ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full p-6 md:p-10 space-y-8"
        >
            <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('System Settings')}</h2>
                <p className="text-gray-500 dark:text-gray-400">{t('Configure critical system parameters')}</p>
            </div>

            <div className="grid gap-6">
                <SettingToggle
                    title={t("Maintenance Mode")}
                    desc={t("Disable access for non-admin users")}
                    icon={<HiShieldCheck className="w-6 h-6" />}
                    value={maintenanceMode}
                    onChange={() => setMaintenanceMode(!maintenanceMode)}
                />

                <SettingToggle
                    title={t("Dark Mode")}
                    desc={t("Toggle system-wide dark appearance")}
                    icon={<HiMoon className="w-6 h-6" />}
                    value={theme === 'dark'}
                    onChange={toggleTheme}
                />

                <SettingToggle
                    title={t("System Notifications")}
                    desc={t("Receive emails for critical alerts")}
                    icon={<HiGlobeAlt className="w-6 h-6" />}
                    value={emailNotifs}
                    onChange={() => setEmailNotifs(!emailNotifs)}
                />
            </div>

            <div className="p-8 rounded-3xl bg-indigo-600 text-white relative overflow-hidden mt-8">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">{t('System Version')}</h3>
                    <p className="text-indigo-100 mb-6">v2.5.0 (Beta)</p>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold">
                            {t('Check Updates')}
                        </button>
                        <button className="px-6 py-2 bg-white/20 text-white rounded-xl font-bold">
                            {t('View Logs')}
                        </button>
                    </div>
                </div>
                <HiCog className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-10 animate-spin-slow" />
            </div>
        </motion.div>
    );
};

export default SettingsTab;
