import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  UserMinus, 
  VolumeX,
  ChevronRight,
  ShieldCheck,
  UserX
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PrimaryToggle from '@/app/Component/Setting/PrimaryToggle';
import { Avatar } from '@/app/Component/ui/Avatar';

const PrivacyTab = memo(({
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

    const unblockUser = (id) => {
        setBlockedUsers(blockedUsers.filter(u => u.id !== id));
    };

    return (
        <motion.section
            key="privacy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-100 dark:border-threads-border">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-violet-500/20">
                    <ShieldAlert size={40} />
                </div>
                <div className="text-center md:text-left space-y-2">
                    <h2 className="text-3xl font-black tracking-tighter uppercase">{t('Privacy Control')}</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
                        {t('Manage visibility & interactions')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Account Visibility Module */}
                <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-8">
                    <div className="flex items-center gap-3">
                        <Eye size={20} className="text-indigo-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest">{t('Profile Visibility')}</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[13px] font-bold">{t('Private Account')}</span>
                                <span className="text-[10px] text-gray-400 font-medium mt-1 leading-relaxed max-w-[200px]">
                                    {t('Only approved followers can see your content')}
                                </span>
                            </div>
                            <PrimaryToggle
                                checked={user?.isPrivate || false}
                                onChange={() => onTogglePrivate()}
                            />
                        </div>

                        <div className="flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[13px] font-bold">{t('Activity Status')}</span>
                                <span className="text-[10px] text-gray-400 font-medium mt-1 leading-relaxed max-w-[200px]">
                                    {t('Allow others to see when you are online')}
                                </span>
                            </div>
                            <PrimaryToggle
                                checked={user?.showOnlineStatus !== false}
                                onChange={() => onToggleShowOnlineStatus()}
                            />
                        </div>
                    </div>
                </div>

                {/* Restricted Entities Module */}
                <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-8">
                    <div className="flex items-center gap-3">
                        <UserMinus size={20} className="text-rose-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest">{t('Restricted Entities')}</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="group flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border shadow-sm hover:border-rose-500/30 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                                    <UserX size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold">{t('Blocked Accounts')}</span>
                                    <span className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-widest">{blockedUsers.length} Entities</span>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </div>

                        <div className="group flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border shadow-sm hover:border-amber-500/30 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                    <VolumeX size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold">{t('Muted Accounts')}</span>
                                    <span className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-widest">0 Entities</span>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* Blocked List (Expanded View) */}
                {blockedUsers.length > 0 && (
                    <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-rose-500">{t('Active Blocks')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {blockedUsers.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border">
                                    <div className="flex items-center gap-3">
                                        <Avatar src={u.avatar} size="sm" />
                                        <span className="text-xs font-bold tracking-wide">@{u.username}</span>
                                    </div>
                                    <button
                                        onClick={() => unblockUser(u.id)}
                                        className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                                    >
                                        {t('Revoke')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.section>
    );
});

PrivacyTab.displayName = 'PrivacyTab';
export default PrivacyTab;
