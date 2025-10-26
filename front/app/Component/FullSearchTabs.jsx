'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// *** المكونات المطلوبة (يجب التأكد من وجودها)
import ExploreTabs from './Explore/ExploreTabs'; 
import UserCard from './UserCard'; // المكون الجديد لبطاقات المستخدمين التفصيلية
import PostFeedItem from './PostFeedItem'; // يُفترض وجود هذا المكون لعرض المنشورات بشكل كامل
import SluchitEntry from './SluchitEntry';

const TABS = (t) => [
    { name: t("Top"), key: 'top' }, 
    { name: t("Users"), key: 'users' },
    { name: t("Posts"), key: 'posts' },
    { name: t("Media"), key: 'media' },
    { name: t("Hashtags"), key: 'hashtags' },
];

const FullSearchTabs = ({ searchResults, searchQuery, user, t }) => {
    const [activeTab, setActiveTab] = useState(TABS(t)[0].key);

    const { users, hashtags, posts } = searchResults;

    // تجهيز بيانات تبويب "الأعلى" (Top) - مزيج من أهم 5 نتائج من كل فئة
    const topResults = useMemo(() => {
        return {
            users: users.slice(0, 5), 
            hashtags: hashtags.slice(0, 5),
            posts: posts.slice(0, 5), 
        };
    }, [users, hashtags, posts]);
    
    // فلترة المنشورات لتبويب "الوسائط" (Media)
    const mediaPosts = useMemo(() => 
        posts.filter(p => p.mediaType === 'image' || (Array.isArray(p.Photos) && p.Photos.length > 0))
    , [posts]);

    const CurrentContent = () => {
        if (!searchQuery.trim()) {
            return null;
        }

        switch (activeTab) {
            case 'top':
                return (
                    <div className="space-y-8 p-4 bg-lightMode-menu dark:bg-darkMode-menu rounded-xl shadow-lg">
                        {topResults.users.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 border-b pb-2 text-indigo-600 dark:text-indigo-400">{t("Top Users")}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {topResults.users.map((u) => (
                                        <UserCard key={u._id} user={u} t={t} isCompact={true} /> 
                                    ))}
                                </div>
                            </div>
                        )}
                        {topResults.posts.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 border-b pb-2 text-indigo-600 dark:text-indigo-400">{t("Latest Posts")}</h3>
                                <div className="space-y-4">
                                    {topResults.posts.map((p) => (
                                        // عرض مصغر للمنشورات
                                        <PostFeedItem key={p._id} post={p} t={t} isPreview={true} /> 
                                    ))}
                                </div>
                            </div>
                        )}
                         {topResults.hashtags.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 border-b pb-2 text-indigo-600 dark:text-indigo-400">{t("Trending Hashtags")}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {topResults.hashtags.map((h) => (
                                        <Link
                                            key={h.tag}
                                            href={`/Pages/Hashtag/${encodeURIComponent(h.tag)}`}
                                            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium hover:opacity-80 transition"
                                        >
                                            #{h.tag} ({h.count})
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {topResults.users.length === 0 && topResults.posts.length === 0 && topResults.hashtags.length === 0 && (
                            <p className="text-center text-gray-500 py-4">{t("No top results found.")}</p>
                        )}
                    </div>
                );

            case 'users':
                // عرض المستخدمين بطاقات كبيرة (UserCard)
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {users.length > 0 ? (
                            users.map((u) => (
                                <UserCard key={u._id} user={u} t={t} isCompact={false} /> 
                            ))
                        ) : (
                            <p className="md:col-span-2 text-center text-gray-500 p-10 border dark:border-darkMode-border rounded-xl">{t("No users found matching your query.")}</p>
                        )}
                    </div>
                );
            
            case 'posts':
                // عرض المنشورات بالكامل كـ Feed (PostFeedItem)
                return (
                    <div className="space-y-6">
                        {posts.length > 0 ? (
                            posts.map((p) => (
                                <PostFeedItem key={p._id} post={p} t={t} /> 
                            ))
                        ) : (
                            <p className="text-center text-gray-500 p-10 border dark:border-darkMode-border rounded-xl">{t("No posts found matching your query.")}</p>
                        )}
                    </div>
                );

            case 'media':
                 // عرض المنشورات التي تحتوي على وسائط فقط
                 return (
                    <div className="space-y-6">
                        {mediaPosts.length > 0 ? (
                            mediaPosts.map((p) => (
                                <PostFeedItem key={p._id} post={p} t={t} /> 
                            ))
                        ) : (
                            <p className="text-center text-gray-500 p-10 border dark:border-darkMode-border rounded-xl">{t("No media posts found matching your query.")}</p>
                        )}
                    </div>
                );

            case 'hashtags':
                // عرض الهاشتاجات بشكل قائمة كبيرة
                return (
                    <div className="max-w-xl mx-auto space-y-3 p-4 bg-lightMode-menu dark:bg-darkMode-menu rounded-xl shadow-lg">
                        {hashtags.length > 0 ? (
                            hashtags.map((h, index) => (
                                <Link 
                                    key={index} 
                                    href={`/Pages/Hashtag/${encodeURIComponent(h.tag)}`} 
                                    className="flex justify-between items-center p-3 hover:bg-lightMode-bg dark:hover:bg-darkMode-bg rounded-lg transition border-b dark:border-darkMode-border last:border-b-0"
                                >
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">#{h.tag}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        {h.count} {t("posts")}
                                    </p>
                                </Link>
                            ))
                        ) : (
                             <p className="text-center text-gray-500 py-4">{t("No hashtags found matching your query.")}</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    }


    return (
        <div className="w-full">
            {/* 1. شريط التبويبات الثابت (Sticky Tabs) */}
            <div className="sticky top-0 z-20 bg-lightMode-bg dark:bg-darkMode-bg border-b dark:border-darkMode-border mb-6">
                <ExploreTabs 
                    tabs={TABS(t)} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                />
            </div>

            {/* 2. عرض المحتوى مع حركة انتقال احترافية */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                >
                    <CurrentContent />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FullSearchTabs;