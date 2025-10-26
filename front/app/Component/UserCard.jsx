'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiCheckCircle, FiMapPin, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

const UserCard = ({ user, t, isCompact = false }) => {
    const followerCount = user.followers?.length || 0;
    
    // تصميم البطاقة يختلف بناءً على isCompact (للتبويب العلوي)
    const cardClass = isCompact 
        ? "p-3 flex items-center bg-lightMode-bg dark:bg-darkMode-bg rounded-lg hover:shadow-md"
        : "p-5 flex flex-col bg-lightMode-bg dark:bg-darkMode-bg rounded-xl shadow-lg border dark:border-darkMode-border hover:border-indigo-500 transition-all duration-300";

    const avatarSize = isCompact ? "w-12 h-12" : "w-16 h-16";
    const nameSize = isCompact ? "text-base" : "text-xl";

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cardClass}
        >
            <Link href={`/Pages/User/${user._id}`} className={`flex ${isCompact ? 'items-center w-full' : 'items-start w-full'}`}>
                {/* 1. الصورة الشخصية */}
                <div className={`${avatarSize} relative flex-shrink-0`}>
                    <Image
                        src={user.profilePhoto?.url || '/default-avatar.png'}
                        alt={`${user.username} profile`}
                        width={64}
                        height={64}
                        className="rounded-full object-cover w-full h-full border-2 border-indigo-500"
                    />
                </div>

                <div className={`flex-grow min-w-0 ${isCompact ? 'ml-3' : 'ml-4'}`}>
                    {/* 2. الاسم واسم المستخدم */}
                    <div className="flex items-center mb-1">
                        <h3 className={`font-bold truncate ${nameSize}`}>{user.username}</h3>
                        {/* أيقونة التوثيق */}
                        {user.isVerified && <FiCheckCircle className="ml-1 text-blue-500" size={16} />}
                    </div>
                    
                    <p className={`text-sm text-gray-500 dark:text-gray-400 ${isCompact ? '' : 'mb-3'}`}>
                        @{user.profileName || 'user'}
                    </p>

                    {/* 3. النبذة (تظهر في الوضع غير المدمج فقط) */}
                    {!isCompact && (
                        <p className="text-sm text-lightMode-text dark:text-darkMode-text line-clamp-2 mt-2">
                            {user.description || t('No bio provided.')}
                        </p>
                    )}
                </div>
            </Link>

            {/* 4. الإجراءات والتفاصيل الإضافية (تظهر في الوضع غير المدمج) */}
            {!isCompact && (
                <div className="mt-4 pt-4 border-t dark:border-darkMode-border flex justify-between items-center w-full">
                    {/* إحصائيات */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                         <span className="flex items-center">
                            <FiUsers size={14} className="mr-1 text-indigo-500" />
                            {followerCount > 1000 ? `${(followerCount / 1000).toFixed(1)}K` : followerCount} {t("Followers")}
                        </span>
                        {user.location && (
                             <span className="flex items-center">
                                <FiMapPin size={14} className="mr-1 text-indigo-500" />
                                {user.location}
                            </span>
                        )}
                    </div>

                    {/* زر المتابعة */}
                    <button 
                        className="px-4 py-2 text-sm font-semibold rounded-full 
                          bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        onClick={() => console.log('Follow clicked for', user.username)}
                    >
                        {t("Follow")}
                    </button>
                </div>
            )}
             {/* 4. زر المتابعة (في الوضع المدمج) */}
            {isCompact && (
                 <button 
                    className="px-3 py-1 text-xs font-semibold rounded-full 
                        bg-indigo-600 text-white hover:bg-indigo-700 transition flex-shrink-0"
                    onClick={() => console.log('Follow clicked for', user.username)}
                >
                    {t("Follow")}
                </button>
            )}
        </motion.div>
    );
}

export default UserCard;