'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { FaSpinner, FaCamera } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import { IoEllipsisHorizontal, IoAdd } from "react-icons/io5";
import { SiGoogleanalytics } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import StatBlock from "./StatBlock";
import { useAuth } from "@/app/Context/AuthContext";
import { useUser } from "@/app/Context/UserContext";
import { useTranslation } from "react-i18next";
import { MdInfo } from "react-icons/md";

const ProfileHeader = ({
  user: profileUser,
  isOwner = false,
  isFollowing = false,
  canSeePrivateContent = true,
  image,
  onImageChange,
  onEdit,
  onAddStory,
  onFollow,
  onUnfollow,
  onShowFollowers,
  onShowFollowing,
  setOpenMenu,
  openMenu,
  onProfileClick,
  renderOwnerMenu,
  renderVisitorMenu
}) => {
  const { user: authUser } = useAuth();
  const { loading } = useUser();
const {t} = useTranslation()
  const handleClick = async () => {
    try {
      if (isFollowing) await onUnfollow?.();
      else await onFollow?.();
    } catch (error) {
      console.error(error);
    }
  };

  const hideActions = !isOwner && authUser?._id === profileUser?._id;

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5 sm:gap-8 w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-8">

      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`relative w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-lg cursor-pointer p-1
          ${profileUser?.stories?.length > 0
            ? "border-[3px] sm:border-[4px] md:border-[5px] border-blue-500 animate-spin-slow"
            : "border-0 border-transparent"}`}
        onClick={!isOwner ? onProfileClick : undefined}
      >
        <div className="w-full h-full rounded-full overflow-hidden relative group">
          <Image
            src={
              image
                ? URL.createObjectURL(image)
                : profileUser?.profilePhoto?.url || "/default-profile.png"
            }
            alt="Profile photo"
            fill
            className="object-cover rounded-full"
          />
          {isOwner && (
            <>
              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <FaCamera className="text-white text-lg sm:text-xl" />
              </div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Info */}
      <div className="flex flex-col flex-1 w-full items-center lg:items-start text-center lg:text-left gap-3 sm:gap-4">

        {/* Username + Badge + Menu */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold break-words">
            {profileUser?.username || "Username"}
          </h1>
          {profileUser?.isAccountWithPremiumVerify && (
            <HiBadgeCheck className="text-blue-500 text-lg sm:text-xl" title="Verified" />
          )}

          {!hideActions && (
            <div className="flex items-center gap-1 sm:gap-2">
              <span
                onClick={() => setOpenMenu(!openMenu)}
                className="cursor-pointer text-gray-600 dark:text-gray-300"
              >
                <IoEllipsisHorizontal size={20} />
              </span>
              {isOwner && (
                <Link href="/Pages/Analytics" className="pl-1 sm:pl-2">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <SiGoogleanalytics className="text-gray-600 dark:text-gray-300" size={18} />
                  </motion.span>
                </Link>
              )}
            </div>
          )}
          {!hideActions && (isOwner ? renderOwnerMenu?.() : renderVisitorMenu?.())}
        </div>

        {/* Level Progress */}
        <div className="w-full max-w-xs sm:max-w-sm mx-auto lg:mx-0">
          <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-1">
              {profileUser?.userLevelRank || "Junior"} 🏅
            </span>
            <div className="flex items-center gap-2">
              <Link href={"/Pages/Levels"} className="text-lightMode-text dark:text-darkMode-text"><MdInfo/></Link>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {profileUser?.userLevelPoints || 0} {t("XP")}
              </motion.span>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full mt-2 overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(
                  ((profileUser?.userLevelPoints || 0) /
                    (profileUser?.nextLevelPoints || 500)) *
                    100,
                  100
                )}%`,
              }}
              transition={{ duration: 1.2 }}
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full"
            />
          </div>
          <span className="block text-xs text-gray-500 mt-1 text-right">
            {t("Next level in")}{" "}
            {Math.max(
              (profileUser?.nextLevelPoints || 500) -
                (profileUser?.userLevelPoints || 0),
              0
            )}{" "}
            XP
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm sm:text-base text-gray-500 max-w-md break-words whitespace-pre-wrap mt-1 sm:mt-2 leading-relaxed px-1 sm:px-0">
          {profileUser?.description || "No bio yet."}
        </p>

        {/* Actions */}
        {!hideActions && (
          <>
            {isOwner ? (
              // <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 justify-center lg:justify-start">
              //   <motion.button
              //     whileTap={{ scale: 0.96 }}
              //     onClick={onAddStory}
              //     className="flex items-center gap-2 border px-4 sm:px-6 py-2 rounded-lg text-sm font-medium hover:bg-lightMode-hover dark:hover:bg-darkMode-hover hover:shadow transition"
              //   >
              //     <IoAdd /> {t("Add Story")}
              //   </motion.button>
              // </div>
              <>
              </>
            ) : (
              <div className="flex gap-2 sm:gap-3 mt-3 justify-center lg:justify-start">
                <button
                  onClick={handleClick}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg border text-sm sm:text-base font-medium transition-all duration-300
                    ${
                      isFollowing
                        ? "text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                        : "text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                    }
                    ${loading ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>{isFollowing ? "Unfollowing..." : "Following..."}</span>
                    </>
                  ) : (
                    <>
                      {isFollowing ? <RiUserUnfollowLine /> : <RiUserFollowLine />}
                      <span>{isFollowing ? t("Unfollow") : t("Follow")}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* Stats */}
        {canSeePrivateContent && (
          <div className="flex flex-wrap justify-center sm:justify-between lg:justify-start gap-5 sm:gap-8 mt-4 sm:mt-6 w-full max-w-md">
            <StatBlock label="Posts" value={profileUser?.posts?.length} />
            <StatBlock
              label="Followers"
              value={profileUser?.followers?.length}
              onClick={onShowFollowers}
            />
            <StatBlock
              label="Following"
              value={profileUser?.following?.length}
              onClick={onShowFollowing}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
