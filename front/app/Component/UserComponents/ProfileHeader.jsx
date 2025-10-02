import { motion } from "framer-motion";
import Image from "next/image";
import { HiBadgeCheck } from "react-icons/hi";
import { IoEllipsisHorizontal, IoAdd } from "react-icons/io5";
import { FaUserEdit, FaCamera } from "react-icons/fa";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import StatBlock from "./StatBlock";

const ProfileHeader = ({
  user,
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
  renderOwnerMenu,     // JSX للمنيو في صفحة المالك
  renderVisitorMenu    // JSX للمنيو في صفحة الزائر
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 w-full">
      
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-xl cursor-pointer p-1
          ${user?.stories?.length > 0
            ? "border-[5px] border-blue-500 animate-spin-slow"
            : "border-0 border-transparent"}`}
        onClick={!isOwner ? onProfileClick : undefined}
      >
        <div className="w-full h-full rounded-full overflow-hidden relative group">
          <Image
            src={
              image
                ? URL.createObjectURL(image)
                : user?.profilePhoto?.url || "/default-profile.png"
            }
            alt="Profile photo"
            fill
            className="object-cover rounded-full"
          />
          {isOwner && (
            <>
              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <FaCamera className="text-white text-xl" />
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

      {/* User Info */}
      <div className="flex flex-col gap-3 flex-1 w-full">
        
        {/* Username & Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold break-words">
            {user?.username || "Username"}
          </h1>
          {user?.isAccountWithPremiumVerify && (
            <HiBadgeCheck className="text-blue-500 text-xl" title="Verified" />
          )}
          <span onClick={() => setOpenMenu(!openMenu)} className="text-gray-600 dark:text-gray-300"><IoEllipsisHorizontal/></span>
          {/* Owner Menu OR Visitor Menu */}
          {isOwner ? renderOwnerMenu?.() : renderVisitorMenu?.()}
        </div>

        {/* Level & Progress */}
        <div className="w-full sm:max-w-xs">
          <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-1">
              {user?.userLevelRank || "Junior"} <span className="text-lg">🏅</span>
            </span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {user?.userLevelPoints || 0} XP
            </motion.span>
          </div>

          <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full mt-2 overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(
                  ((user?.userLevelPoints || 0) / (user?.nextLevelPoints || 500)) * 100,
                  100
                )}%`,
              }}
              transition={{ duration: 1.2 }}
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full"
            />
          </div>

          <span className="block text-xs text-gray-500 mt-1 text-right">
            {`Next level in ${Math.max(
              (user?.nextLevelPoints || 500) - (user?.userLevelPoints || 0),
              0
            )} XP`}
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm sm:text-base text-gray-500 max-w-xs break-words whitespace-pre-wrap">
          {user?.description || "No bio yet."}
        </p>

        {/* Actions */}
        {isOwner ? (
          <div className="flex gap-3 flex-wrap mt-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="flex items-center gap-2 border px-4 sm:px-6 py-2 rounded-xl text-sm font-medium hover:bg-lightMode-hover dark:hover:bg-darkMode-hover hover:shadow-md transition"
            >
              <FaUserEdit /> Edit profile
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onAddStory}
              className="flex items-center gap-2 border px-4 sm:px-6 py-2 rounded-xl text-sm font-medium hover:bg-lightMode-hover dark:hover:bg-darkMode-hover hover:shadow-md transition"
            >
              <IoAdd /> Add story
            </motion.button>
          </div>
        ) : (
          <div className="flex gap-3 mt-4 relative w-fit">
            <button
              onClick={isFollowing ? onUnfollow : onFollow}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl border text-sm font-medium transition-all duration-300
                ${isFollowing
                  ? "text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  : "text-green-600 border-green-600 hover:bg-green-600 hover:text-white"}`}
            >
              {isFollowing ? <RiUserUnfollowLine /> : <RiUserFollowLine />}
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        )}

        {/* Stats */}
        {canSeePrivateContent && (
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-6 sm:gap-10 mt-4 w-full">
            <StatBlock label="Posts" value={user?.posts?.length} />
            <StatBlock label="Followers" value={user?.followers?.length} onClick={onShowFollowers} />
            <StatBlock label="Following" value={user?.following?.length} onClick={onShowFollowing} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
