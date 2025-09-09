'use client';
import React, { useEffect, useState } from 'react';
import { FiSearch, FiX, FiUserPlus } from 'react-icons/fi';
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
      const filtered = users.filter(
        (u) =>
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          (u.profileName &&
            u.profileName.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-10 bg-gray-50">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-900">🔍 Find People</h2>
        <p className="text-gray-600 mt-2">
          Connect with new friends and grow your community.
        </p>
      </div>

      {/* Search Box */}
      <div className="relative max-w-2xl mx-auto mb-12">
        <input
          type="search"
          placeholder="Search by username or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-12 pr-12 rounded-2xl bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition"
        />
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* User Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers
            .filter((u) => u._id !== user._id)
            .map((u) => (
              <div
                key={u._id}
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <Image
                    src={u.profilePhoto?.url || '/default-avatar.png'}
                    alt="profile"
                    width={80}
                    height={80}
                    className="rounded-full object-cover w-20 h-20 ring-2 ring-indigo-500"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {u.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {u.profileName || 'No bio available'}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/Pages/User/${u._id}`}
                      className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg shadow hover:bg-indigo-700 transition"
                    >
                      View Profile
                    </Link>
                    <button className="px-3 py-1.5 border border-indigo-600 text-indigo-600 text-sm rounded-lg hover:bg-indigo-50 transition">
                      <FiUserPlus size={16} className="inline mr-1" />
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : search.trim() ? (
          <div className="col-span-full flex flex-col items-center text-center text-gray-500 py-20">
            <Image
              src="/empty.svg"
              alt="No results"
              width={180}
              height={180}
              className="mb-6"
            />
            <p className="text-lg">
              No users found for{' '}
              <span className="font-medium text-indigo-600">{search}</span>.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Try searching with another keyword.
            </p>
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
