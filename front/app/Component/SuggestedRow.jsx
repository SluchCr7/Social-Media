import React from 'react'

export const SuggestionRow = ({ type, data }) => {
  if (!data || data.length === 0) return null

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {data.map((item) => (
        <div
          key={item._id || item.id}
          className="min-w-[180px] flex-shrink-0 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
        >
          {type === 'user' && (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {item.profileName || item.username}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{item.username}</p>
              <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition">
                Follow
              </button>
            </>
          )}

          {type === 'community' && (
            <>
              <div className="w-12 h-12 rounded-full bg-blue-300 dark:bg-blue-700 mb-2 flex items-center justify-center text-white font-bold text-lg">
                {item.name[0]}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.members?.length || 0} members</p>
              <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition">
                Join
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}


export default SuggestedRow