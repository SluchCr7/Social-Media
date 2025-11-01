'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNews } from '@/app/Context/NewsContext';
import { usePost } from '@/app/Context/PostContext';
import DesignExplore from './DesignExplore';
import { useUser } from '@/app/Context/UserContext';
import { useGetData } from '@/app/Custome/useGetData';
import { useSearchLogic } from '../../Custome/useSearchLogic'; // Hook البحث

// ==============================
// 🔹 المكون الرئيسي
// ==============================
const Search = () => {
  const { users, user } = useAuth();
  const { suggestedUsers } = useUser();
  const { news } = useNews();
  const { posts } = usePost();

  // 🧠 منطق البحث المفصول في hook مستقل
  const { search, setSearch, searchResults, topHashtags } = useSearchLogic('', users, posts);

  // 🔹 بيانات المستخدم الكاملة من الـ Hook المخصص
  const { userData } = useGetData(user?._id);

  // -------------------------------
  // 🧩 المستخدمون المقترحون (Memoized)
  // -------------------------------
  const suggestedUsersArr = useMemo(() => {
    if (!Array.isArray(suggestedUsers)) return [];
    return suggestedUsers.slice(0, 8);
  }, [suggestedUsers]);

  // -------------------------------
  // 🔹 إنشاء تبويبات الاهتمامات للمستخدم (Interest Tabs)
  // -------------------------------
  const interestTabs = useMemo(() => {
    if (!news?.length || !userData?.interests) return [];

    // نحول العناوين إلى lowercase مرة واحدة فقط لتحسين الأداء
    const lowerTitles = news.map(item => ({
      ...item,
      lowerTitle: item.title.toLowerCase(),
    }));

    return userData.interests
      .filter(Boolean)
      .slice(0, 2)
      .map((interest) => {
        const interestLower = interest.toLowerCase();
        const relatedNews = lowerTitles.filter(item =>
          item.lowerTitle.includes(interestLower)
        );
        return relatedNews.length > 0 ? { name: interest, news: relatedNews } : null;
      })
      .filter(Boolean);
  }, [news, userData?.interests]);

  // -------------------------------
  // 🔹 التبويب الأساسي (الأخبار) + الاهتمامات
  // -------------------------------
  const finalTabs = useMemo(
    () => [{ name: 'News', news }, ...interestTabs],
    [news, interestTabs]
  );

  // -------------------------------
  // 🔹 حالة التبويب النشط
  // -------------------------------
  const [activeTab, setActiveTab] = useState('News');

  // -------------------------------
  // 🧭 شرط التحميل المبدئي لتجنب مشاكل البيانات الناقصة
  // -------------------------------
  if (!userData) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-lg text-gray-500 dark:text-gray-300">
        <div className="animate-pulse">Loading Explore...</div>
      </div>
    );
  }

  // -------------------------------
  // 🎨 واجهة العرض الرئيسية (تمرير كل القيم لـ DesignExplore)
  // -------------------------------
  return (
    <DesignExplore
      user={userData}
      search={search}
      setSearch={setSearch}
      searchResults={searchResults}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      finalTabs={finalTabs}
      topHashtags={topHashtags}
      trendingPosts={posts}
      suggestedUsersArr={suggestedUsersArr}
      posts={posts}
    />
  );
};

export default Search;
