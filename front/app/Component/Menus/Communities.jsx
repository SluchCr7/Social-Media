'use client';
import React, { memo, useMemo } from 'react';
import { useCommunity } from '../../Context/CommunityContext';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../Context/AuthContext';
import { FaCheck, FaUsers } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useGetData } from '@/app/Custome/useGetData';
import { motion, AnimatePresence } from 'framer-motion';

const Communities = memo(() => {
  const { communities } = useCommunity();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { userData } = useGetData(user?._id);

  const joinedCommunities = useMemo(() => {
    return userData?.joinedCommunities?.slice(0, 3) || [];
  }, [userData?.joinedCommunities]);

  return (
    <div className="w-full max-h-[500px] overflow-hidden bg-white dark:bg-[#16181c] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-300 dark:border-gray-600 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <h2 className="text-white text-lg font-semibold">{t("My Communities")}</h2>
      </div>

      {/* Body */}
      <div className="flex flex-col w-full px-4 py-3 space-y-3 overflow-y-auto">
        {!userData ? (
          <div className="animate-pulse flex flex-col space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : joinedCommunities.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">{t("No communities to join.")}</p>
        ) : (
          <AnimatePresence>
            {joinedCommunities.map((community) => {
              const isJoined = community?.members?.includes(user._id);
              return (
                <motion.div
                  key={community?._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer group"
                >
                  <Link href={`/Pages/Community/${community?._id}`} className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                      <Image
                        src={community?.Picture?.url || '/placeholder.png'}
                        alt="community"
                        width={48}
                        height={48}
                        loading="lazy"
                        className="rounded-full object-cover w-full h-full ring-1 ring-gray-200 dark:ring-gray-700 group-hover:ring-indigo-400 transition-all"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-gray-900 dark:text-gray-100 text-base font-semibold group-hover:text-indigo-500 transition-all">
                        {community?.Name}
                      </h2>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <FaUsers className="text-[10px]" />
                        {community?.members?.length || 0} {t("members")}
                      </span>
                    </div>
                  </Link>

                  {isJoined && (
                    <button
                      disabled
                      className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md border border-gray-400 text-gray-400 cursor-not-allowed opacity-60"
                    >
                      <FaCheck className="text-sm" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {userData?.joinedCommunities?.length > 3 && (
        <div className="px-4 py-3 border-t border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1f26]">
          <Link href="/Pages/CommunityMain" className="w-full block text-center text-sm font-medium text-indigo-500 hover:underline">
            {t("See More Communities")}
          </Link>
        </div>
      )}
    </div>
  );
});
Communities.displayName = 'Communities'

export default Communities;
