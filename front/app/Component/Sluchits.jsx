
// import React, { useMemo, useRef, useCallback, useEffect } from 'react';
// import SluchitEntry from './SluchitEntry';
// import { usePost } from '../Context/PostContext';
// import { useAuth } from '../Context/AuthContext';
// import PostSkeleton from '../Skeletons/PostSkeleton';
// import { useCommunity } from '../Context/CommunityContext';
// import { SuggestionRow } from './SuggestedRow';

// const Sluchits = ({ activeTab }) => {
//   const { posts, isLoading, fetchPosts, hasMore, setPage } = usePost();
//   const { user, suggestedUsers } = useAuth();
//   const { communities } = useCommunity();

//   const following = Array.isArray(user?.following) ? user?.following : [];
//   const userId = user?._id;
//   // فلترة / ترتيب البوستات حسب التبويب
//   // const filteredPosts = useMemo(() => {
//   //   if (!Array.isArray(posts)) return [];

//   //   // 📌 Feed للأشخاص المتابعين (زي ما هو موجود)
//   //   if (activeTab === 'following') {
//   //     return posts
//   //       .slice()
//   //       .sort((a, b) => {
//   //         const isAFollowed = following?.includes(a?.owner?._id);
//   //         const isBFollowed = following?.includes(b?.owner?._id);
//   //         if (isAFollowed && !isBFollowed) return -1;
//   //         if (!isAFollowed && isBFollowed) return 1;
//   //         return new Date(b?.createdAt) - new Date(a?.createdAt);
//   //       });
//   //   }

//   //   // 📌 Feed "For You" (يعتمد على interests)
//   //   if (activeTab === 'foryou') {
//   //     if (!user?.interests || user.interests.length === 0) return posts;

//   //     return posts.filter(post => {
//   //       const text = `${post?.text || ''} ${post?.Hashtags?.join(' ') || ''}`.toLowerCase();
//   //       return user.interests.some(interest =>
//   //         text.includes(interest.toLowerCase())
//   //       );
//   //     });
//   //   }

//   //   return posts;
//   // }, [posts, following, activeTab, user?.interests]);
//   const filteredPosts = useMemo(() => {
//     if (!Array.isArray(posts)) return [];

//     // 🟢 Following Feed
//     if (activeTab === "following") {
//       return posts
//         .slice()
//         .sort((a, b) => {
//           const isAFollowed = following?.includes(a?.owner?._id);
//           const isBFollowed = following?.includes(b?.owner?._id);
//           if (isAFollowed && !isBFollowed) return -1;
//           if (!isAFollowed && isBFollowed) return 1;
//           return new Date(b?.createdAt) - new Date(a?.createdAt);
//         });
//     }
//     // 🟣 For You Feed
//     if (activeTab === "foryou") {
//       if (!user?.interests || user.interests.length === 0) {
//         // fallback: timeline عادي
//         return posts.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//       }

//       return posts
//         .map(post => {
//           const text = `
//             ${post?.text || ""}
//             ${post?.Hashtags?.join(" ") || ""}
//             ${post?.owner?.description || ""}
//           `.toLowerCase();

//           let score = 0;
//           user.interests.forEach(interest => {
//             if (text.includes(interest.toLowerCase())) score += 1;
//           });

//           return { post, score };
//         })
//         .filter(item => item.score > 0) // بس اللي ليه علاقة باهتماماتي
//         .sort((a, b) => {
//           if (a.score !== b.score) return b.score - a.score; // حسب الصلة
//           return new Date(b.post.createdAt) - new Date(a.post.createdAt); // الأحدث
//         })
//         .map(item => item.post);
//     }

//     // 🟡 Default Feed
//     return posts.sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );
//   }, [posts, following, activeTab, user?.interests]);

//   // فلترة الاقتراحات (Users)
//   const filteredUsers = useMemo(() => {
//     if (!Array.isArray(suggestedUsers)) return [];
//     return suggestedUsers.filter(
//       u => !following?.some(f => f?._id === u?._id)
//     );
//   }, [suggestedUsers, following]);

//   // فلترة الاقتراحات (Communities)
//   const filteredCommunities = useMemo(() => {
//     if (!Array.isArray(communities)) return [];
//     return communities.filter(
//       c => !c.members?.some(member => member?._id === userId)
//     );
//   }, [communities, userId]);

//   // دمج البوستات مع الاقتراحات
//   const combinedItems = useMemo(() => {
//     if (!Array.isArray(filteredPosts)) return [];

//     const items = [];
//     filteredPosts.forEach((post, index) => {
//       if (post) items.push({ type: 'post', data: post });
//       if ((index + 1) % 5 === 0 && filteredUsers.length > 0) {
//         items.push({ type: 'user', data: filteredUsers.slice(0, 3) });
//       } else if ((index + 1) % 10 === 0 && filteredCommunities.length > 0) {
//         items.push({ type: 'community', data: filteredCommunities.slice(0, 3) });
//       }
//     });
//     return items;
//   }, [filteredPosts, filteredUsers, filteredCommunities]);

//   // 🎯 Infinite Scroll
//   const observer = useRef();
//   const lastItemRef = useCallback(node => {
//     if (isLoading) return;
//     if (observer.current) observer.current.disconnect();
//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) {
//         setPage(prev => {
//           const nextPage = prev + 1;
//           fetchPosts(nextPage);
//           return nextPage;
//         });
//       }
//     });
//     if (node) observer.current.observe(node);
//   }, [isLoading, hasMore]);

//   return (
//     <div className="w-full flex flex-col gap-8">
//       {combinedItems.length === 0 && isLoading ? (
//         Array.from({ length: 4 }).map((_, i) => (
//           <PostSkeleton key={i} className="animate-pulse" />
//         ))
//       ) : combinedItems.length > 0 ? (
//         combinedItems.map((item, i) => {
//           const isLastItem = i === combinedItems.length - 1;
//           if (item.type === 'post') {
//             return (
//               <SluchitEntry
//                 ref={isLastItem ? lastItemRef : null}
//                 key={item?.data?._id}
//                 post={item?.data}
//               />
//             );
//           }

//           return (
//             <div key={`suggestion-${i}`} className="flex flex-col gap-3 px-1">
//               <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
//                 {item.type === 'user'
//                   ? '✨ Suggested Users to Follow'
//                   : '🌐 Discover New Communities'}
//               </h2>
//               <SuggestionRow type={item?.type} data={item?.data} />
//             </div>
//           );
//         })
//       ) : (
//         <p className="text-gray-500 dark:text-gray-400 text-center py-10 text-sm">
//           No posts found
//         </p>
//       )}
//       {isLoading && <PostSkeleton className="animate-pulse" />}
//     </div>
//   );
// };

// export default Sluchits;


'use client';
import React, {
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useState
} from 'react';
import SluchitEntry from './SluchitEntry';
import { usePost } from '../Context/PostContext';
import { useAuth } from '../Context/AuthContext';
import PostSkeleton from '../Skeletons/PostSkeleton';
import { useCommunity } from '../Context/CommunityContext';
import { SuggestionRow } from './SuggestedRow';

const Sluchits = ({ activeTab }) => {
  const { posts, isLoading, fetchPosts, hasMore, setPage, page } = usePost();
  const { user, suggestedUsers } = useAuth();
  const { communities } = useCommunity();

  const following = Array.isArray(user?.following) ? user.following : [];
  const userId = user?._id;

  // 🎯 فلترة وترتيب المنشورات
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];

    // 🟢 Following feed
    if (activeTab === 'following') {
      return posts
        .slice()
        .sort((a, b) => {
          const isAFollowed = following?.includes(a?.owner?._id);
          const isBFollowed = following?.includes(b?.owner?._id);
          if (isAFollowed && !isBFollowed) return -1;
          if (!isAFollowed && isBFollowed) return 1;
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
    }

    // 🟣 For You feed
    if (activeTab === 'foryou') {
      if (!user?.interests || user.interests.length === 0) {
        // fallback إلى timeline عادي
        return posts
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      const matched = posts
        .map(post => {
          const text = `
            ${post?.text || ''}
            ${post?.Hashtags?.join(' ') || ''}
            ${post?.owner?.description || ''}
          `.toLowerCase();

          let score = 0;
          user.interests.forEach(interest => {
            if (text.includes(interest.toLowerCase())) score += 1;
          });

          return { post, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => {
          if (a.score !== b.score) return b.score - a.score;
          return new Date(b.post.createdAt) - new Date(a.post.createdAt);
        })
        .map(item => item.post);

      // في حالة مافيش تطابق نرجع الفيد العادي
      return matched.length > 0
        ? matched
        : posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // 🟡 Default feed
    return posts
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, following, activeTab, user?.interests]);

  // 🔹 فلترة المستخدمين المقترحين
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(suggestedUsers)) return [];
    return suggestedUsers.filter(
      u => !following?.some(f => f?._id === u?._id)
    );
  }, [suggestedUsers, following]);

  // 🔹 فلترة المجتمعات المقترحة
  const filteredCommunities = useMemo(() => {
    if (!Array.isArray(communities)) return [];
    return communities.filter(
      c => !c.members?.some(member => member?._id === userId)
    );
  }, [communities, userId]);

  // 📦 دمج المنشورات مع الاقتراحات بشكل ديناميكي
  const combinedItems = useMemo(() => {
    if (!Array.isArray(filteredPosts)) return [];

    const items = [];
    const suggestionsInterval = Math.floor(filteredPosts.length / 4) || 5;

    filteredPosts.forEach((post, index) => {
      if (post) items.push({ type: 'post', data: post });

      // اقتراح مستخدمين كل فترة
      if ((index + 1) % suggestionsInterval === 0 && filteredUsers.length > 0) {
        items.push({ type: 'user', data: filteredUsers.slice(0, 3) });
      }

      // اقتراح مجتمعات كل ضعف الفترة
      if ((index + 1) % (suggestionsInterval * 2) === 0 && filteredCommunities.length > 0) {
        items.push({ type: 'community', data: filteredCommunities.slice(0, 3) });
      }
    });

    return items;
  }, [filteredPosts, filteredUsers, filteredCommunities]);

  // 🔁 Infinite Scroll محسّن
  const observer = useRef();
  const lastItemRef = useCallback(
    node => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // جلب البيانات عند تغير الصفحة
  useEffect(() => {
    if (page > 1) fetchPosts(page);
  }, [page]);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* ⏳ حالة التحميل الأولية */}
      {combinedItems.length === 0 && isLoading && (
        Array.from({ length: 4 }).map((_, i) => (
          <PostSkeleton key={i} className="animate-pulse" />
        ))
      )}

      {/* 📜 عرض المحتوى */}
      {combinedItems.length > 0 ? (
        combinedItems.map((item, i) => {
          const isLastItem = i === combinedItems.length - 1;
          if (item.type === 'post') {
            return (
              <SluchitEntry
                ref={isLastItem ? lastItemRef : null}
                key={item?.data?._id}
                post={item?.data}
              />
            );
          }

          return (
            <div key={`suggestion-${i}`} className="flex flex-col gap-3 px-1">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
                {item.type === 'user'
                  ? <>✨ <span>People you may like</span></>
                  : <>🌐 <span>Explore new communities</span></>}
              </h2>
              <SuggestionRow type={item?.type} data={item?.data} />
            </div>
          );
        })
      ) : (
        !isLoading && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No posts yet 💤</p>
            <p className="text-sm text-gray-500">
              Start following people or join a community!
            </p>
          </div>
        )
      )}

      {/* ⚡ مؤشر تحميل في الأسفل */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <span className="loader border-4 border-gray-300 border-t-blue-500 rounded-full w-6 h-6 animate-spin"></span>
        </div>
      )}
    </div>
  );
};

export default Sluchits;
