'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, UserPlus, ArrowRight, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/app/Component/ui/Avatar';
import { SettingsSection } from '@/app/Component/Setting/SettingsComponents';

const CommunityCard = ({ community, index }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -2 }}
      onClick={() => router.push(`/Pages/Community/${community._id}`)}
      className="group relative rounded-xl p-4 bg-white dark:bg-[#090d16] border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
    >
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar src={community?.Picture?.url} size="md" className="ring-1 ring-slate-100 dark:ring-slate-800 group-hover:ring-indigo-500 transition-all" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full border border-white dark:border-slate-900 flex items-center justify-center shadow-sm">
              <Users size={10} className="text-white" />
            </div>
          </div>

          <div className="min-w-0 pr-2">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-wide leading-tight">
              {community?.Name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-slate-400">
              <User size={11} />
              <p className="text-[9px] font-bold uppercase tracking-wider">
                {community?.members?.length || 0} {t('members')}
              </p>
            </div>
          </div>
        </div>

        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 transition-all shrink-0">
          <ArrowRight size={13} className="-rotate-45 group-hover:rotate-0 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-10 px-4 opacity-75 select-none">
    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 text-slate-400 flex items-center justify-center mb-3.5">
      <Icon size={20} />
    </div>
    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-1">{title}</h4>
    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold max-w-[200px] text-center leading-normal">
      {description}
    </p>
  </div>
);

const CommunitySection = ({ title, icon: Icon, communities, emptyMessage, colorClass }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <Icon size={18} className={colorClass} />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{t(title)}</h3>
        </div>
        {communities?.length > 0 && (
          <div className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {communities.length} {t('Active')}
          </div>
        )}
      </div>

      {communities?.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {communities.map((c, index) => (
            <CommunityCard key={c._id} community={c} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl p-4 bg-white dark:bg-[#090d16] border border-dashed border-slate-200 dark:border-slate-800">
          <EmptyState
            icon={Icon}
            title={t('No Communities Found')}
            description={t(emptyMessage)}
          />
        </div>
      )}
    </div>
  );
};

const CommunityTab = ({ user }) => {
  const { t } = useTranslation();
  const { communities = [], adminCommunities = [], joinedCommunities = [] } = user || {};

  return (
    <SettingsSection
      title="Network Hub"
      description="Manage community memberships & visibility"
    >
      {/* Communities Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm lg:col-span-2">
          <CommunitySection
            title="My Communities"
            icon={Users}
            communities={communities}
            emptyMessage="You haven't created any communities yet."
            colorClass="text-indigo-500"
          />
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm">
          <CommunitySection
            title="Admin Access"
            icon={ShieldCheck}
            communities={adminCommunities}
            emptyMessage="You are not an admin in any community yet."
            colorClass="text-amber-500"
          />
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-sm">
          <CommunitySection
            title="Joined Networks"
            icon={UserPlus}
            communities={joinedCommunities}
            emptyMessage="You haven't joined any communities yet."
            colorClass="text-emerald-500"
          />
        </div>
      </div>
    </SettingsSection>
  );
};

export default CommunityTab;
