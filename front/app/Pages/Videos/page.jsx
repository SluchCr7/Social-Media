'use client'
import React from 'react'
import { useTranslation } from 'react-i18next';

const page = () => {
  const {t} = useTranslation();
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-[100vh] text-center px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        🎬 {t("Coming Soon!")}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm tracking-widest max-w-xl">
        {t("The Videos section is under development and will be available soon. Get ready to watch, share, and discover amazing video content from creators around the world!")}
      </p>
      <div className="mt-6">
        <img
          src="/soon.svg"
          alt="Coming Soon"
          className="w-60 mx-auto"
        />
      </div>
    </div>
  )
}

export default page
