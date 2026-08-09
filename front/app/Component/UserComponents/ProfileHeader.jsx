'use client';

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { FaSpinner, FaCamera, FaAward, FaFire } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import { IoEllipsisHorizontal, IoAdd, IoLocationSharp, IoCalendarClearOutline } from "react-icons/io5";
import { SiGoogleanalytics } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/Context/AuthContext";
import { useUser } from "@/app/Context/UserContext";
import { useTranslation } from "react-i18next";
import { MdInfo } from "react-icons/md";
import SensitiveImage from "@/app/Component/Post/SensitiveImage";

const StatItem = ({ label, value, onClick }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center sm:items-start cursor-pointer group px-4 py-2 rounded-2xl transition-all hover:bg-slate-100/80 dark:hover:bg-white/5 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
  >
    <span className="text-lg md:text-xl font-black text-slate-900 transition-colors group-hover:text-indigo-500 dark:text-white dark:group-hover:text-indigo-400">
      {value || 0}
    </span>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-colors group-hover:text-slate-700 dark:text-white/40 dark:group-hover:text-white/50">
      {label}
    </span>
  </div>
);

const ProfileHeader = ({
  user: profileUser,
  isOwner = false,
  isFollowing = false,
  canSeePrivateContent = true,
  image,
  onImageChange,
  onAddStory,
  onFollow,
  onUnfollow,
  onShowFollowers,
  onShowFollowing,
  setOpenMenu,
  openMenu,
  onProfileClick,
  onCoverChange,
  renderOwnerMenu,
  renderVisitorMenu
}) => {
  const { user: authUser } = useAuth();
  const { loading } = useUser();
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const levelPercent = useMemo(() => {
    const points = profileUser?.userLevelPoints || 0;
    const levels = [0, 100, 250, 500, 1000];
    const userLevel = profileUser?.level || 1;

    if (userLevel >= 5) return 100;

    const min = levels[userLevel - 1] || 0;
    const max = levels[userLevel] || 100;

    return Math.max(0, Math.min(100, ((points - min) / (max - min)) * 100));
  }, [profileUser]);

  const handleFollowAction = useCallback(async () => {
    if (isFollowing) await onUnfollow?.();
    else await onFollow?.();
  }, [isFollowing, onFollow, onUnfollow]);

  return (
    <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[3rem] border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-200/50 transition-colors duration-300 dark:border-white/5 dark:bg-[#0A0A0A] dark:shadow-2xl">

      {/* Dynamic Cover Section */}
      <div className="group/cover relative h-64 w-full overflow-hidden bg-slate-200/80 md:h-80 dark:bg-[#111]">
        <SensitiveImage
          src={profileUser?.coverPhoto?.url || profileUser?.profilePhoto?.url || "/default-profile.png"}
          fill
          isSensitive={profileUser?.coverPhoto?.isSensitive}
          className="object-cover transition-transform duration-700 group-hover/cover:scale-110"
          alt="cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/70 dark:via-[#0A0A0A]/20 dark:to-[#0A0A0A]" />

        {/* Cover Action */}
        {isOwner && (
          <label className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/30 opacity-0 backdrop-blur-sm transition-opacity group-hover/cover:opacity-100">
            <div className="flex flex-col items-center gap-2">
              <FaCamera size={32} className="text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">{t("Update Terminal Banner")}</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onCoverChange}
            />
          </label>
        )}

        {/* Floating Action Bar on Cover */}
        <div className="absolute right-6 top-6 z-20 flex gap-3">
          {isOwner && (
            <Link href="/Pages/Analytics" className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 text-slate-700 backdrop-blur-md transition-all hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-black/40 dark:text-white/60 dark:hover:text-white">
              <SiGoogleanalytics size={20} />
            </Link>
          )}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 text-slate-700 backdrop-blur-md transition-all hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-black/40 dark:text-white/60 dark:hover:text-white"
          >
            <IoEllipsisHorizontal size={20} />
          </button>
          {!isOwner && renderVisitorMenu?.()}
          {isOwner && renderOwnerMenu?.()}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative -mt-24 px-8 pb-12 md:-mt-32">
        <div className="flex flex-col items-end gap-8 md:flex-row">

          {/* Avatar with Glow & Indicator */}
          <div className="relative shrink-0 group">
            <div className="absolute inset-0 scale-75 animate-pulse rounded-full bg-indigo-500/30 blur-3xl" />
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`relative h-40 w-40 rounded-[3.5rem] p-1.5 transition-all md:h-52 md:w-52 ${profileUser?.activeStories?.length > 0 ? 'bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500' : 'bg-slate-200/80 dark:bg-white/10'}`}
              onClick={!isOwner ? onProfileClick : undefined}
            >
              <div className="group relative h-full w-full overflow-hidden rounded-[3rem] border-4 border-white bg-white dark:border-black dark:bg-black">
                <SensitiveImage
                  src={preview || profileUser?.profilePhoto?.url || "/default-profile.png"}
                  alt="profile"
                  fill
                  isSensitive={!preview && profileUser?.profilePhoto?.isSensitive}
                  className="w-full h-full object-cover"
                />
                {isOwner && (
                  <label className="absolute inset-0 z-30 flex cursor-pointer flex-col items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <FaCamera size={32} className="mb-2 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{t("Change Identity")}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                  </label>
                )}
              </div>
            </motion.div>
            {isOwner && (
              <button
                onClick={onAddStory}
                className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-white shadow-2xl transition-transform hover:scale-110 dark:border-black dark:bg-white dark:text-black"
              >
                <IoAdd size={24} />
              </button>
            )}
          </div>

          {/* User Meta Data */}
          <div className="flex-1 pb-4 text-center md:text-left">
            <div className="mb-2 flex items-center justify-center gap-3 md:justify-start">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white md:text-5xl">
                {profileUser?.username || "Incognito"}
              </h1>
              {profileUser?.isAccountWithPremiumVerify && (
                <HiBadgeCheck className="text-indigo-500 text-3xl" />
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold text-slate-500 md:justify-start dark:text-white/40">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-500">{profileUser?.profileName || profileUser?.username || "user"}</span>
              <span className="flex items-center gap-1.5"><IoLocationSharp className="text-indigo-500" /> {profileUser?.country || "Earth"}</span>
              <span className="flex items-center gap-1.5">
                <IoCalendarClearOutline className="text-indigo-500" />
                {t("Joined")} {profileUser?.createdAt ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : t('Unknown')}
              </span>
            </div>
          </div>

          {/* Interaction Zone */}
          {!isOwner && (
            <div className="pb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollowAction}
                disabled={loading}
                className={`rounded-2xl px-12 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all ${isFollowing ? 'border border-slate-200/80 bg-slate-100 text-slate-700 hover:border-red-500 hover:bg-red-500 hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-red-500' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:text-white'}`}
              >
                {loading ? <FaSpinner className="animate-spin" /> : (isFollowing ? t("Disconnect") : t("Connect"))}
              </motion.button>
            </div>
          )}
        </div>

        {/* Bio & XP Bar */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12 space-y-8">
            <p className="max-w-4xl text-xl font-medium leading-relaxed italic text-slate-600 dark:text-white/60 md:text-2xl">
              {`"${profileUser?.description || t("A visionary user exploring the Zocial universe. No formal broadcast yet.")}"`}
            </p>



            {/* Advanced Level Dash */}
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-slate-50/80 p-8 transition-colors duration-300 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="absolute right-0 top-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
                <FaAward size={80} className="text-indigo-500" />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
                    <FaFire className="text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/30">{t("Growth Level")}</div>
                    <div className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
                      <span>Level {profileUser?.level || 1}</span>
                      <span className="text-slate-400 dark:text-white/20">•</span>
                      <span className="text-base text-indigo-500 dark:text-indigo-400">{profileUser?.userLevelRank || "Apprentice"}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-500">{profileUser?.userLevelPoints || 0} <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/40">XP</span></div>
                  <Link href="/Pages/Levels" className="text-[8px] font-black uppercase text-slate-400 underline underline-offset-4 transition-colors hover:text-slate-700 dark:text-white/20 dark:hover:text-white">{t("Logic Breakdown")}</Link>
                </div>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/5">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${levelPercent}%` }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/20">
                <span>{t("Current Evolution")}</span>
                <span>
                  {profileUser?.level >= 5
                    ? t("Max Level Reached")
                    : `${Math.max((([0, 100, 250, 500, 1000][profileUser?.level || 1] || 1000) - (profileUser?.userLevelPoints || 0)), 0)} ${t("XP to Next Level")}`
                  }
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-12 pt-4">
              <StatItem label={t("Posts Broadcast")} value={profileUser?.posts?.length} />
              <StatItem label={t("Followers Hub")} value={profileUser?.followers?.length} onClick={onShowFollowers} />
              <StatItem label={t("Following Orbit")} value={profileUser?.following?.length} onClick={onShowFollowing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileHeader);
