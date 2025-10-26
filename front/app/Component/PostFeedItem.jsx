'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMessageSquare, FiHeart, FiShare2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PostFeedItem = ({ post, t, isPreview = false }) => {
    // isPreview تُستخدم في تبويب "Top" لتصغير العرض قليلاً
    const linkPath = `/Pages/Post/${post._id}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-lightMode-menu dark:bg-darkMode-menu rounded-xl shadow-lg border dark:border-darkMode-border p-4 sm:p-5"
        >
            {/* Header (User Info) */}
            <Link href={`/Pages/User/${post.owner?._id}`} className="flex items-center mb-4 hover:opacity-80 transition">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <Image
                        width={40}
                        height={40}
                        src={post.owner?.profilePhoto?.url || "/default-avatar.png"}
                        alt={post.owner?.username || "User"}
                        className="rounded-full w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-base text-lightMode-text dark:text-darkMode-text truncate">
                        {post.owner?.username || t("Unknown User")}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        @{post.owner?.profileName || "user"} • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </Link>

            {/* Post Content */}
            <Link href={linkPath} className="block group">
                <p className={`text-sm sm:text-base text-lightMode-text dark:text-darkMode-text ${isPreview ? 'line-clamp-3' : ''} mb-3`}>
                    {post.text || t("Untitled Post")}
                </p>

                {/* Media (Images/Videos) */}
                {Array.isArray(post.Photos) && post.Photos.length > 0 && (
                    <div className="mt-3 rounded-lg overflow-hidden max-h-96 w-full relative">
                        <Image 
                            src={post.Photos[0].url} 
                            alt="Post media" 
                            width={500}
                            height={300}
                            className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                    </div>
                )}
            </Link>

            {/* Actions/Footer */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t dark:border-gray-700">
                <div className="flex space-x-6 text-gray-500 dark:text-gray-400">
                    {/* Comments */}
                    <div className="flex items-center hover:text-blue-500 transition cursor-pointer">
                        <FiMessageSquare size={18} className="mr-1" />
                        <span className="text-sm">{post.comments?.length || 0}</span>
                    </div>
                    {/* Likes */}
                    <div className="flex items-center hover:text-red-500 transition cursor-pointer">
                        <FiHeart size={18} className="mr-1" />
                        <span className="text-sm">{post.likes?.length || 0}</span>
                    </div>
                </div>
                
                <button className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition">
                    <FiShare2 size={18} />
                </button>
            </div>
        </motion.div>
    );
}

export default PostFeedItem;