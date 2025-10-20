
import React from 'react';
import { FaBookmark, FaRegImage, FaMusic, FaPlay } from 'react-icons/fa';

/**
 * مكون الهيكل الأساسي (Skeleton)
 * @param {string} type - نوع الهيكل: 'text' (افتراضي), 'square', 'circle'
 * @param {number} width - عرض مخصص (مفيد للـ 'text' و 'square')
 * @param {number} height - ارتفاع مخصص (مفيد للـ 'text' و 'square')
 * @param {string} className - كلاسات Tailwind إضافية لتخصيص الأبعاد أو الألوان
 */
const Skeleton = ({ type = 'text', width = 'full', height = '4', className = '' }) => {
    // كلاسات الألوان والتحريك المركزية
    const baseClasses = 'animate-pulse bg-gray-300 dark:bg-white/10';

    // تحديد كلاسات الحجم والشكل بناءً على النوع
    let shapeClasses = '';
    if (type === 'circle') {
        shapeClasses = `w-${width} h-${height} rounded-full`;
    } else if (type === 'square') {
        shapeClasses = `w-${width} h-${height} rounded-xl`;
    } else { // 'text'
        shapeClasses = `w-${width} h-${height} rounded-md`;
    }

    // الدمج النهائي
    return (
        <div className={`${baseClasses} ${shapeClasses} ${className}`}></div>
    );
};

// -----------------------------------------------------
// 2. هياكل العناصر الفرعية (Item Skeletons)
// -----------------------------------------------------

// هيكل عنصر قائمة الموسيقى (Music Item)
const MusicItemSkeleton = () => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 transition-all">
        {/* صورة الغلاف */}
        <Skeleton type="square" width="16" height="16" className="min-w-16" />

        <div className="flex-1 min-w-0 space-y-3">
            {/* عنوان الأغنية - أطول */}
            <Skeleton width="4/5" height="4" />
            {/* اسم الفنان - أقصر وأقل ارتفاعًا */}
            <Skeleton width="1/2" height="3" className="opacity-70" />
        </div>

        {/* المدة (يظهر على الشاشات الكبيرة) */}
        <Skeleton width="10" height="3" className="hidden sm:block opacity-60" />

        {/* زر التشغيل (دائري) */}
        <Skeleton type="circle" width="10" height="10" />
    </div>
);

// هيكل عنصر البوست (Post Item)
const PostItemSkeleton = () => (
    <div className="border border-gray-200 dark:border-white/10 rounded-3xl p-5 bg-white dark:bg-white/5 shadow-lg dark:shadow-xl transition-all space-y-5">
        {/* معلومات المستخدم */}
        <div className="flex items-center gap-3">
            <Skeleton type="circle" width="10" height="10" className="min-w-10" />
            <div className="flex-1 space-y-2">
                <Skeleton width="28" height="4" /> {/* اسم المستخدم */}
                <Skeleton width="20" height="3" className="opacity-70" /> {/* التاريخ/الوصف */}
            </div>
        </div>

        {/* النص */}
        <div className="space-y-3">
            <Skeleton width="full" height="4" />
            <Skeleton width="11/12" height="4" />
            <Skeleton width="2/3" height="4" />
        </div>

        {/* الصورة الرئيسية */}
        <Skeleton type="square" width="full" height="64" />

        {/* الإجراءات (مثل الإعجابات والتعليقات) */}
        <div className="flex items-center gap-6 pt-2 border-t border-gray-200 dark:border-white/10">
            <Skeleton type="circle" width="6" height="6" />
            <Skeleton type="circle" width="6" height="6" />
            <Skeleton type="circle" width="6" height="6" />
        </div>
    </div>
);

// هيكل عنصر مقطع Reels
const ReelItemSkeleton = () => (
    <div className="relative rounded-2xl overflow-hidden bg-gray-200 dark:bg-white/10 shadow-lg h-60 transition-all">
        {/* الصورة المصغرة / الفيديو */}
        <Skeleton type="square" width="full" height="full" className="rounded-none" />

        {/* العنوان في الأسفل */}
        <div className="p-3 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent">
            <Skeleton width="3/4" height="4" className="bg-white/20 dark:bg-white/30" />
        </div>
    </div>
);

// -----------------------------------------------------
// 3. المكون الرئيسي (Main Component)
// -----------------------------------------------------

export default function SavedPageSkeleton({ activeTab = 'posts' }) {

    // تحديد المحتوى الهيكلي بناءً على التبويب النشط
    let contentSkeleton = null;

    switch (activeTab) {
        case 'music':
            contentSkeleton = (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm space-y-5">
                    {[...Array(5)].map((_, i) => <MusicItemSkeleton key={i} />)}
                </div>
            );
            break;
        case 'reels':
            contentSkeleton = (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <ReelItemSkeleton key={i} />)}
                </div>
            );
            break;
        case 'posts':
        default:
            contentSkeleton = (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> {/* تحسين لـ 2 عمود على الشاشات الكبيرة */}
                    {[...Array(4)].map((_, i) => <PostItemSkeleton key={i} />)}
                </div>
            );
            break;
    }

    return (
        <div className="min-h-screen w-full py-12 px-4 sm:px-6 bg-gray-50 dark:bg-[#121212] transition-colors">
            <div className="max-w-7xl w-full mx-auto">

                {/* ========================================= */}
                {/* هيكل الهيدر (العنوان والبحث والتبويبات) */}
                {/* ========================================= */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">

                    {/* هيكل العنوان */}
                    <div className='flex items-center gap-4'>
                        {/* أيقونة الصفحة */}
                        <Skeleton type="square" width="14" height="14" className="min-w-14" />
                        <div>
                            {/* العنوان الرئيسي */}
                            <Skeleton width="72" height="6" className="mb-2" />
                            {/* الوصف / التفاصيل */}
                            <Skeleton width="96" height="4" className="hidden sm:block opacity-80" />
                        </div>
                    </div>

                    {/* هيكل شريط البحث والتبويبات */}
                    <div className="flex flex-col md:flex-row items-end gap-3 w-full md:w-auto">

                        {/* حقل البحث */}
                        <Skeleton type="square" width="full" height="11" className="md:w-64" />

                        {/* التبويبات الكبيرة (Desktop Tabs) */}
                        <div className="hidden md:flex items-center bg-gray-100 dark:bg-white/5 rounded-xl p-1 gap-1 shadow-inner w-60">
                            <Skeleton type="text" height="8" width="1/3" className="rounded-lg" />
                            <Skeleton type="text" height="8" width="1/3" className="rounded-lg" />
                            <Skeleton type="text" height="8" width="1/3" className="rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* ========================================= */}
                {/* هيكل التبويبات للجوال (Mobile Tabs) */}
                {/* ========================================= */}
                <div className="flex md:hidden gap-3 mb-8">
                    <Skeleton type="text" height="10" className="flex-1 rounded-xl" />
                    <Skeleton type="text" height="10" className="flex-1 rounded-xl" />
                    <Skeleton type="text" height="10" className="flex-1 rounded-xl" />
                </div>

                {/* ========================================= */}
                {/* هيكل المحتوى النشط */}
                {/* ========================================= */}
                <div>
                    {contentSkeleton}
                </div>
            </div>
        </div>
    )
}