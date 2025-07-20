'use client';
import React, { useEffect, useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../Context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

const Search = () => {
  const { users, user } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers([]);
      return;
    }

    if (Array.isArray(users)) {
      const filtered = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-10 bg-lightMode-bg dark:bg-darkMode-bg">
      {/* Title */}
      <h2 className="text-3xl font-bold text-lightMode-fg dark:text-darkMode-fg mb-8">
        🔍 Find People
      </h2>

      {/* Search Box */}
      <div className="relative mb-10">
        <input
          type="search"
          placeholder="Type a username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-5 pr-14 rounded-xl bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <FiUserPlus size={20} />
        </span>
      </div>

      {/* User Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers
            .filter((u) => u._id !== user._id)
            .map((u) => (
              <Link
                href={`/Pages/User/${u._id}`}
                key={u._id}
                className="group bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-md hover:shadow-xl hover:border-indigo-500 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={u.profilePhoto.url}
                      alt="profile"
                      width={56}
                      height={56}
                      className="rounded-full object-cover w-14 h-14 border-2 border-indigo-500"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {u.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {u.profileName}
                    </p>
                  </div>
                  <button className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-lg shadow-sm hover:bg-indigo-700 transition hidden group-hover:block">
                    View
                  </button>
                </div>
              </Link>
            ))
        ) : search.trim() ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-base py-20">
            No users found for <span className="font-medium text-indigo-600 dark:text-indigo-400">{search}</span>.
          </div>
        ) : (
          <div className="col-span-full text-center text-gray-400 py-10">
            Start typing to search for users...
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
