import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiLockClosed, HiEye, HiUserMinus, HiSpeakerXMark, HiChevronRight, HiCheckCircle } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import PrimaryToggle from '@/app/Component/Setting/PrimaryToggle'; // Assuming this component exists and works
import Image from 'next/image';

const PrivacyTab = React.memo(({
    user,
    onTogglePrivate,
    onToggleShowOnlineStatus,
}) => {
    const { t } = useTranslation();

    // Mock Data for Blocked/Muted (Since we don't have backend integration yet)
    const [blockedUsers, setBlockedUsers] = useState([
        { id: 1, username: 'spambot99', avatar: '/default-avatar.png' },
        { id: 2, username: 'hater_dude', avatar: '/default-avatar.png' },
    ]);

    const [mutedUsers, setMutedUsers] = useState([]);

    const unblockUser = (id) => {
        setBlockedUsers(blockedUsers.filter(u => u.id !== id));
    };

    return (
        <motion.div
            key="privacy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl mx-auto p-6 space-y-8"
        >
            <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <HiLockClosed className="text-indigo-500" />
                    {t('Privacy & Visibility')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('Manage who can see your content and how you interact with others.')}
                </p>
            </div>

            {/* Account Privacy Section */}
            <section className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-white/5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('Account Privacy')}</h3>
                    <p className="text-xs text-gray-500">{t('Control visibility of your profile and activity.')}</p>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-white/5">
                    <div className="p-6 flex items-center justify-between">
                        <div className="pr-4">
                            <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">{t('Private Account')}</div>
                            <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                                {t('When your account is private, only people you approve can see your photos and videos. Your existing followers won\'t be affected.')}
                            </p>
                        </div>
                        <PrimaryToggle
                            checked={user?.isPrivate || false}
                            onChange={() => onTogglePrivate()}
                        />
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="pr-4">
                            <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">{t('Status Indicator')}</div>
                            <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                                {t('Allow accounts you follow and anyone you message to see when you were last active.')}
                            </p>
                        </div>
                        <PrimaryToggle
                            checked={user?.showOnlineStatus !== false}
                            onChange={() => onToggleShowOnlineStatus()}
                        />
                    </div>
                </div>
            </section>

            {/* Interactions Section */}
            <section className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-white/5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('Interactions')}</h3>
                    <p className="text-xs text-gray-500">{t('Manage blocked and restricted accounts.')}</p>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {/* Blocked Accounts */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-500">
                                    <HiUserMinus className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white text-sm">{t('Blocked Accounts')}</div>
                                    <div className="text-xs text-gray-500">{blockedUsers.length} {t('accounts')}</div>
                                </div>
                            </div>
                            <HiChevronRight className="text-gray-400" />
                        </div>

                        {/* List of blocked accounts (Expandable or inline) */}
                        <div className="space-y-3 mt-4 pl-12">
                            {blockedUsers.length > 0 ? (
                                blockedUsers.map(u => (
                                    <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                                                <Image src={u.avatar} alt={u.username} fill className="object-cover" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">@{u.username}</span>
                                        </div>
                                        <button
                                            onClick={() => unblockUser(u.id)}
                                            className="text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            {t('Unblock')}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-gray-400 italic">{t('No blocked accounts')}</div>
                            )}
                        </div>
                    </div>

                    {/* Muted Accounts */}
                    <div className="p-6 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg text-yellow-600 dark:text-yellow-500">
                                    <HiSpeakerXMark className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-indigo-500 transition-colors">{t('Muted Accounts')}</div>
                                    <p className="text-xs text-gray-500">{t('See accounts you’ve muted from your feed and stories.')}</p>
                                </div>
                            </div>
                            <HiChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
});

PrivacyTab.displayName = 'PrivacyTab';
export default PrivacyTab;
