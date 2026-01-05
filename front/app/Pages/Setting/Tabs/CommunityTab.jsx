'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiUserGroup, HiCrown, HiUserPlus, HiSparkles, HiArrowRight } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const CommunityCard = ({ community, index }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={() => router.push(`/Pages/Community/${community._id}`)}
      className="group relative rounded-2xl p-5 bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/5 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-indigo-500 transition-all">
            <Image
              src={community?.Picture?.url || '/default-community.png'}
              alt={community?.Name || 'Community'}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
            <HiUserGroup className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-black text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {community?.Name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {community?.members?.length || 0} {t('members')}
          </p>
        </div>

        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <HiArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <div className="absolute -top-2 -right-2">
        <HiSparkles className="w-8 h-8 text-gray-400 animate-pulse" />
      </div>
    </div>
    <h4 className="font-black text-gray-900 dark:text-white text-lg mb-2">{title}</h4>
    <p className="text-center text-gray-500 dark:text-gray-400 max-w-md font-medium">
      {description}
    </p>
  </div>
);

const CommunitySection = ({ title, icon: Icon, communities, emptyMessage, gradient }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${gradient} text-white`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-wider">{t(title)}</h3>
        {communities?.length > 0 && (
          <div className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-black">
            {communities.length}
          </div>
        )}
      </div>

      {communities?.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((c, index) => (
            <CommunityCard key={c._id} community={c} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl p-6 bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
          <EmptyState
            icon={Icon}
            title={t('No Communities')}
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
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-200/50 dark:border-white/5">
        <div className="relative">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white shadow-xl">
            <HiUserGroup className="w-6 h-6" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-black">
            {(communities?.length || 0) + (adminCommunities?.length || 0) + (joinedCommunities?.length || 0)}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t('Communities')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t('Manage your communities and memberships')}
          </p>
        </div>
      </div>

      {/* Communities Sections */}
      <div className="space-y-10">
        <CommunitySection
          title="My Communities"
          icon={HiUserGroup}
          communities={communities}
          emptyMessage="You haven't created any communities yet."
          gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
        />

        <CommunitySection
          title="Admin Communities"
          icon={HiCrown}
          communities={adminCommunities}
          emptyMessage="You are not an admin in any community yet."
          gradient="bg-gradient-to-br from-yellow-500 to-orange-600"
        />

        <CommunitySection
          title="Joined Communities"
          icon={HiUserPlus}
          communities={joinedCommunities}
          emptyMessage="You haven't joined any communities yet."
          gradient="bg-gradient-to-br from-green-500 to-emerald-600"
        />
      </div>
    </motion.section>
  );
};

export default CommunityTab;
