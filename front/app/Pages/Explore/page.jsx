// page.jsx (صفحة Explore)
'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNews } from '@/app/Context/NewsContext';
import { usePost } from '@/app/Context/PostContext';
// import { filterHashtags } from '@/app/utils/filterHashtags'; // لم يعد مطلوباً هنا
import DesignExplore from './DesignExplore';
import { useUser } from '@/app/Context/UserContext';
import { useGetData } from '@/app/Custome/useGetData';
// استيراد الـHook الجديد
import { useSearchLogic } from '../../Custome/useSearchLogic'; // افترض المسار الصحيح

const Search = () => {
  const { users, user } = useAuth();
  const { suggestedUsers } = useUser();
  const { news } = useNews();
  const { posts } = usePost();
  
  // 1. استخدام useSearchLogic لفصل منطق البحث
  const { search, setSearch, searchResults, topHashtags } = useSearchLogic('', users, posts);

  // 2. إبقاء المنطق غير المتعلق بالبحث المباشر هنا (مثل حساب التبويبات)
  const {userData} = useGetData(user?._id)
  
  // --- المنطق المتعلق بالتبويبات والمستخدمين المقترحين يبقى كما هو ---
  
  const suggestedUsersArr = useMemo(() => {
    if (!Array.isArray(suggestedUsers)) return [];
    return suggestedUsers.slice(0, 8);
  }, [suggestedUsers, user]);

  const userInterests = userData?.interests?.filter(Boolean).slice(0, 2) || [];
  const interestTabs = userInterests
    .map((interest) => {
      const relatedNews = news.filter(item =>
        item.title.toLowerCase().includes(interest.toLowerCase())
      );
      return relatedNews.length > 0 ? { name: interest, news: relatedNews } : null;
    })
    .filter(Boolean);

  const finalTabs = [{ name: 'News', news }].concat(interestTabs);

  // 3. حالة التبويب النشط تبقى هنا
  const [activeTab, setActiveTab] = useState('News');


  // 4. دالة عرض واجهة Explore
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
      // تمرير Suggested Users إذا كنت تخطط لعرضهم في Explore
      suggestedUsersArr={suggestedUsersArr} 
      posts={posts}
    />
  );
};

export default Search;