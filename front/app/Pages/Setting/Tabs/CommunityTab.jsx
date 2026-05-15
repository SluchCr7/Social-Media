import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, UserPlus, Sparkles, ArrowRight, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/app/Component/ui/Avatar';

const CommunityCard = ({ community, index }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => router.push(`/Pages/Community/${community._id}`)}
      className="group relative rounded-3xl p-6 bg-white dark:bg-black border border-gray-100 dark:border-threads-border hover:border-indigo-500/30 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden"
    >
      <div className="relative flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <Avatar src={community?.Picture?.url} size="lg" className="ring-2 ring-gray-100 dark:ring-white/5 group-hover:ring-indigo-500 transition-all" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full border-2 border-white dark:border-black flex items-center justify-center shadow-lg">
            <Users size={12} className="text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
            {community?.Name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
             <User size={12} className="text-gray-400" />
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
               {community?.members?.length || 0} {t('members')}
             </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
          <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 opacity-70">
    <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h4 className="text-xs font-black uppercase tracking-widest mb-1">{title}</h4>
    <p className="text-[10px] text-gray-500 font-medium max-w-[200px] text-center leading-relaxed">
      {description}
    </p>
  </div>
);

const CommunitySection = ({ title, icon: Icon, communities, emptyMessage, colorClass }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon size={20} className={colorClass} />
          <h3 className="text-sm font-black uppercase tracking-widest">{t(title)}</h3>
        </div>
        {communities?.length > 0 && (
          <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest">
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
        <div className="rounded-[2rem] p-6 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border border-dashed">
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
  const totalCommunities = (communities?.length || 0) + (adminCommunities?.length || 0) + (joinedCommunities?.length || 0);

  return (
    <motion.section
      key="communities"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-gray-100 dark:border-threads-border">
        <div className="relative">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
            <Users size={40} />
          </div>
          {totalCommunities > 0 && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full border-4 border-white dark:border-black flex items-center justify-center text-white text-[10px] font-black shadow-lg">
              {totalCommunities}
            </div>
          )}
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase">{t('Network Hub')}</h2>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
            {t('Manage community memberships')}
          </p>
        </div>
      </div>

      {/* Communities Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border lg:col-span-2">
          <CommunitySection
            title="My Communities"
            icon={Users}
            communities={communities}
            emptyMessage="You haven't created any communities yet."
            colorClass="text-indigo-500"
          />
        </div>

        <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border">
          <CommunitySection
            title="Admin Access"
            icon={ShieldCheck}
            communities={adminCommunities}
            emptyMessage="You are not an admin in any community yet."
            colorClass="text-amber-500"
          />
        </div>

        <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-threads-border">
          <CommunitySection
            title="Joined Networks"
            icon={UserPlus}
            communities={joinedCommunities}
            emptyMessage="You haven't joined any communities yet."
            colorClass="text-emerald-500"
          />
        </div>
      </div>
    </motion.section>
  );
};

export default CommunityTab;
