// ملف: Explore/SearchResults.jsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const SearchResults = ({ searchResults, searchQuery, user, t }) => {
    const { users, hashtags, posts } = searchResults;

    const noResults = users.length === 0 && hashtags.length === 0 && posts.length === 0;

    return (
        <motion.div
            key="autocomplete-results"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl mx-auto space-y-4 
              bg-lightMode-menu dark:bg-darkMode-menu 
              rounded-xl shadow-md p-4 mb-6"
        >
            {users.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400">{t("Users")}</h4>
                    {users
                        .filter((u) => u._id !== user?._id)
                        .map((u) => (
                            <Link
                                key={u._id}
                                href={`/Pages/User/${u._id}`}
                                className="flex items-center gap-3 p-2 rounded-lg 
                                  hover:bg-lightMode-bg dark:hover:bg-darkMode-bg transition"
                            >
                                <div className="w-10 h-10 relative">
                                    <div className="w-full h-full rounded-full 
                                        bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
                                        <Image
                                            src={u.profilePhoto?.url || '/default-avatar.png'}
                                            alt="profile"
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover w-10 h-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold 
                                        text-lightMode-text dark:text-darkMode-text">
                                        {u.username}
                                    </span>
                                    <span className="text-xs text-lightMode-text2 dark:text-darkMode-text2 truncate">
                                        {u.profileName || t('No bio')}
                                    </span>
                                </div>
                            </Link>
                        ))}
                </div>
            )}

            {hashtags.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400">{t("Hashtags")}</h4>
                    {hashtags.map(({ tag, count }) => (
                        <Link
                            key={tag}
                            href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                            className="flex justify-between items-center p-2 rounded-lg 
                              hover:bg-lightMode-bg dark:hover:bg-darkMode-bg transition"
                        >
                            <span className="font-medium">#{tag}</span>
                            <span className="text-xs text-lightMode-text2 dark:text-darkMode-text2">{count} {t("posts")}</span>
                        </Link>
                    ))}
                </div>
            )}

            {posts.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-bold mb-3 text-indigo-600 dark:text-indigo-400">
                        {t("Posts")}
                    </h4>

                    <div className="space-y-3">
                        {posts.map((p) => (
                            <Link
                                key={p._id}
                                href={`/Pages/Post/${p._id}`}
                                className="block bg-white dark:bg-darkMode-bg border border-gray-200 dark:border-gray-700 
                                  rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                {/* Header (User Info) */}
                                <div className="flex items-center mb-2">
                                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                        <Image
                                            width={100}
                                            height={100}
                                            src={p.owner?.profilePhoto?.url || "/default-avatar.png"}
                                            alt={p.owner?.username || "User"}
                                            className="w-8 h-8 object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                                            {p.owner?.username || t("Unknown User")}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            @{p.owner?.profileName || "user"}
                                        </span>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3">
                                    {p.text || t("Untitled Post")}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {noResults && (
                <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-4">
                    {t("No results found for")}{' '}
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">{searchQuery}</span>
                </p>
            )}
        </motion.div>
    );
}

export default SearchResults;