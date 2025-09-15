'use client'
import React from "react";
import Image from "next/image";
import { FiUserPlus } from "react-icons/fi";
import { Users } from "lucide-react";

export const SuggestionRow = ({ type, data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
      {data.map((item) => (
        <div
          key={item._id || item.id}
          className="flex flex-col justify-between bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-5 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        >
          {/* الصورة */}
          <div className="w-24 h-24 mx-auto rounded-full p-[3px] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 shadow-md">
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

          {/* المحتوى */}
          <div className="mt-4 flex-1 flex flex-col justify-between">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                {item.username || item?.Name || "Unnamed"}
              </h3>
              {type === "user" && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  @{item.profileName || "guest"}
                </p>
              )}
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mt-2">
                {item.description ||
                  (type === "user"
                    ? "This user hasn’t written a bio yet."
                    : "Join our community and start engaging.")}
              </p>
            </div>

            {/* الأزرار */}
            <button
              className={`mt-4 w-full py-2.5 rounded-xl text-sm font-medium text-white shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 ${
                type === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                  : "bg-gradient-to-r from-green-400 to-blue-500"
              }`}
            >
              {type === "user" ? <FiUserPlus size={16} /> : <Users size={16} />}
              {type === "user" ? "Follow" : "Join"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionRow;
