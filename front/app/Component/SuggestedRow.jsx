'use client';
import React from "react";
import Image from "next/image";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
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

const SuggestionCard = ({ item, type, delay }) => {
  const { joinToCommunity } = useCommunity();
  const { user } = useAuth();
  const { followUser } = useUser();
  const { t } = useTranslation();
    const {userData} = useGetData(user?._id)
  const isUserType = type === "user";
  const isFollowingOrMember = isContained(
    isUserType ? item.followers : item.members,
    userData?._id
  );
  const isOwner = !isUserType && item?.owner?._id === userData?._id;

  const hrefPath = isUserType ? `/Pages/User/${item?._id}` : `/Pages/Community/${item?._id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      className="relative group bg-white/60 dark:bg-gray-900/60 
                 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/70 
                 rounded-3xl p-6 shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]
                 transition-all duration-500 overflow-hidden"
    >
      {/* 💫 خلفية متوهجة */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 blur-3xl"
           style={{
             background: isUserType
               ? "linear-gradient(135deg, #3b82f6, #9333ea)"
               : "linear-gradient(135deg, #10b981, #3b82f6)"
           }} />

      <Link href={hrefPath} className="relative z-10 block">
        {/* 🖼️ الصورة */}
        <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-[3px] border-white/20 shadow-xl bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
          {item?.profilePhoto?.url || item?.Picture?.url ? (
            <Image
              src={item?.profilePhoto?.url || item?.Picture?.url}
              alt={item?.username || item?.Name || "Profile"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-gray-200">
              {item?.username?.[0]?.toUpperCase() || item?.Name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        {/* ✨ الاسم والمعلومات */}
        <div className="text-center mt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition">
            {item?.username || item?.Name || "Unnamed"}
          </h3>
          {isUserType && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              @{item?.profileName || "guest"}
            </p>
          )}
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
            {item?.description ||
              (isUserType
                ? t("This user hasn’t written a bio yet.")
                : t("Join our community and start engaging."))}
          </p>
        </div>
      </Link>

      {/* 🔹 الإحصائيات */}
      <div className="relative z-10 flex justify-center gap-5 mt-5 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
        {isUserType ? (
          <span className="flex items-center gap-1">
            👥 {item?.followers?.length || 0} {t("Followers")}
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1">
              👥 {item?.members?.length || 0} {t("Members")}
            </span>
            <span className="flex items-center gap-1">
              📝 {item?.postsCount || 0} {t("Posts")}
            </span>
          </>
        )}
      </div>

      {/* 🚀 الزر */}
      {!isOwner && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            isUserType ? followUser(item._id) : joinToCommunity(item._id)
          }
          className={`relative z-10 mt-5 w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-md
            ${isFollowingOrMember
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-red-50 hover:text-red-500'
              : isUserType
              ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
              : 'text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
            }`}
        >
          {isUserType ? (
            isFollowingOrMember ? (
              <>
                <FiUserCheck size={16} className="text-green-500" />
                {t("Unfollow")}
              </>
            ) : (
              <>
                <FiUserPlus size={16} />
                {t("Follow")}
              </>
            )
          ) : (
            isFollowingOrMember ? (
              <>{t("Left")}</>
            ) : (
              <>
                <Users size={16} />
                {t("Join")}
              </>
            )
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

export const SuggestionRow = ({ type, data }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        {t("No suggestions available at the moment.")}
      </div>
    );
  }

  return (
    <div className="w-[95%] md:w-full mx-auto grid gap-8 grid-cols-[repeat(auto-fit,minmax(260px,1fr))] py-6">
      {data.map((item, idx) => (
        <SuggestionCard
          key={item?._id || idx}
          item={item}
          type={type}
          delay={idx * 0.1}
        />
      ))}
    </div>
  );
};

export default SuggestionRow;
