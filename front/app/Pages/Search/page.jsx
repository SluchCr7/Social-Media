'use client'
import React, { useEffect, useState } from 'react'
import { FiUserPlus, FiX } from "react-icons/fi"
import { useAuth } from '../../Context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { generateMeta } from '@/app/utils/MetaDataHelper'


const Search = () => {
  const { users, user } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers([]);
      return;
    }

    if (Array.isArray(users)) {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  return (
    <div className="w-full min-h-screen px-6 py-10">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-semibold text-lightMode-fg dark:text-darkMode-fg mb-6">Search Users</h2>

      {/* Search Input */}
      <input
        type="search"
        placeholder="Search by username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full py-3 px-5 rounded-xl bg-[#1e1e1e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition mb-8"
      />

      {/* User Results */}
      <div className="grid grid-cols-1  gap-5">
        {filteredUsers.length > 0 ? (
          filteredUsers
            .filter(userAnother => userAnother._id !== user._id)
            .map(userAnother => (
              <Link 
                href={`/Pages/User/${userAnother._id}`}
                key={userAnother._id}
                className="bg-[#1a1a1a] hover:bg-[#232323] transition rounded-2xl p-4 flex items-center gap-4 shadow-lg"
              >
                <Image
                  src={userAnother.profilePhoto.url}
                  alt="profile"
                  width={48}
                  height={48}
                  className="rounded-full w-12 h-12 object-cover"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold text-base">{userAnother.username}</p>
                  <p className="text-gray-400 text-sm">{userAnother.profileName}</p>
                </div>
                <button className="text-gray-300 hover:text-white transition" aria-label="Toggle Follow">
                  {
                    user.following.includes(userAnother._id) ? (
                      <FiX size={20} />
                    ) : (
                      <FiUserPlus size={20} />
                    )
                  }
                </button>
              </Link>
            ))
        ) : (
          search.trim() && (
            <div className="col-span-full text-center text-gray-500 text-base py-20">
              No users found matching <span className="font-semibold text-white">`&apos;`{search}`&apos;`</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Search;
