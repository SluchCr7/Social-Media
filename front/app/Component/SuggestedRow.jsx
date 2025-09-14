'use client'
import React from "react";
import Image from "next/image";
import { FiUserPlus } from "react-icons/fi";
import { Users } from "lucide-react"; // أيقونة للجروبات

export const SuggestionRow = ({ type, data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {data.map((item) => (
        <div
          key={item._id || item.id}
          className="min-w-[280px] h-[340px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
        >
          {/* صورة البروفايل / الجروب */}
          <div className="relative w-24 h-24 mt-6 rounded-full p-[3px] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 shadow-md">
            {item?.profilePhoto?.url || item?.Picture?.url ? (
              <Image
                src={item?.profilePhoto?.url || item?.Picture?.url}
                alt={item.username || item?.Name || "Profile"}
                width={96}
                height={96}
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-gray-300">
                {item?.username?.[0] || item?.Name?.[0] || "?"}
              </div>
            )}
          </div>

          {/* بيانات النص */}
          <div className="px-6 mt-4 flex-1 flex flex-col w-full">
            {type === "user" && (
              <>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                  {item.username}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  @{item.profileName || "guest"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                  {item.description || "This user hasn’t written a bio yet."}
                </p>

                {/* زر احترافي */}
                <button
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg hover:opacity-95 transition"
                >
                  <FiUserPlus size={16} /> Follow
                </button>
              </>
            )}

            {type === "community" && (
              <>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                  {item?.Name || "Unnamed Community"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {item.members?.length || 0} members
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                  {item.description || "Join our community and start engaging."}
                </p>

                {/* زر احترافي للجروبات */}
                <button
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg hover:opacity-95 transition"
                >
                  <Users size={16} /> Join
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
