// ملف: Explore/TrendingTabContent.jsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const TrendingPostCard = ({ post, idx, t }) => {
    const media = post.media || (post.Photos ? post.Photos[0] : null);
    const likes = Array.isArray(post.likes) ? post.likes.length : (post.likes || 0);
    const comments = Array.isArray(post.comments) ? post.comments.length : (post.comments || 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="bg-lightMode-menu dark:bg-darkMode-menu rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
        >
            <Link href={`/Pages/Post/${post._id}`}>
                <div className="w-full h-44 md:h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {/* منطق عرض الوسائط: فيديو أو صورة أو لا يوجد عرض مسبق */}
                    {media ? (
                        media.type === 'video' ? (
                            <video
                                src={media.url}
                                poster={media.poster || ''}
                                controls={false}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                            />
                        ) : (
                            <Image
                                src={media.url}
                                alt={post.title || 'media'}
                                width={800}
                                height={600}
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-sm text-lightMode-text2 dark:text-darkMode-text2">
                            {t("No preview")}
                        </div>
                    )}
                </div>

                {/* تفاصيل المنشور */}
                <div className="p-3">
                    <div className="flex items-center gap-3 mb-2">
                        {/* صورة الملف الشخصي */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                            <Image
                                src={post.owner?.profilePhoto?.url || '/default-avatar.png'}
                                alt={post.owner?.username || 'author'}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{post.title || post?.owner?.username}</p>
                            <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2 truncate">
                                @{post.owner?.profileName} · {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-lightMode-text2 dark:text-darkMode-text2 line-clamp-2 mb-3">
                        {post.text || ''}
                    </p>
                    <div className="flex items-center justify-between text-xs text-lightMode-text2 dark:text-darkMode-text2">
                        <div className="flex items-center gap-3">
                            <span>❤️ {likes}</span>
                            <span>💬 {comments}</span>
                        </div>
                        <div className="text-xs">
                            {t("Score")} {Math.round(post.score || 0)}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};


const TrendingTabContent = ({ trendingToShow, timeFilter, setTimeFilter, t }) => {
    return (
        <>
            {/* Time filter controls */}
            <div className="flex items-center gap-3 justify-end">
                <div className="inline-flex rounded-xl bg-lightMode-menu dark:bg-darkMode-menu p-1">
                    <button
                        onClick={() => setTimeFilter('today')}
                        className={`px-3 py-1 rounded-lg font-medium text-sm transition ${
                            timeFilter === 'today' ? 'bg-indigo-600 text-white shadow' : 'text-lightMode-text2 dark:text-darkMode-text2'
                        }`}
                    >
                        {t("Today")}
                    </button>
                    <button
                        onClick={() => setTimeFilter('week')}
                        className={`px-3 py-1 rounded-lg font-medium text-sm transition ${
                            timeFilter === 'week' ? 'bg-indigo-600 text-white shadow' : 'text-lightMode-text2 dark:text-darkMode-text2'
                        }`}
                    >
                        {t("This Week")}
                    </button>
                </div>
            </div>

            {/* Mixed content grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {trendingToShow.length > 0 ? trendingToShow.map((post, idx) => (
                    <TrendingPostCard key={post._id || idx} post={post} idx={idx} t={t} />
                )) : (
                    <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-8 col-span-full">
                        {t("No trending content for the selected timeframe.")}
                    </p>
                )}
            </div>
        </>
    );
}

export default TrendingTabContent;