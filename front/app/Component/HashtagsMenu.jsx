import React from 'react';
import { usePost } from '../Context/PostContext';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Link from 'next/link';

const HashtagsMenu = () => {
  const { posts } = usePost();

  // Collect all hashtags from all posts
  const hashtagCount = {};
  posts.forEach((post) => {
    if (Array.isArray(post.Hashtags)) {
      const uniqueTagsInPost = [...new Set(post.Hashtags.map(tag => tag.toLowerCase()))];
      uniqueTagsInPost.forEach((tag) => {
        hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
      });
    }
  });

  // Convert to array and sort by popularity
  const topHashtags = Object.entries(hashtagCount)
    .sort((a, b) => b[1] - a[1]) // sort by count descending
    .slice(0, 5); // top 5

  return (
    <div className="w-full bg-lightMode-menu dark:bg-darkMode-menu rounded-xl shadow-lg flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b  border-lightMode-fg/40 dark:border-darkMode-fg/40">
        <h2 className="text-lightMode-fg dark:text-darkMode-fg text-lg font-semibold">Hashtags in your Country</h2>
      </div>

      {/* Body */}
      <div className="flex flex-col items-start w-full px-4 py-2 space-y-2">
        {topHashtags.length === 0 ? (
          <p className="text-lightMode-fg dark:text-darkMode-fg/60">No trending hashtags yet.</p>
        ) : (
          topHashtags.map(([tag, count], index) => {
            // Simulated trend logic: even index trending up, odd index trending down
            const isTrendingUp = index % 2 === 0;

            return (
              <div
                key={tag}
                className="flex items-center p-3 justify-between w-full hover:underline cursor-pointer"
              >
                <div className="flex items-center gap-2 text-lightMode-fg dark:text-darkMode-fg text-sm">
                  <Link href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}>{tag}</Link>
                  <span className="text-lightMode-fg dark:text-darkMode-fg/60">({count} posts)</span>
                </div>
                <div className="flex items-center">
                  {isTrendingUp ? (
                    <FaArrowUp className="text-green-500" />
                  ) : (
                    <FaArrowDown className="text-red-500" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HashtagsMenu;
