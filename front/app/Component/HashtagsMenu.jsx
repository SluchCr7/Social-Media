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
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // top 5 hashtags

  return (
    <div className="w-full max-h-[500px] overflow-y-auto bg-white dark:bg-[#16181c] rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300 dark:border-gray-600 bg-gradient-to-r from-blue-600 to-purple-600">
        <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
          Trending Hashtags
        </h2>
      </div>

      {/* Body */}
      <div className="flex flex-col w-full px-4 py-3 space-y-2">
        {topHashtags.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400 text-sm">
            No trending hashtags yet.
          </div>
        ) : (
          topHashtags.map(([tag, count], index) => {
            const isTrendingUp = index % 2 === 0; // simple trend simulation

            return (
              <Link
                key={tag}
                href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex flex-col">
                  <span className="text-gray-900 dark:text-gray-100 font-medium">#{tag}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{count} posts</span>
                </div>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${isTrendingUp ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'}`}>
                  {isTrendingUp ? (
                    <FaArrowUp className="text-green-600 dark:text-green-400 text-sm" />
                  ) : (
                    <FaArrowDown className="text-red-600 dark:text-red-400 text-sm" />
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HashtagsMenu;
