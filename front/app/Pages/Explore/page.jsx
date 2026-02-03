'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNews } from '@/app/Context/NewsContext';
import { useExplore } from '@/app/Context/ExploreContext';
import { useSearch } from '@/app/Context/SearchContext';
import DesignExplore from './DesignExplore';
import { useUser } from '@/app/Context/UserContext';
import { useGetData } from '@/app/Custome/useGetData';
import Loading from '@/app/Component/Loading';

const ExplorePage = () => {
  const { user } = useAuth();
  const { suggestedUsers } = useUser();
  const { news } = useNews();

  // Use new contexts
  const { explorePosts, trendingPosts, trendingHashtags, loading: exploreLoading } = useExplore();
  const { searchQuery, setSearchQuery, searchResults } = useSearch();

  // User data from hook
  const { userData, loading: userLoading } = useGetData(user?._id);

  // -------------------------------
  // 🧩 Suggested Users (Memoized)
  // -------------------------------
  const suggestedUsersArr = useMemo(() => {
    if (!Array.isArray(suggestedUsers)) return [];
    return suggestedUsers.slice(0, 8);
  }, [suggestedUsers]);

  // -------------------------------
  // 🔹 Create Interest Tabs
  // -------------------------------
  const interestTabs = useMemo(() => {
    if (!news?.length || !userData?.interests) return [];

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
  // 🔹 Final Tabs (News + Interests)
  // -------------------------------
  const finalTabs = useMemo(
    () => [{ name: 'News', news }, ...interestTabs],
    [news, interestTabs]
  );

  // -------------------------------
  // 🔹 Active Tab State
  // -------------------------------
  const [activeTab, setActiveTab] = useState('News');

  // Update active tab when tabs change
  useEffect(() => {
    if (finalTabs.length > 0 && !finalTabs.find(tab => tab.name === activeTab)) {
      setActiveTab(finalTabs[0].name);
    }
  }, [finalTabs, activeTab]);

  // Convert trending hashtags to the format expected by components
  const formattedHashtags = useMemo(() => {
    return trendingHashtags.map(h => [h.name, h.count]);
  }, [trendingHashtags]);

  // -------------------------------
  // 🧭 Loading State
  // -------------------------------
  if (userLoading || !userData) {
    return <Loading />;
  }

  // -------------------------------
  // 🎨 Main Render
  // -------------------------------
  return (
    <DesignExplore
      user={userData}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchResults={searchResults}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      finalTabs={finalTabs}
      topHashtags={formattedHashtags}
      trendingPosts={trendingPosts}
      suggestedUsersArr={suggestedUsersArr}
      posts={explorePosts}
      loading={exploreLoading}
    />
  );
};

export default ExplorePage;
