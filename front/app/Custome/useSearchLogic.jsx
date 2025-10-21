// useSearchLogic.js

import { useState, useEffect, useMemo } from 'react';
import { filterHashtags } from '@/app/utils/filterHashtags'; // تأكد من المسار الصحيح

/**
 * Custom Hook لإدارة منطق البحث وتصفية النتائج.
 * @param {string} initialSearch - قيمة البحث الأولية (قد تأتي من URL).
 * @param {Array} users - قائمة المستخدمين.
 * @param {Array} posts - قائمة المنشورات.
 * @returns {object} - يحتوي على حالة البحث، ودالة تحديثها، والنتائج.
 */
export const useSearchLogic = (initialSearch = '', users = [], posts = []) => {
  const [search, setSearch] = useState(initialSearch);
  const [searchResults, setSearchResults] = useState({
    users: [],
    hashtags: [],
    posts: []
  });

  // 1. حساب الهاشتاجات الأكثر شيوعًا
  const hashtagCount = useMemo(() => {
    const counts = {};
    filterHashtags(posts, counts);
    return counts;
  }, [posts]);

  const topHashtags = useMemo(() => {
    return Object.entries(hashtagCount).sort((a, b) => b[1] - a[1]);
  }, [hashtagCount]);


  // 2. useEffect لتنفيذ البحث مع تأخير (Debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = search.trim();
      const searchLower = trimmed.toLowerCase();

      if (!trimmed) {
        setSearchResults({ users: [], hashtags: [], posts: [] });
        return;
      }

      if (trimmed.startsWith('#')) {
        const query = trimmed.slice(1).toLowerCase();
        const filteredTags = topHashtags.filter(([tag]) =>
          tag.toLowerCase().includes(query)
        );
        setSearchResults({
          users: [],
          hashtags: filteredTags.map(([tag, count]) => ({ tag, count })),
          posts: []
        });
      } else {
        const filteredUsers = Array.isArray(users)
          ? users.filter((u) =>
              (u.username + ' ' + (u.profileName || '')).toLowerCase().includes(searchLower)
            )
          : [];

        const filteredPosts = Array.isArray(posts)
          ? posts.filter(
              (p) =>
                (p.text && p.text.toLowerCase().includes(searchLower)) ||
                (p.Hashtags && p.Hashtags.some(tag => tag.toLowerCase().includes(searchLower))) ||
                (p.owner?.username && p.owner.username.toLowerCase().includes(searchLower)) ||
                (p.owner?.interests && p.owner.interests.some(interest => interest.toLowerCase().includes(searchLower))) ||
                (p.community?.Name && p.community.Name.toLowerCase().includes(searchLower)) ||
                (p.community?.tags && p.community.tags.some(tag => tag.toLowerCase().includes(searchLower)))
            )
          : [];

        setSearchResults({
          users: filteredUsers,
          hashtags: [],
          posts: filteredPosts
        });
      }
    }, 300); // Debounce time

    return () => clearTimeout(handler);
  }, [search, users, posts, topHashtags]);

  return { search, setSearch, searchResults, topHashtags };
};