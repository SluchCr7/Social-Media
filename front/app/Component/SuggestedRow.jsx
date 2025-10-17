// 'use client'
// import React from "react";
// import Image from "next/image";
// import { FiUserPlus } from "react-icons/fi";
// import { Users } from "lucide-react";
// import { motion } from "framer-motion";
// import { useCommunity } from "../Context/CommunityContext";
// import { useAuth } from "../Context/AuthContext";
// import { useUser } from "../Context/UserContext";
// import { useTranslate } from "../Context/TranslateContext";
// import { useTranslation } from "react-i18next";

// export const SuggestionRow = ({ type, data }) => {
//   const { joinToCommunity } = useCommunity();
//   const {  user } = useAuth(); // تأكد أن لديك user من context
//   const {followUser} = useUser()
//   const {t} = useTranslation()
//   if (!data || data.length === 0) return null;
//   return (
//     <div className="w-full grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
//       {data.map((item, idx) => {
//         const isUserType = type === "user";
//         const isFollowing =
//           isUserType &&
//           item?.followers?.some(
//             (f) => f?._id?.toString() === user?._id?.toString() || f?.toString() === user?._id?.toString()
//           );
        
//         const isMember =
//           !isUserType &&
//           item?.members?.some(
//             (m) => m?._id?.toString() === user?._id?.toString() || m?.toString() === user?._id?.toString()
//           );
//         const isOwner = !isUserType && item?.owner?._id === user?._id;

//         return (
//           <motion.div
//             key={item?._id || item.id || idx}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: idx * 0.1 }}
//             className="flex flex-col justify-between bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 group hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
//           >
//             {/* الصورة */}
//             <div className="relative w-24 h-24 mx-auto rounded-full p-[3px] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 shadow-md group-hover:scale-105 transition-transform duration-300">
//               {item?.profilePhoto?.url || item?.Picture?.url ? (
//                 <Image
//                   src={item?.profilePhoto?.url || item?.Picture?.url}
//                   alt={item?.username || item?.Name || "Profile"}
//                   width={96}
//                   height={96}
//                   className="rounded-full object-cover w-full h-full"
//                 />
//               ) : (
//                 <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-gray-300">
//                   {item?.username?.[0] || item?.Name?.[0] || "?"}
//                 </div>
//               )}
//               <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-md">
//                 {isUserType ? `${t("User")}` : `${t("Community")}`}
//               </span>
//             </div>

//             {/* المحتوى */}
//             <div className="mt-4 flex-1 flex flex-col justify-between text-center">
//               <div>
//                 <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">
//                   {item?.username || item?.Name || "Unnamed"}
//                 </h3>
//                 {isUserType && (
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                     @{item?.profileName || "guest"}
//                   </p>
//                 )}
//                 <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mt-3 leading-relaxed">
//                   {item?.description ||
//                     (isUserType
//                       ? "This user hasn’t written a bio yet."
//                       : "Join our community and start engaging.")}
//                 </p>
//               </div>

//               {/* معلومات إضافية */}
//               <div className="flex justify-center items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-3">
//                 {isUserType ? (
//                   <span>👥 {item?.followers?.length || 0} Followers</span>
//                 ) : (
//                   <span>👥 {item?.members?.length || 0} Members</span>
//                 )}
//               </div>

//               {/* الأزرار أو النص البديل */}
//               {!isOwner && (
//                 <>
//                   {isUserType ? (
//                     isFollowing ? (
//                       <div className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
//                         ✅ {t("Following")}
//                       </div>
//                     ) : (
//                       <motion.button
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => followUser(item._id)}
//                         className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium text-white shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500"
//                       >
//                         <FiUserPlus size={16} /> {t("Follow")}
//                       </motion.button>
//                     )
//                   ) : isMember ? (
//                     <div className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
//                       ✅ {t("Joined")}
//                     </div>
//                   ) : (
//                     <motion.button
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => joinToCommunity(item._id)}
//                       className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium text-white shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-blue-500"
//                     >
//                       <Users size={16} /> {t("Join")}
//                     </motion.button>
//                   )}
//                 </>
//               )}
//             </div>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// };

// export default SuggestionRow;

// SuggestionRow.jsx - الكود المحدّث مع فصل اللوجيك وتحسين التصميم

'use client'
import React from "react";
import Image from "next/image";
import { FiUserPlus, FiUserCheck } from "react-icons/fi"; // ✨ أيقونة جديدة
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { useCommunity } from "../Context/CommunityContext";
import { useAuth } from "../Context/AuthContext";
import { useUser } from "../Context/UserContext";
import { useTranslation } from "react-i18next";
import Link from "next/link"; // ✨ إضافة Link للتنقل

// ✨ وظيفة مساعدة لفحص العضوية أو المتابعة
const isContained = (list, userId) => {
    if (!list || !userId) return false;
    const userIdStr = userId.toString();
    return list.some(item => 
        (item?._id?.toString() === userIdStr) || (item?.toString() === userIdStr)
    );
};

// **[جديد]** مكون البطاقة المفصولة لتحسين وضوح الكود
const SuggestionCard = ({ item, type, delay }) => {
    const { joinToCommunity } = useCommunity();
    const { user } = useAuth();
    const { followUser } = useUser();
    const { t } = useTranslation();

    const isUserType = type === "user";
    const isFollowingOrMember = isContained(
        isUserType ? item.followers : item.members, 
        user?._id
    );
    const isOwner = !isUserType && item?.owner?._id === user?._id;
    
    // ✨ تحديد المسار للملف الشخصي أو المجتمع
    const hrefPath = isUserType ? `/profile/${item?._id}` : `/community/${item?._id}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay }}
            className="flex flex-col justify-between bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 group 
                       hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300"
        >
            <Link href={hrefPath} className="text-center block">
                {/* ✨ الصورة مع الإطار المتوهج */}
                <div className="relative w-24 h-24 mx-auto rounded-full p-[3px] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 shadow-md group-hover:scale-105 transition-transform duration-300">
                    {item?.profilePhoto?.url || item?.Picture?.url ? (
                        <Image
                            src={item?.profilePhoto?.url || item?.Picture?.url}
                            alt={item?.username || item?.Name || "Profile"}
                            width={96}
                            height={96}
                            className="rounded-full object-cover w-full h-full border-4 border-white dark:border-gray-900" // لإبراز الصورة
                        />
                    ) : (
                        <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-gray-300">
                            {item?.username?.[0] || item?.Name?.[0] || "?"}
                        </div>
                    )}
                    <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-lg">
                        {isUserType ? `${t("User")}` : `${t("Community")}`}
                    </span>
                </div>

                {/* ✨ المحتوى الأساسي */}
                <div className="mt-4 flex-1 flex flex-col justify-between text-center">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg hover:text-blue-600 transition truncate">
                            {item?.username || item?.Name || "Unnamed"}
                        </h3>
                        {isUserType && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                @{item?.profileName || "guest"}
                            </p>
                        )}
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mt-3 leading-relaxed">
                            {item?.description || (isUserType ? t("This user hasn’t written a bio yet.") : t("Join our community and start engaging."))}
                        </p>
                    </div>

                    {/* ✨ معلومات إضافية مُحسّنة */}
                    <div className="flex justify-center items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                        {isUserType ? (
                            <span className="flex items-center gap-1">👥 {item?.followers?.length || 0} {t("Followers")}</span>
                        ) : (
                            <>
                                <span className="flex items-center gap-1">👥 {item?.members?.length || 0} {t("Members")}</span>
                                {/* افتراض وجود postsCount */}
                                <span className="flex items-center gap-1"># {item?.postsCount || 0} {t("Posts")}</span>
                            </>
                        )}
                    </div>
                </div>
            </Link>

            {/* ✨ الأزرار القابلة للعكس (Toggleable Buttons) */}
            {!isOwner && (
                <div className="mt-5 w-full">
                    {isUserType ? (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => followUser(item._id)}
                            className={`w-full py-2.5 rounded-xl text-sm font-medium shadow-md transition flex items-center justify-center gap-2 
                                ${isFollowingOrMember
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-red-500'
                                    : 'text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                                }`}
                        >
                            {isFollowingOrMember ? (
                                <><FiUserCheck size={16} className="text-green-500" /> {t("Following")}</>
                            ) : (
                                <><FiUserPlus size={16} /> {t("Follow")}</>
                            )}
                        </motion.button>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => joinToCommunity(item._id)}
                            className={`w-full py-2.5 rounded-xl text-sm font-medium shadow-md transition flex items-center justify-center gap-2 
                                ${isFollowingOrMember
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-red-500'
                                    : 'text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                                }`}
                        >
                            {isFollowingOrMember ? (
                                <>{t("Joined")}</>
                            ) : (
                                <><Users size={16} /> {t("Join")}</>
                            )}
                        </motion.button>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export const SuggestionRow = ({ type, data }) => {
    // ... (Logics can be simplified now)
    const {t} = useTranslation()

    if (!data || data.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                {t("No suggestions available at the moment.")}
            </div>
        );
    }
    
    return (
        <div className="w-full grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {data.map((item, idx) => (
                <SuggestionCard 
                    key={item?._id || item.id || idx}
                    item={item}
                    type={type}
                    delay={idx * 0.1}
                />
            ))}
        </div>
    );
};

export default SuggestionRow;