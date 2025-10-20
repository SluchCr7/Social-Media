'use client';
import React, { useMemo, useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';

// استيراد المكونات الفرعية الجديدة
import ExploreHeader from '../../Component/Explore/ExploreHeader';
import ExploreSearchBar from '../../Component/Explore/ExploreSearchBar';
import SearchResults from '../../Component/Explore/SearchResults';
import ExploreTabs from '../../Component/Explore/ExploreTabs';
import TabContentWrapper from '../../Component/Explore/TabContentWrapper';
import TrendingTabContent from '../../Component/Explore/TrendingTabContent';
import HashtagsTabContent from '../../Component/Explore/HashtagsTabContent';
import PhotosTabContent from '../../Component/Explore/PhotosTabContent';
import DefaultTabContent from '../../Component/Explore/DefaultTabContent'; // للتبويبات الافتراضية

// --- دوال المساعدة / Hooks ---

// نقل دالة الفلترة الزمنية والفرز إلى خارج المكون لتبسيطه
const useTrendingPosts = (trendingPosts, timeFilter) => {
    const withinTimeFilter = (post) => {
        if (!post?.createdAt) return false;
        const created = new Date(post.createdAt);
        const now = new Date();
        const diff = now - created;

        if (timeFilter === 'today') {
            return diff <= 1000 * 60 * 60 * 24; // 24 ساعة
        } else {
            return diff <= 1000 * 60 * 60 * 24 * 7; // 7 أيام
        }
    };

    const trendingToShow = useMemo(() => {
        return (trendingPosts || [])
            .filter(withinTimeFilter)
            .map(p => {
                // حساب score بسيط
                const likes = Array.isArray(p?.likes) ? p?.likes.length : (p?.likes || 0);
                const comments = Array.isArray(p?.comments) ? p?.comments.length : (p?.comments || 0);
                const shares = p?.shares || 0;
                const views = p?.views || 0;
                const score = likes * 2 + comments * 3 + shares * 5 + views * 0.1;
                return { ...p, score };
            })
            .sort((a, b) => b.score - a.score);
    }, [trendingPosts, timeFilter]);
    
    return trendingToShow;
}

// دالة مساعدة لاستخراج صور المتابعين
const useFollowingPhotos = (user) => {
    return useMemo(() => {
        return user?.following?.flatMap(f =>
            f.posts?.flatMap(p => p?.Photos?.filter(m => m.type === 'image') || []) || []
        ) || [];
    }, [user]);
}


const DesignExplore = ({
    search, setSearch, searchResults, activeTab, setActiveTab,
    finalTabs, topHashtags, user, trendingPosts = []
}) => {
    const { t } = useTranslation();
    const [timeFilter, setTimeFilter] = useState('today');

    // استخدام الهوك الجديد للمنطق
    const trendingToShow = useTrendingPosts(trendingPosts, timeFilter);
    const followingPhotos = useFollowingPhotos(user);
    
    // جميع التبويبات المتاحة
    const allTabs = useMemo(() => 
        finalTabs.concat([{ name: 'Trending' }, { name: 'Hashtags' }, { name: 'Photos' }])
    , [finalTabs]);


    return (
        <div className="w-full min-h-screen px-4 sm:px-8 py-8 
          bg-lightMode-bg dark:bg-darkMode-bg 
          text-lightMode-text dark:text-darkMode-text transition">

            {/* 1. Header */}
            <ExploreHeader t={t} icon={IoIosSearch} />

            {/* 2. Search Box */}
            <ExploreSearchBar 
                search={search}
                setSearch={setSearch}
                placeholder={t("Search users, #hashtags or posts...")}
            />

            {/* 3. Search Results */}
            <AnimatePresence>
                {search.trim() && (
                    <SearchResults 
                        searchResults={searchResults}
                        searchQuery={search}
                        user={user}
                        t={t}
                    />
                )}
            </AnimatePresence>

            {/* 4. Tabs */}
            <ExploreTabs
                allTabs={allTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* 5. Tab Content */}
            <div className="max-w-3xl mx-auto space-y-4">
                <AnimatePresence mode="wait">
                    {allTabs.map((tab) => (
                        activeTab === tab.name && (
                            <TabContentWrapper key={tab.name}>
                                {tab.name === 'Trending' ? (
                                    <TrendingTabContent 
                                        trendingToShow={trendingToShow}
                                        timeFilter={timeFilter}
                                        setTimeFilter={setTimeFilter}
                                        t={t}
                                    />
                                ) : tab.name === 'Hashtags' ? (
                                    <HashtagsTabContent 
                                        topHashtags={topHashtags}
                                        t={t}
                                    />
                                ) : tab.name === 'Photos' ? (
                                    <PhotosTabContent 
                                        followingPhotos={followingPhotos}
                                        t={t}
                                    />
                                ) : (
                                    // للتبويبات الافتراضية الأخرى
                                    <DefaultTabContent 
                                        news={tab.news}
                                        t={t}
                                    />
                                )}
                            </TabContentWrapper>
                        )
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default DesignExplore;