// FullSearchResults.jsx (صفحة النتائج الكاملة)

'use client';
import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { usePost } from '@/app/Context/PostContext';
// افترض أن مسار useSearchLogic هو '../../Custome/useSearchLogic'
import { useSearchLogic } from '../../Custome/useSearchLogic'; 
import { useTranslation } from 'react-i18next';
import { IoIosSearch } from "react-icons/io";

// استيراد المكونات المستخدمة في Explore
import ExploreSearchBar from '../../Component/Explore/ExploreSearchBar';
import SearchResults from '../../Component/Explore/SearchResults';

// للحصول على قيمة البحث الأولية من الـ URL (يجب أن يتم تعديله حسب طريقة التوجيه في Next.js)
const getInitialQuery = () => {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        return params.get('q') || '';
    }
    return '';
};


const FullSearchResults = () => {
    const { users, user } = useAuth(); // ستحتاج لبيانات المستخدم لتمريرها إلى SearchResults
    const { posts } = usePost();
    const { t } = useTranslation();

    // 1. استخدام useSearchLogic لتطبيق منطق البحث على الصفحة الكاملة
    const initialSearchQuery = getInitialQuery();
    const { search, setSearch, searchResults } = useSearchLogic(initialSearchQuery, users, posts);

    return (
        <div className="w-full min-h-screen px-4 sm:px-8 py-8 
            bg-lightMode-bg dark:bg-darkMode-bg 
            text-lightMode-text dark:text-darkMode-text transition">
          
            {/* Header بسيط لصفحة البحث */}
            <div className="flex items-center space-x-2 mb-6 max-w-3xl mx-auto">
                <IoIosSearch className="text-3xl text-primary-color dark:text-primary-dark" />
                <h1 className="text-2xl font-extrabold">{t("Full Search Results")}</h1>
            </div>

            {/* شريط البحث - للسماح بالتعديل أو البحث الجديد */}
            <div className="max-w-3xl mx-auto mb-8">
                 <ExploreSearchBar 
                    search={search}
                    setSearch={setSearch}
                    placeholder={t("Search users, #hashtags or posts...")}
                />
            </div>

            {/* عرض النتائج الكاملة */}
            <div className="max-w-3xl mx-auto space-y-6">
                 {search.trim() ? (
                    <SearchResults 
                        searchResults={searchResults}
                        searchQuery={search}
                        user={user} // تمرير بيانات المستخدم إذا كانت SearchResults تستخدمها
                        t={t}
                        isFullPage={true} // يمكن استخدام هذا الـ prop لإلغاء أي قيود على عدد النتائج
                    />
                ) : (
                     <p className="text-center text-gray-500 mt-10 p-10 border dark:border-darkMode-border rounded-lg">{t("Enter a search query to view all results.")}</p>
                )}
            </div>
        </div>
    );
};

export default FullSearchResults;