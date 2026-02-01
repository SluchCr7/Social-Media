'use client';

import React, { useMemo, memo } from "react";
import Image from "next/image";
import { HiUserPlus, HiUserMinus, HiUserGroup, HiOutlineSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useCommunity } from "../Context/CommunityContext";
import { useAuth } from "../Context/AuthContext";
import { useUser } from "../Context/UserContext";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useGetData } from "../Custome/useGetData";

const isContained = (list, userId) => {
  if (!list || !userId) return false;
  const userIdStr = userId.toString();
  return list.some(item =>
    (item?._id?.toString() === userIdStr) || (item?.toString() === userIdStr)
  );
};

const StatItem = memo(({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-sm font-black text-gray-900 dark:text-white">{value}</span>
    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</span>
  </div>
));
StatItem.displayName = 'StatItem';

const SuggestionCard = memo(({ item, type, delay }) => {
  const { joinToCommunity } = useCommunity();
  const { user } = useAuth();
  const { followUser } = useUser();
  const { t } = useTranslation();
  const { userData } = useGetData(user?._id);

  const isUserType = type === "user";
  const isFollowingOrMember = isContained(
    isUserType ? item.followers : item.members,
    userData?._id
  );

  const isOwner = useMemo(() => !isUserType && item?.owner?._id === userData?._id, [item, userData, isUserType]);
  const hrefPath = useMemo(() => isUserType ? `/Pages/User/${item?._id}` : `/Pages/Community/${item?._id}`, [item?._id, isUserType]);

  const followHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUserType) followUser(item._id);
    else joinToCommunity(item._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -8 }}
      className="relative flex flex-col items-center p-6 rounded-[3rem] bg-white/70 dark:bg-white/[0.02] 
                 backdrop-blur-3xl border border-gray-200/50 dark:border-white/5 
                 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] group overflow-hidden"
    >
      {/* 🔮 Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      {/* ✨ Unique Header Indicator */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-indigo-500">
        <HiOutlineSparkles size={18} className="animate-pulse" />
      </div>

      <Link href={hrefPath} className="relative z-10 w-full flex flex-col items-center">
        {/* 🖼️ Profile Image Frame */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-20" />
          <div className="relative w-full h-full rounded-[2.25rem] overflow-hidden border-4 border-white dark:border-gray-900 shadow-2xl bg-gray-100 dark:bg-gray-800">
            {item?.profilePhoto?.url || item?.Picture?.url ? (
              <Image
                src={item?.profilePhoto?.url || item?.Picture?.url}
                alt={item?.username || item?.Name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-indigo-500/30">
                {(item?.username?.[0] || item?.Name?.[0] || "?").toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* 📝 Identity Information */}
        <div className="text-center w-full px-2">
          <h3 className="text-base font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-1 truncate">
            {item?.username || item?.Name || "Signal ID"}
          </h3>
          {isUserType ? (
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-3">
              @{item?.profileName || "broadcast"}
            </p>
          ) : (
            <p className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-3">
              {t("Verified Hub")}
            </p>
          )}

          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 h-8">
            {item?.description || (isUserType ? t("Exploring the digital horizon.") : t("Fueling the future of community."))}
          </p>
        </div>
      </Link>

      {/* 📊 High-End Stats Metrics */}
      <div className="relative z-10 w-full grid grid-cols-2 gap-4 my-6 py-4 border-y border-gray-100 dark:border-white/5">
        {isUserType ? (
          <>
            <StatItem label={t("Followers")} value={item?.followers?.length || 0} />
            <StatItem label={t("Following")} value={item?.following?.length || 0} />
          </>
        ) : (
          <>
            <StatItem label={t("Nodes")} value={item?.members?.length || 0} />
            <StatItem label={t("Broadcasts")} value={item?.postsCount || 0} />
          </>
        )}
      </div>

      {/* ⚡ Action Button */}
      {!isOwner && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={followHandler}
          className={`relative z-10 w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300
            ${isFollowingOrMember
              ? 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-rose-500 hover:text-white border border-gray-200/50 dark:border-white/10 overflow-hidden group/btn'
              : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25'
            }`}
        >
          {isFollowingOrMember ? (
            <>
              <HiUserMinus size={14} className="group-hover/btn:scale-110 transition-transform" />
              {isUserType ? t("Sever Link") : t("Leave Hub")}
            </>
          ) : (
            <>
              {isUserType ? <HiUserPlus size={14} /> : <HiUserGroup size={14} />}
              {isUserType ? t("Establish Link") : t("Sync with Hub")}
            </>
          )}

          {/* Subtle Button Shine */}
          {!isFollowingOrMember && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}
        </motion.button>
      )}
    </motion.div>
  );
});
SuggestionCard.displayName = 'SuggestionCard';

export const SuggestionRow = ({ type, data }) => {
  const { t } = useTranslation();

  const renderedContent = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
          <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
            <HiUserGroup size={32} className="text-gray-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500">
            {t("Atmosphere is silent... No nodes available.")}
          </p>
        </div>
      );
    }

    return data.map((item, idx) => (
      <SuggestionCard
        key={item?._id || idx}
        item={item}
        type={type}
        delay={idx * 0.08}
      />
    ));
  }, [data, type, t]);

  return (
    <div className="w-full px-4 md:px-0">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-8">
        {renderedContent}
      </div>
    </div>
  );
};

export default memo(SuggestionRow);
