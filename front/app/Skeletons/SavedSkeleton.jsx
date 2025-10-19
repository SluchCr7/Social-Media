// SavedPageSkeleton.jsx

import React from 'react'
import { FaBookmark, FaRegImage, FaMusic, FaPlay } from 'react-icons/fa'

// الهيكل الأساسي للSkeleton
const Skeleton = ({ className = 'bg-gray-200 dark:bg-white/10' }) => (
  <div className={`animate-pulse rounded-xl ${className}`}></div>
)

// هيكل عنصر قائمة الموسيقى
const MusicItemSkeleton = () => (
  <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
    {/* صورة الغلاف */}
    <Skeleton className="w-16 h-16 rounded-xl" />
    
    <div className="flex-1 min-w-0 space-y-2">
      {/* عنوان الأغنية */}
      <Skeleton className="h-4 w-3/4" />
      {/* اسم الفنان */}
      <Skeleton className="h-3 w-1/2" />
    </div>
    
    {/* المدة */}
    <Skeleton className="h-3 w-10 hidden sm:block" />

    {/* زر التشغيل */}
    <Skeleton className="w-12 h-12 rounded-full" />
  </div>
)

// هيكل عنصر البوست (SluchitEntry)
const PostItemSkeleton = () => (
  <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-4">
    {/* معلومات المستخدم */}
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    
    {/* النص */}
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />

    {/* الصورة الرئيسية */}
    <Skeleton className="w-full h-64 rounded-xl" />
    
    {/* الإجراءات */}
    <div className="flex items-center gap-4">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-6 h-6 rounded-full" />
    </div>
  </div>
)

// هيكل عنصر مقطع Reels
const ReelItemSkeleton = () => (
  <div className="relative rounded-2xl overflow-hidden bg-white/3 border border-white/6 shadow-xl h-60">
    {/* الصورة المصغرة مع التظليل */}
    <Skeleton className="w-full h-full" />
    
    {/* العنوان */}
    <div className="p-3 absolute bottom-0 left-0 right-0">
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
)


export default function SavedPageSkeleton({ activeTab = 'posts' }) {
    
  // تحديد المحتوى الهيكلي بناءً على التبويب النشط
  let contentSkeleton = null;

  switch (activeTab) {
    case 'music':
      contentSkeleton = (
        <div className="bg-white/3 border border-white/6 rounded-3xl p-6 backdrop-blur-md space-y-4">
          {[...Array(4)].map((_, i) => <MusicItemSkeleton key={i} />)}
        </div>
      );
      break;
    case 'reels':
      contentSkeleton = (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <ReelItemSkeleton key={i} />)}
        </div>
      );
      break;
    case 'posts':
    default:
      contentSkeleton = (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => <PostItemSkeleton key={i} />)}
        </div>
      );
      break;
  }

  return (
    <div className="min-h-screen w-full py-12 px-6 bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-fg dark:text-darkMode-fg">
      <div className="max-w-7xl w-full mx-auto">
        
        {/* ========================================= */}
        {/* هيكل الهيدر (العنوان والبحث والتبويبات) */}
        {/* ========================================= */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          
          {/* هيكل العنوان */}
          <div className='flex items-center gap-4'>
            <Skeleton className="w-14 h-14 rounded-xl" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>

          {/* هيكل شريط البحث والتبويبات */}
          <div className="flex flex-col md:flex-row items-end gap-3 w-full md:w-auto">
            
            {/* حقل البحث */}
            <Skeleton className="w-full md:w-64 h-11 rounded-xl" />

            {/* التبويبات الكبيرة */}
            <div className="hidden md:flex items-center bg-white/5 rounded-xl p-1 gap-1 shadow-md w-60">
              <Skeleton className="h-8 w-1/3 rounded-lg" />
              <Skeleton className="h-8 w-1/3 rounded-lg" />
              <Skeleton className="h-8 w-1/3 rounded-lg" />
            </div>
          </div>
        </div>
        
        {/* ========================================= */}
        {/* هيكل التبويبات للجوال */}
        {/* ========================================= */}
        <div className="flex md:hidden gap-3 mb-8">
            <Skeleton className="flex-1 h-10 rounded-lg" />
            <Skeleton className="flex-1 h-10 rounded-lg" />
            <Skeleton className="flex-1 h-10 rounded-lg" />
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