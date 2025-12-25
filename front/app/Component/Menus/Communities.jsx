'use client';
import React, { memo, useMemo } from 'react';
import { useCommunity } from '../../Context/CommunityContext';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../Context/AuthContext';
import { HiCheckBadge, HiUsers } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { useGetData } from '@/app/Custome/useGetData';
import { motion, AnimatePresence } from 'framer-motion';
import MenuSkeleton from '../../Skeletons/MenuSkeleton';

const Communities = memo(() => {
  const { communities } = useCommunity();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { userData } = useGetData(user?._id);

  const joinedCommunities = useMemo(() => {
    return userData?.joinedCommunities?.slice(0, 3) || [];
  }, [userData?.joinedCommunities]);

  return (
    <div className="w-full bg-white/50 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col">

      {/* 🤝 Header */}
      <div className="px-7 pt-7 pb-4">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-full" />
          {t("My Circles")}
        </h2>
      </div>

      {/* 👥 Body */}
      <div className="flex flex-col w-full px-4 pb-2 space-y-1">
        {!userData ? (
          <MenuSkeleton />
        ) : joinedCommunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-3">
              <HiUsers className="text-gray-400 text-xl" />
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
              {t("No circles joined.")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <AnimatePresence>
              {joinedCommunities.map((community, idx) => {
                const isJoined = community?.members?.includes(user?._id);
                return (
                  <motion.div
                    key={community?._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  >
                    <Link href={`/Pages/Community/${community?._id}`} className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative w-12 h-12 shrink-0">
                        <Image
                          src={community?.Picture?.url || '/placeholder.png'}
                          alt="community"
                          fill
                          className="rounded-[1.25rem] object-cover ring-2 ring-white dark:ring-gray-900 shadow-sm transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h2 className="text-gray-900 dark:text-gray-100 text-sm font-bold truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {community?.Name}
                        </h2>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">
                          <HiUsers size={12} />
                          {community?.members?.length || 0} {t("members")}
                        </span>
                      </div>
                    </Link>

                    {isJoined && (
                      <div className="ml-2 text-emerald-500 dark:text-emerald-400">
                        <HiCheckBadge size={22} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 🏷️ Footer */}
      {userData?.joinedCommunities?.length > 3 && (
        <div className="px-7 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <Link href="/Pages/CommunityMain" className="text-[12px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all uppercase tracking-wide inline-flex items-center gap-2">
            {t("Discover more circles")}
            <HiUsers className="text-sm" />
          </Link>
        </div>
      )}
    </div>
  );
});

Communities.displayName = 'Communities'
export default Communities;
