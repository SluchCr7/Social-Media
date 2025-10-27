'use client';
import React, { useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { usePost } from '@/app/Context/PostContext';
import { useSearchLogic } from '../../Custome/useSearchLogic';
import { useTranslation } from 'react-i18next';
import { IoIosSearch } from 'react-icons/io';
import { useSearchParams } from 'next/navigation';

// استيراد المكونات
import ExploreSearchBar from '../../Component/Explore/ExploreSearchBar';
import FullSearchTabs from '../../Component/FullSearchTabs';

const FullSearchResults = () => {
  const searchParams = useSearchParams();

  const { users, user } = useAuth();
  const { posts } = usePost();
  const { t } = useTranslation();

  // الحصول على قيمة البحث من الـ URL
  const initialSearchQuery = searchParams.get('q') || '';

  // منطق البحث
  const { search, setSearch, searchResults } = useSearchLogic(initialSearchQuery, users, posts);

  // تحديث URL عند تغيير البحث دون أي إعادة تحميل أو rerender
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (search.trim() && search !== currentQ) {
      window.history.replaceState(null, '', `/Pages/Search?q=${encodeURIComponent(search)}`);
    }
  }, [search]);

  return (
    <div
      className="w-full min-h-screen px-4 sm:px-8 py-8 
      bg-lightMode-bg dark:bg-darkMode-bg 
      text-lightMode-text dark:text-darkMode-text transition"
    >
      {/* 1. Header احترافي */}
      <div className="flex items-center space-x-2 mb-6 max-w-3xl mx-auto">
        <IoIosSearch className="text-3xl text-primary-color dark:text-primary-dark" />
        <h1 className="text-2xl font-extrabold">
          {t('Search Results for')}{' '}
          <span className="text-primary-color dark:text-primary-dark break-words">
            {search || '...'}
          </span>
        </h1>
      </div>

      {/* 2. شريط البحث */}
      <div className="max-w-3xl mx-auto mb-8">
        <ExploreSearchBar
          search={search}
          setSearch={setSearch}
          placeholder={t('Search users, #hashtags or posts...')}
        />
      </div>

      {/* 3. النتائج */}
      <div className="max-w-full mx-auto space-y-6">
        {search.trim() ? (
          <FullSearchTabs searchResults={searchResults} searchQuery={search} user={user} t={t} />
        ) : (
          <p className="text-center text-gray-500 mt-10 p-10 border dark:border-darkMode-border rounded-lg">
            {t('Enter a search query to view all results.')}
          </p>
        )}
      </div>
    </div>
  );
};

export default FullSearchResults;


// 'use client';
// import React from 'react';
// import { useAuth } from '../../Context/AuthContext';
// import { usePost } from '@/app/Context/PostContext';
// import { useSearchLogic } from '../../Custome/useSearchLogic'; 
// import { useTranslation } from 'react-i18next';
// import { IoIosSearch } from "react-icons/io";

// // استيراد المكونات
// import ExploreSearchBar from '../../Component/Explore/ExploreSearchBar';
// import FullSearchTabs from '../../Component/FullSearchTabs'; 


// // للحصول على قيمة البحث الأولية من الـ URL
// const getInitialQuery = () => {
//     if (typeof window !== 'undefined') {
//         const params = new URLSearchParams(window.location.search);
//         return params.get('q') || '';
//     }
//     return '';
// };


// const FullSearchResults = () => {
//     const { users, user } = useAuth();
//     const { posts } = usePost();
//     const { t } = useTranslation();

//     const initialSearchQuery = getInitialQuery();
//     // استخدام Hook البحث لتوفير منطق البحث وتحديث الحالة
//     const { search, setSearch, searchResults } = useSearchLogic(initialSearchQuery, users, posts);

//     return (
//         <div className="w-full min-h-screen px-4 sm:px-8 py-8 
//             bg-lightMode-bg dark:bg-darkMode-bg 
//             text-lightMode-text dark:text-darkMode-text transition">
          
//             {/* 1. Header احترافي يعرض كلمة البحث الحالية */}
//             <div className="flex items-center space-x-2 mb-6 max-w-3xl mx-auto">
//                 <IoIosSearch className="text-3xl text-primary-color dark:text-primary-dark" />
//                 <h1 className="text-2xl font-extrabold">
//                     {t("Search Results for")}{' '}
//                     <span className="text-primary-color dark:text-primary-dark break-words">{search || '...'}</span>
//                 </h1>
//             </div>

//             {/* 2. شريط البحث - يمكنك التعديل عليه هنا ليتم تحديث النتائج */}
//             <div className="max-w-3xl mx-auto mb-8">
//                  <ExploreSearchBar 
//                     search={search}
//                     setSearch={setSearch}
//                     placeholder={t("Search users, #hashtags or posts...")}
//                 />
//             </div>

//             {/* 3. عرض النتائج الكاملة باستخدام التبويبات الجديدة */}
//             <div className="max-w-full mx-auto space-y-6"> 
//                  {search.trim() ? (
//                     <FullSearchTabs 
//                         searchResults={searchResults}
//                         searchQuery={search}
//                         user={user} 
//                         t={t}
//                     />
//                 ) : (
//                      <p className="text-center text-gray-500 mt-10 p-10 border dark:border-darkMode-border rounded-lg">{t("Enter a search query to view all results.")}</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FullSearchResults;