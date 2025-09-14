'use client'
import React from "react";
import Image from "next/image";

export const SuggestionRow = ({ type, data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {data.map((item) => (
        <div
          key={item._id || item.id}
          className="min-w-[260px] h-[320px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
        >
          {/* صورة كبيرة مع إطار جذاب */}
          <div className="relative w-20 h-20 mt-6 rounded-full p-[3px] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500">
            {item?.profilePhoto?.url || item?.Picture?.url ? (
              <Image
                src={item?.profilePhoto?.url || item?.Picture?.url}
                alt={item.username || item?.Name || "Profile"}
                width={80}
                height={80}
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-gray-300">
                {item?.username?.[0] || item?.Name?.[0] || "?"}
              </div>
            )}
          </div>

          {/* بيانات النص */}
          <div className="px-5 mt-4 flex-1 flex flex-col">
            {type === "user" && (
              <>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                  {item.username}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  @{item.profileName || "guest"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 flex-1 line-clamp-3">
                  {item.description || "This user hasn’t written a bio yet."}
                </p>
                <button
                  className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition"
                  // onClick={() => followUser(item._id)}
                >
                  Follow
                </button>
              </>
            )}

            {type === "community" && (
              <>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                  {item?.Name || "Unnamed Community"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {item.members?.length || 0} members
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 flex-1 line-clamp-3">
                  {item.description || "Join our community and start engaging."}
                </p>
                <button
                  className="mt-4 w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                  Join
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionRow;
