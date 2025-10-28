
// 'use client';
// import React, {
//   useMemo,
//   useRef,
//   useCallback,
//   useEffect,
//   useState
// } from 'react';
// import SluchitEntry from './SluchitEntry';
// import { usePost } from '../Context/PostContext';
// import { useAuth } from '../Context/AuthContext';
// import PostSkeleton from '../Skeletons/PostSkeleton';
// import { useCommunity } from '../Context/CommunityContext';
// import { SuggestionRow } from './SuggestedRow';
// import { useUser } from '../Context/UserContext';
// import { useGetData } from '../Custome/useGetData';
// import { useTranslation } from 'react-i18next';

// const Sluchits = ({ activeTab }) => {
//   const { posts, isLoading, fetchPosts, hasMore, setPage, page,isLoadingPostCreated } = usePost();
//   const { user } = useAuth();
//   const {suggestedUsers} = useUser()
//   const { communities } = useCommunity();
//   const {userData,loading} = useGetData(user?._id)
//   const {t} = useTranslation()
//   const following = Array.isArray(userData?.following) ? userData.following : [];
//   const userId = userData?._id;

//   // 🎯 فلترة وترتيب المنشورات
//   const filteredPosts = useMemo(() => {
//     if (!Array.isArray(posts)) return [];

//     // 🟢 Following feed
//     if (activeTab === 'following') {
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

//     // 🟣 For You feed
//     if (activeTab === 'foryou') {
//       if (!userData?.interests || userData.interests.length === 0) {
//         // fallback إلى timeline عادي
//         return posts
//           .slice()
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       }

//       const matched = posts
//         .map(post => {
//           const text = `
//             ${post?.text || ''}
//             ${post?.Hashtags?.join(' ') || ''}
//             ${post?.owner?.description || ''}
//           `.toLowerCase();

//           let score = 0;
//           userData.interests.forEach(interest => {
//             if (text.includes(interest.toLowerCase())) score += 1;
//           });

//           return { post, score };
//         })
//         .filter(item => item.score > 0)
//         .sort((a, b) => {
//           if (a.score !== b.score) return b.score - a.score;
//           return new Date(b.post.createdAt) - new Date(a.post.createdAt);
//         })
//         .map(item => item.post);

//       // في حالة مافيش تطابق نرجع الفيد العادي
//       return matched.length > 0
//         ? matched
//         : posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     }

//     // 🟡 Default feed
//     return posts
//       .slice()
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   }, [posts, following, activeTab, userData?.interests]);

//   // 🔹 فلترة المستخدمين المقترحين
//   const filteredUsers = useMemo(() => {
//     if (!Array.isArray(suggestedUsers)) return [];
//     return suggestedUsers.filter(
//       u => !following?.some(f => f?._id === u?._id)
//     );
//   }, [suggestedUsers, following]);

//   // 🔹 فلترة المجتمعات المقترحة
//   const filteredCommunities = useMemo(() => {
//     if (!Array.isArray(communities)) return [];
//     return communities.filter(
//       c => !c.members?.some(member => member?._id === userId)
//     );
//   }, [communities, userId]);

//   // 📦 دمج المنشورات مع الاقتراحات بشكل ديناميكي
//   const combinedItems = useMemo(() => {
//     if (!Array.isArray(filteredPosts)) return [];

//     const items = [];
//     const suggestionsInterval = Math.floor(filteredPosts.length / 4) || 5;

//     filteredPosts.forEach((post, index) => {
//       if (post) items.push({ type: 'post', data: post });

//       // اقتراح مستخدمين كل فترة
//       if ((index + 1) % suggestionsInterval === 0 && filteredUsers.length > 0) {
//         items.push({ type: 'user', data: filteredUsers.slice(0, 3) });
//       }

//       // اقتراح مجتمعات كل ضعف الفترة
//       if ((index + 1) % (suggestionsInterval * 2) === 0 && filteredCommunities.length > 0) {
//         items.push({ type: 'community', data: filteredCommunities.slice(0, 3) });
//       }
//     });

//     return items;
//   }, [filteredPosts, filteredUsers, filteredCommunities]);

//   // 🔁 Infinite Scroll محسّن
//   const observer = useRef();
//   const lastItemRef = useCallback(
//     node => {
//       if (isLoading) return;
//       if (observer.current) observer.current.disconnect();
//       observer.current = new IntersectionObserver(entries => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage(prev => prev + 1);
//         }
//       });
//       if (node) observer.current.observe(node);
//     },
//     [isLoading, hasMore]
//   );

//   // جلب البيانات عند تغير الصفحة
//   useEffect(() => {
//     if (page > 1) fetchPosts(page);
//   }, [page]);

//   return (
//     <div className="w-full flex flex-col gap-8">
//       {/* ⏳ حالة التحميل الأولية */}
//       {combinedItems.length === 0 && isLoading && (
//         Array.from({ length: 4 }).map((_, i) => (
//           <PostSkeleton key={i} className="animate-pulse" />
//         ))
//       )}

//       {/* 📜 عرض المحتوى */}
//       {combinedItems.length > 0 ? (
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
//               <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
//                 {item.type === 'user'
//                   ? <>✨ <span>{t("People you may like")}</span></>
//                   : <>🌐 <span>{t("Explore new communities")}</span></>}
//               </h2>
//               <SuggestionRow type={item?.type} data={item?.data} />
//             </div>
//           );
//         })
//       ) : (
//         !isLoading && (
//           <div className="text-center py-16 text-gray-400">
//             <p className="text-lg font-medium">No posts yet 💤</p>
//             <p className="text-sm text-gray-500">
//               Start following people or join a community!
//             </p>
//           </div>
//         )
//       )}

//       {/* ⚡ مؤشر تحميل في الأسفل */}
//       {isLoading && (
//         <div className="flex justify-center py-4">
//           <span className="loader border-4 border-gray-300 border-t-blue-500 rounded-full w-6 h-6 animate-spin"></span>
//         </div>
//       )}
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
import { useUser } from '../Context/UserContext';
import { useGetData } from '../Custome/useGetData';
import { useTranslation } from 'react-i18next';

const Sluchits = ({ activeTab }) => {
  const { posts, isLoading, fetchPosts, hasMore, setPage, page, isLoadingPostCreated } = usePost();
  const { user } = useAuth();
  const { suggestedUsers } = useUser();
  const { communities } = useCommunity();
  const { userData, loading } = useGetData(user?._id);
  const { t } = useTranslation();
  
  // 📝 استخلاص قوائم المتابعة والعضوية
  // نحول الـ following إلى Set لسرعة البحث
  const followingIds = useMemo(() => {
    if (!Array.isArray(userData?.following)) return new Set();
    return new Set(userData.following.map(f => f?.toString())); // يجب التأكد من أنها سلاسل نصية للمقارنة
  }, [userData?.following]);

  const userId = userData?._id?.toString();

  // 🎯 فلترة وترتيب المنشورات (المنطق لم يتغير هنا)
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];

    // 🟢 Following feed
    if (activeTab === 'following') {
      // نستخدم followingIds هنا للمقارنة
      return posts
        .slice()
        .sort((a, b) => {
          const isAFollowed = followingIds.has(a?.owner?._id?.toString());
          const isBFollowed = followingIds.has(b?.owner?._id?.toString());
          if (isAFollowed && !isBFollowed) return -1;
          if (!isAFollowed && isBFollowed) return 1;
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
    }

    // 🟣 For You feed (المنطق لم يتغير)
    if (activeTab === 'foryou') {
      if (!userData?.interests || userData.interests.length === 0) {
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
          userData.interests.forEach(interest => {
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

      return matched.length > 0
        ? matched
        : posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // 🟡 Default feed
    return posts
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, followingIds, activeTab, userData?.interests]); // تم تحديث التبعية

  // 🔹 فلترة المستخدمين المقترحين (تحسين منطق الفلترة)
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(suggestedUsers) || !userId) return [];
    
    return suggestedUsers.filter(u => {
      // 1. لا تظهر المستخدم إذا كان هو المستخدم الحالي
      if (u?._id?.toString() === userId) return false;
      // 2. لا تظهر المستخدم إذا كنت تتابعه بالفعل
      return !followingIds.has(u?._id?.toString());
    });
  }, [suggestedUsers, followingIds, userId]); // تم تحديث التبعية

  // 🔹 فلترة المجتمعات المقترحة (تحسين منطق الفلترة)
  const filteredCommunities = useMemo(() => {
    if (!Array.isArray(communities) || !userId) return [];
    
    return communities.filter(c => {
      // 1. لا تظهر المجتمع إذا كنت مالكه
      if (c?.owner?._id?.toString() === userId) return false;
      // 2. لا تظهر المجتمع إذا كنت عضوًا فيه بالفعل
      // يجب أن تتأكد من أن `c.members` تحتوي على معرفات المستخدمين (Strings/Objects)
      return !c.members?.some(member => {
        const memberId = member?._id?.toString() || member?.toString();
        return memberId === userId;
      });
    });
  }, [communities, userId]);

  // 📦 دمج المنشورات مع الاقتراحات بشكل ديناميكي (منطق احترافي)
  const combinedItems = useMemo(() => {
    if (!Array.isArray(filteredPosts)) return [];

    const items = [];
    let userSuggestions = [...filteredUsers];
    let communitySuggestions = [...filteredCommunities];
    
    // تحديد فترات زمنية لظهور الاقتراحات
    const USER_INTERVAL = 8; // اقتراح مستخدم كل 8 منشورات
    const COMMUNITY_INTERVAL = 15; // اقتراح مجتمع كل 15 منشور

    filteredPosts.forEach((post, index) => {
      // إضافة المنشور
      if (post) items.push({ type: 'post', data: post });

      // إضافة اقتراح مستخدم
      if ((index + 1) % USER_INTERVAL === 0 && userSuggestions.length > 0) {
        // نأخذ 3 مستخدمين في كل مرة
        const suggestionsBatch = userSuggestions.splice(0, 3);
        items.push({ type: 'user', data: suggestionsBatch });
      }

      // إضافة اقتراح مجتمع
      if ((index + 1) % COMMUNITY_INTERVAL === 0 && communitySuggestions.length > 0) {
        // نأخذ 3 مجتمعات في كل مرة
        const suggestionsBatch = communitySuggestions.splice(0, 3);
        items.push({ type: 'community', data: suggestionsBatch });
      }
    });

    // إذا تبقى اقتراحات بعد انتهاء المنشورات، نضيفها في النهاية (اختياري)
    // if (userSuggestions.length > 0) {
    //   items.push({ type: 'user', data: userSuggestions.slice(0, 3) });
    // }
    // if (communitySuggestions.length > 0) {
    //   items.push({ type: 'community', data: communitySuggestions.slice(0, 3) });
    // }

    return items;
  }, [filteredPosts, filteredUsers, filteredCommunities]);

  // 🔁 Infinite Scroll محسّن (لم يتغير المنطق)
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

  // جلب البيانات عند تغير الصفحة (لم يتغير المنطق)
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

          // عرض الاقتراحات
          return (
            <div key={`suggestion-${i}`} className="flex flex-col gap-3 px-1">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
                {item.type === 'user'
                  ? <>✨ <span>{t("People you may like")}</span></>
                  : <>🌐 <span>{t("Explore new communities")}</span></>}
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
      {isLoading && hasMore && ( // تم إضافة hasMore هنا ليكون أدق
        <div className="flex justify-center py-4">
          <span className="loader border-4 border-gray-300 border-t-blue-500 rounded-full w-6 h-6 animate-spin"></span>
        </div>
      )}
    </div>
  );
};

export default Sluchits;