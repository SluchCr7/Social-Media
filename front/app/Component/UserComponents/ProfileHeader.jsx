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
    className={`flex flex-col items-center sm:items-start cursor-pointer group px-4 py-2 rounded-2xl transition-all hover:bg-white/5 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
  >
    <span className="text-lg md:text-xl font-black text-white group-hover:text-indigo-400 transition-colors">
      {value || 0}
    </span>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50">
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
    const next = profileUser?.nextLevelPoints || 500;
    return Math.min((points / next) * 100, 100);
  }, [profileUser]);

  const handleFollowAction = useCallback(async () => {
    if (isFollowing) await onUnfollow?.();
    else await onFollow?.();
  }, [isFollowing, onFollow, onUnfollow]);

  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-[3rem] bg-[#0A0A0A] border border-white/5 shadow-2xl">

      {/* Dynamic Cover Section */}
      <div className="relative h-64 md:h-80 w-full bg-[#111] overflow-hidden group/cover">
        <SensitiveImage
          src={profileUser?.coverPhoto?.url || profileUser?.profilePhoto?.url || "/default-profile.png"}
          fill
          isSensitive={profileUser?.coverPhoto?.isSensitive}
          className="object-cover transition-transform duration-700 group-hover/cover:scale-110"
          alt="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/20 to-[#0A0A0A] pointer-events-none" />

        {/* Cover Action */}
        {isOwner && (
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm z-10">
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
        <div className="absolute top-6 right-6 flex gap-3 z-20">
          {isOwner && (
            <Link href="/Pages/Analytics" className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white transition-all">
              <SiGoogleanalytics size={20} />
            </Link>
          )}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white transition-all"
          >
            <IoEllipsisHorizontal size={20} />
          </button>
          {!isOwner && renderVisitorMenu?.()}
          {isOwner && renderOwnerMenu?.()}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative px-8 pb-12 -mt-24 md:-mt-32">
        <div className="flex flex-col md:flex-row items-end gap-8">

          {/* Avatar with Glow & Indicator */}
          <div className="relative shrink-0 group">
            <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full scale-75 animate-pulse" />
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`relative w-40 h-40 md:w-52 md:h-52 rounded-[3.5rem] p-1.5 transition-all ${profileUser?.activeStories?.length > 0 ? 'bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500' : 'bg-white/10'}`}
              onClick={!isOwner ? onProfileClick : undefined}
            >
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden bg-black border-4 border-black group">
                <SensitiveImage
                  src={preview || profileUser?.profilePhoto?.url || "/default-profile.png"}
                  alt="profile"
                  fill
                  isSensitive={!preview && profileUser?.profilePhoto?.isSensitive}
                  className="w-full h-full object-cover"
                />
                {isOwner && (
                  <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm z-30">
                    <FaCamera size={32} className="text-white mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{t("Change Identity")}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                  </label>
                )}
              </div>
            </motion.div>
            {isOwner && (
              <button
                onClick={onAddStory}
                className="absolute bottom-2 right-2 w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl border-4 border-black hover:scale-110 transition-transform"
              >
                <IoAdd size={24} />
              </button>
            )}
          </div>

          {/* User Meta Data */}
          <div className="flex-1 pb-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                {profileUser?.username || "Incognito"}
              </h1>
              {profileUser?.isAccountWithPremiumVerify && (
                <HiBadgeCheck className="text-indigo-500 text-3xl" />
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/40 font-bold text-sm">
              <span className="text-indigo-400 font-black tracking-widest uppercase text-xs">@{profileUser?.profileName || profileUser?.username || "user"}</span>
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
                className={`px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${isFollowing ? 'bg-white/5 text-white border border-white/10 hover:bg-red-500 hover:text-white hover:border-red-500' : 'bg-white text-black hover:bg-indigo-600 hover:text-white shadow-xl shadow-indigo-600/20'}`}
              >
                {loading ? <FaSpinner className="animate-spin" /> : (isFollowing ? t("Disconnect") : t("Connect"))}
              </motion.button>
            </div>
          )}
        </div>

        {/* Bio & XP Bar */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12 space-y-8">
            <p className="text-xl md:text-2xl font-medium text-white/60 leading-relaxed max-w-4xl italic">
              {`"${profileUser?.description || t("A visionary user exploring the Zocial universe. No formal broadcast yet.")}"`}
            </p>



            {/* Advanced Level Dash */}
            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <FaAward size={80} className="text-indigo-500" />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <FaFire className="text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t("Growth Level")}</div>
                    <div className="text-xl font-black text-white">{profileUser?.userLevelRank || "Apprentice"}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-500">{profileUser?.userLevelPoints || 0} <span className="text-[10px] text-white/40 tracking-widest uppercase">XP</span></div>
                  <Link href="/Pages/Levels" className="text-[8px] font-black uppercase text-white/20 hover:text-white transition-colors underline underline-offset-4">{t("Logic Breakdown")}</Link>
                </div>
              </div>
              <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${levelPercent}%` }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                />
              </div>
              <div className="mt-3 flex justify-between items-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <span>{t("Current Evolution")}</span>
                <span>{Math.max((profileUser?.nextLevelPoints || 500) - (profileUser?.userLevelPoints || 0), 0)} {t("XP to Next Terminal")}</span>
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
