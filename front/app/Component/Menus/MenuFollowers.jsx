'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useAuth } from '../../Context/AuthContext';
import Link from 'next/link';
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri';
import { useUser } from '@/app/Context/UserContext';

const MenuFollowers = () => {
  const { user, users } = useAuth();
  const [myUser, setMyUser] = useState(null);
  const {followUser} = useUser()
  useEffect(() => {
    const currentUser = users.find((userObj) => userObj._id === user?._id);
    setMyUser(currentUser);
  }, [users, user]);

  const followers = Array.isArray(myUser?.followers)
    ? [...myUser.followers].sort(() => Math.random() - 0.5).slice(0, 4)
    : [];

  return (
    <div className="w-full bg-white dark:bg-[#16181c] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-lightMode-fg/40 dark:border-darkMode-fg/40 bg-gradient-to-r from-indigo-500 to-blue-600">
        <h2 className="text-lightMode-fg dark:text-darkMode-fg text-lg font-semibold">Followers</h2>
      </div>

      {/* Scrollable follower list */}
      <div className="flex flex-col w-full">
        {followers.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-lightMode-fg/60 dark:text-darkMode-fg/60">
            You don’t have followers yet.
          </p>
        ) : (
          followers.map((follower) => (
            <div
              key={follower._id}
              className="flex items-center justify-between px-4 py-3 hover:bg-darkMode-fg/5 transition-all cursor-pointer w-full group"
            >
              <Link href={`/Pages/User/${follower._id}`} className="flex items-center gap-3">
                <Image
                  src={follower?.profilePhoto?.url || '/default-avatar.png'}
                  alt="profile"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-cover ring-1 ring-darkMode-fg/10"
                />
                <div className="flex flex-col">
                  <span className="text-lightMode-fg dark:text-darkMode-fg font-medium text-sm">
                    {follower?.username}
                  </span>
                  <span className="text-gray-400 text-xs">{follower?.profileName}</span>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuFollowers;
