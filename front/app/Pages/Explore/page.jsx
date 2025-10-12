'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNews } from '@/app/Context/NewsContext';
import { usePost } from '@/app/Context/PostContext';
import { filterHashtags } from '@/app/utils/filterHashtags';
import DesignExplore from './DesignExplore';
import { useUser } from '@/app/Context/UserContext';

const Search = () => {
  const { users, user } = useAuth();
  const {suggestedUsers} = useUser()
  const { news } = useNews();
  const { posts } = usePost();

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState({
    users: [],
    hashtags: [],
    posts: []
  });
  const [activeTab, setActiveTab] = useState('News');

  // Collect all hashtags from posts
  const hashtagCount = {};
  filterHashtags(posts, hashtagCount);
  const topHashtags = Object.entries(hashtagCount).sort((a, b) => b[1] - a[1]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!search.trim()) {
        setSearchResults({ users: [], hashtags: [], posts: [] });
        return;
      }

      // Hashtags search if starts with #
      if (search.startsWith('#')) {
        const query = search.slice(1).toLowerCase();
        const filteredTags = topHashtags.filter(([tag]) =>
          tag.toLowerCase().includes(query)
        );
        setSearchResults({
          users: [],
          hashtags: filteredTags.map(([tag, count]) => ({ tag, count })),
          posts: []
        });
      } else {
        // Users
        const filteredUsers = Array.isArray(users)
          ? users.filter(
              (u) =>
                u.username.toLowerCase().includes(search.toLowerCase()) ||
                (u.profileName &&
                  u.profileName.toLowerCase().includes(search.toLowerCase()))
            )
          : [];

        // Posts
        const filteredPosts = Array.isArray(posts)
          ? posts.filter(
              (p) =>
                (p.text && p.text.toLowerCase().includes(search.toLowerCase())) ||
                (p.Hashtags && p.Hashtags.some(tag => tag.toLowerCase().includes(searchLower))) ||
                (p.owner?.username && p.owner.username.toLowerCase().includes(searchLower)) ||
                (p.owner?.interests && p.owner.interests.some(interest => interest.toLowerCase().includes(searchLower))) ||
                (p.community?.Name && p.community.Name.toLowerCase().includes(searchLower))
                (p.community?.tags && p.community.tags.some(tag => tag.toLowerCase().includes(searchLower)))
            )
          : [];

        setSearchResults({
          users: filteredUsers,
          hashtags: [],
          posts: filteredPosts
        });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [search, users, posts, topHashtags]);

  // Suggested Users
  const suggestedUsersArr = useMemo(() => {
    if (!Array.isArray(suggestedUsers)) return [];
    return suggestedUsers.slice(0, 8);
  }, [suggestedUsers, user]);

  // ----------------- INTEREST BASED NEWS -----------------
  const userInterests = user?.interests?.filter(Boolean).slice(0, 2) || [];
  const interestTabs = userInterests
    .map((interest) => {
      const relatedNews = news.filter(item =>
        item.title.toLowerCase().includes(interest.toLowerCase())
      );
      return relatedNews.length > 0 ? { name: interest, news: relatedNews } : null;
    })
    .filter(Boolean);

  // Final Tabs: News always first + Interests + Hashtags
  const finalTabs = [{ name: 'News', news }].concat(interestTabs);

  return (
    <DesignExplore 
      user={user}
      search={search} setSearch={setSearch}searchResults={searchResults} activeTab={activeTab} setActiveTab={setActiveTab} finalTabs={finalTabs} topHashtags={topHashtags}
    />
  );
};

export default Search;
