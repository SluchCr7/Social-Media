import React from "react";
import Image from "next/image";
import { useAuth } from "../Context/AuthContext";

export const SuggestionRow = ({ type, data }) => {
  if (!data || data.length === 0) return null;
  const {followUser} = useAuth()
  return (
    <div className="flex gap-6 overflow-x-auto pb-3">
      {data.map((item) => (
        <div
          key={item._id || item.id}
          className="min-w-[200px] flex-shrink-0 p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        >
          {/* ✅ User Card */}
          {type === "user" && (
            <>
              <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 mb-3">
                {item.profilePhoto ? (
                  <Image
                    src={item?.profilePhoto?.url}
                    alt={item.username || "User"}
                    width={64}
                    height={64}
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-gray-300">
                    {item.username?.[0] || "U"}
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                {item.username}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                @{item.profileName || "guest"}
              </p>
              <button className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition">
                Follow
              </button>
            </>
          )}
{/*  onClick={()=> followUser(item._id)} */}
          {/* ✅ Community Card */}
          {type === "community" && (
            <>
              <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-green-400 via-blue-400 to-purple-500 mb-3">
                {item.image ? (
                  <Image
                    src={item?.Picture?.url}
                    alt={item?.Name || "Community"}
                    width={64}
                    height={64}
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-300 dark:bg-blue-700 flex items-center justify-center text-lg font-bold text-white">
                    {item?.Name?.[0] || "C"}
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                {item?.Name || "Unnamed"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {item.members?.length || 0} members
              </p>
              <button className="px-4 py-1.5 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition">
                Join
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SuggestionRow;
