import React from 'react'

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center lg:items-start gap-6 w-full pt-10 px-4 sm:px-6 lg:px-8">
        {/* صورة البروفايل */}
        <div className="w-36 h-36 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />

        {/* اسم المستخدم */}
        <div className="h-8 w-48 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />

        {/* الاسم الحقيقي */}
        <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />

        {/* البايو */}
        <div className="flex flex-col gap-2 mt-2 w-full max-w-md">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>

        {/* الإحصائيات (Posts, Followers, Following) */}
        <div className="flex justify-center lg:justify-start gap-10 mt-6 w-full max-w-md">
          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-12 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-12 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-12 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
          </div>
        </div>

    </div>
  )
}

export default ProfileSkeleton