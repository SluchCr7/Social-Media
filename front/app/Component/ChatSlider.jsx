'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useMessage } from '../Context/MessageContext';
import { useAuth } from '../Context/AuthContext';
import UserCard from './UserCard';

const ChatSlider = () => {
    const { users, setSelectedUser , backgroundStyle } = useMessage();
    const { onlineUsers , user} = useAuth();
    const [searchValue, setSearchValue] = useState("")
    const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchValue.toLowerCase()));
    return (
        <aside style={backgroundStyle} className="w-full min-h-[100vh] bg-lightMode-menu flex items-center md:items-start flex-col dark:bg-darkMode-menu border-r border-gray-700 p-4 shadow-inner overflow-y-auto">
            {/* Header */}
            <div className="flex items-center w-full justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Image 
                        src={user?.profilePhoto?.url}
                        alt="profile" 
                        width={40} 
                        height={40} 
                        className="rounded-full object-cover w-10 h-10"
                    />
                    <div className="hidden flex-col md:flex">
                        <span className="font-semibold text-dark dark:text-white text-sm">{user?.username}</span>
                        <span className="text-gray-800 dark:text-gray-400 text-xs">{user?.profileName}</span>
                    </div>
                </div>
                <BsThreeDots className="text-gray-800 hidden md:block dark:text-gray-400 text-xl cursor-pointer hover:text-white transition" />
            </div>

            {/* Search Bar */}
            <input 
                type="search" 
                placeholder="Search users..." 
                className="w-full bg-lightMode-menu dark:bg-darkMode-menu border border-gray-300 dark:border-gray-600 text-sm text-black dark:text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fg/20 transition mb-4"
                value={searchValue}
                onChange={(e)=> setSearchValue(e.target.value)}
            />

            {/* User List */}
            <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                    <div className="text-center text-lightMode-text dark:text-darkMode-text text-sm mt-10">No users found</div>
                ) : (
                    filteredUsers.map((user) => (
                        <UserCard
                            key={user.id} 
                            user={user} 
                            isOnline={onlineUsers?.includes(user.id)} 
                            onSelect={() => setSelectedUser(user)} 
                        />
                    ))
                )}
            </div>
        </aside>
    );
};

export default ChatSlider;

