import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-[100vh] text-center px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        ⚡ Coming Soon!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm tracking-widest">
        The Challenges feature is under development and will be available soon.  
        Stay tuned for exciting new competitions and activities!
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
