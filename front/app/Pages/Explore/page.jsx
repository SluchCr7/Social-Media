'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
  const { explorePosts, trendingPosts, trendingHashtags, loading: exploreLoading } = useExplore();
  const { searchQuery, setSearchQuery, searchResults } = useSearch();

  // User data from hook - ensures we have refreshed user data
  const { userData, loading: userLoading } = useGetData(user?._id);

  // -------------------------------
  // 🧩 Suggested Users (Memoized)
  // -------------------------------
  const suggestedUsersArr = useMemo(() => {
    if (!Array.isArray(suggestedUsers)) return [];
    return suggestedUsers.slice(0, 12); // Increased for better fill
  }, [suggestedUsers]);

  // -------------------------------
  // 🔹 Create Interest Tabs
  // -------------------------------
  const interestTabs = useMemo(() => {
    if (!news?.length || !userData?.interests?.length) return [];

    const lowerTitles = news.map(item => ({
      ...item,
      lowerTitle: item.title?.toLowerCase() || '',
    }));

    return userData.interests
      .filter(Boolean)
      .slice(0, 3) // Show top 3 interests
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
    () => [
      { name: 'News', news: news || [] },
      ...interestTabs
    ],
    [news, interestTabs]
  );

  // -------------------------------
  // 🔹 Active Tab State
  // -------------------------------
  const [activeTab, setActiveTab] = useState('Trending'); // Default to Trending for more engagement

  // Update active tab when tabs change if current becomes invalid
  useEffect(() => {
    const defaultTabs = ['Trending', 'Hashtags', 'Photos'];
    const currentTabExists = finalTabs.some(tab => tab.name === activeTab) || defaultTabs.includes(activeTab);

    if (!currentTabExists && finalTabs.length > 0) {
      setActiveTab(finalTabs[0].name);
    }
  }, [finalTabs, activeTab]);

  // Convert trending hashtags to the format expected by components
  const formattedHashtags = useMemo(() => {
    if (!Array.isArray(trendingHashtags)) return [];
    return trendingHashtags.map(h => [h.name, h.count]);
  }, [trendingHashtags]);

  // Handle Search Change with better cleanup
  const handleSearchChange = useCallback((val) => {
    setSearchQuery(val);
  }, [setSearchQuery]);

  // -------------------------------
  // 🧭 Loading State
  // -------------------------------
  // Only block the entire page if we don't have user data at all and it's loading
  if (userLoading && !userData) {
    return <Loading />;
  }

  // -------------------------------
  // 🎨 Main Render
  // -------------------------------
  return (
    <DesignExplore
      user={userData || user} // Fallback to auth user if userData is still fetching
      search={searchQuery}
      setSearch={handleSearchChange}
      searchResults={searchResults}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      finalTabs={finalTabs}
      topHashtags={formattedHashtags}
      trendingPosts={trendingPosts}
      suggestedUsersArr={suggestedUsersArr}
      posts={explorePosts}
      loading={exploreLoading || userLoading}
    />
  );
};

export default ExplorePage;

