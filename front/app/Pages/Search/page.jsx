'use client'
import React, { useEffect, useState } from 'react'
import { FiUserPlus, FiX } from "react-icons/fi"
import { useAuth } from '../../Context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'

const Search = () => {
  const { users, user } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Debounced Search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!search.trim()) {
        setFilteredUsers([]);
        return;
      }

      if (Array.isArray(users)) {
        const filtered = users
          .filter(u =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.profileName?.toLowerCase().includes(search.toLowerCase())
          )
          .sort((a, b) =>
            a.username.startsWith(search) ? -1 : b.username.startsWith(search) ? 1 : 0
          );

        setFilteredUsers(filtered);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
  }, [search, users]);

  return (
    <div className="w-full min-h-screen px-6 py-10 bg-lightMode-bg dark:bg-darkMode-bg">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-semibold text-lightMode-fg dark:text-white mb-6">
        Search Users
      </h2>

      {/* Search Input */}
      <input
        type="search"
        placeholder="Search by username or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full py-3 px-5 rounded-xl bg-[#1e1e1e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition mb-8"
      />

      {/* Results */}
      <div className="grid grid-cols-1 gap-5">
        {filteredUsers.length > 0 ? (
          filteredUsers
            .filter(u => u._id !== user._id)
            .map(u => (
              <Link
                key={u._id}
                href={`/Pages/User/${u._id}`}
                className="bg-[#1a1a1a] hover:bg-[#232323] transition-all rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-xl"
              >
                <Image
                  src={u.profilePhoto.url}
                  alt="profile"
                  width={56}
                  height={56}
                  className="rounded-full w-14 h-14 object-cover ring-2 ring-violet-500/40"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{u.username}</h3>
                  <p className="text-sm text-gray-400">{u.profileName}</p>
                </div>
                <button
                  className={`text-sm px-4 py-2 rounded-xl transition-all ${
                    user.following.includes(u._id)
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20'
                  }`}
                >
                  {user.following.includes(u._id) ? (
                    <span className="flex items-center gap-1"><FiX /> Unfollow</span>
                  ) : (
                    <span className="flex items-center gap-1"><FiUserPlus /> Follow</span>
                  )}
                </button>
              </Link>
            ))
        ) : (
          search.trim() && (
            <p className="text-center text-gray-400 italic py-20">
              No users found for "<span className="text-white font-medium">{search}</span>"
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Search;
