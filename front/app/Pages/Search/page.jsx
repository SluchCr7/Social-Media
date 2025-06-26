'use client'
import React, { useEffect, useState } from 'react'
import { FiUserPlus, FiX } from "react-icons/fi"
import { useAuth } from '../../Context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'

const Search = () => {
  const { users } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers([]); // Clear results if search is empty
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
    <div className={`transition-all duration-500 w-full`}>
    <div className={`transform transition-all duration-700 ease-in-out  
        w-[100%] ml-2 p-6 relative`}>

        {/* Search Input */}
        <input
          type="search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-2 px-4 my-3 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none mb-4"
        />

        {/* User Results */}
        <div className="flex flex-col gap-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <Link 
                href={`/Pages/User/${user._id}`}
                key={user._id}
                className="flex justify-between items-center bg-[#252525] p-4 rounded-lg hover:bg-[#2f2f2f] transition"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={user.profilePhoto.url}
                    alt="profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-10 h-10"
                  />
                  <div className="flex flex-col">
                    <span className="text-lightMode-text dark:text-darkMode-text font-medium">{user.username}</span>
                    <span className="text-gray-500 text-sm">{user.profileName}</span>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-white" aria-label="Add User">
                  <FiUserPlus size={20} />
                </button>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 text-sm flex items-center justify-center w-full min-h-[50vh]">No users found</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
