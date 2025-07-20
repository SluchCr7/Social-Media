import React from 'react'
import Image from 'next/image'

const Loader = () => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-lightMode-bg dark:bg-darkMode-bg z-[9999] flex flex-col items-center justify-center space-y-6">
      {/* Logo
      <div className="animate-pulse">
        <Image
          src="/Logo.png" // استخدم شعارك هنا أو احذف السطر
          alt="Zocial Logo"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div> */}

      {/* Brand name */}
      <h1 className="text-2xl font-bold text-lightMode-text dark:text-darkMode-text animate-bounce tracking-widest">
        Zocial
      </h1>

      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-t-transparent border-lightMode-text dark:border-darkMode-text rounded-full animate-spin"></div>

      {/* Skeleton-style bar (optional)
      <div className="w-48 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 w-1/3 bg-gray-400 dark:bg-gray-600 animate-[loader-bar_1.5s_infinite]"></div>
      </div> */}

      {/* <style jsx>{`
        @keyframes loader-bar {
          0% {
            left: -33%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: -33%;
          }
        }
      `}</style> */}
    </div>
  )
}

export default Loader
