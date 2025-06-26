'use client'
import Image from 'next/image';
import React, { useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useAuth } from '../Context/AuthContext';
import Link from 'next/link';
import { RiUserFollowLine } from "react-icons/ri";
import { RiUserUnfollowLine } from "react-icons/ri";
const followers = [
  {
    id: 1,
    username: 'john_doe',
    displayName: 'John Doe',
    avatar: '/Home.jpg',
  },
  {
    id: 2,
    username: 'jane_smith',
    displayName: 'Jane Smith',
    avatar: '/Home.jpg',
  },
  {
    id: 3,
    username: 'cool_user',
    displayName: 'Cool User',
    avatar: '/Home.jpg',
  },
];

const MenuFollowers = () => {
  const {user , users} = useAuth()
  const [myUser , setMyUser] = React.useState(null)
  useEffect(() => {
    setMyUser(users.find((userobj) => userobj._id === user._id))
  }, [users])
  return (
    <div className="w-full bg-lightMode-menu dark:bg-darkMode-menu rounded-xl shadow-lg flex flex-col max-h-[500px]">
      
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b  border-lightMode-fg/40 dark:border-darkMode-fg/40">
        <h2 className="text-lightMode-fg dark:text-darkMode-fg text-lg font-semibold">Followers</h2>
        <FiSearch className="text-lightMode-fg dark:text-darkMode-fg text-xl cursor-pointer hover:text-primary transition" />
      </div>

      {/* Scrollable follower list */}
      <div className="flex flex-col w-full">
        {myUser?.followers?.map((follower) => (
          <div
            
            key={follower._id}
            className="flex items-center justify-between px-4 py-3 hover:bg-darkMode-fg/5 transition-all cursor-pointer w-full group"
          >
            <Link href={`/Pages/User/${follower._id}`} className="flex items-center gap-3">
              <Image
                src={follower?.profilePhoto?.url}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover ring-1 ring-darkMode-fg/10"
              />
              <div className="flex flex-col">
                <span className="text-lightMode-fg dark:text-darkMode-fg font-medium text-sm">{follower?.username}</span>
                <span className="text-gray-400 text-xs">@{follower?.profileName}</span>
              </div>
            </Link>
            <button>{follower?.followers?.includes(user?._id) ? <RiUserFollowLine className="text-primary" /> : <RiUserUnfollowLine className="text-primary" />}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuFollowers;
