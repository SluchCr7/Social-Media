'use client'
import * as HoverCard from '@radix-ui/react-hover-card'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '../Context/AuthContext'
import { useEffect } from 'react'

const UserHoverCard = ({ userSelected, children }) => {
    const { followUser, user } = useAuth()
    useEffect(()=>{
      console.log(userSelected)
    },[userSelected])
    if (!userSelected) return null;
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        {children || (
          <Link
            href={`/Pages/User/${userSelected?._id}`}
            className="font-semibold text-sm text-lightMode-fg dark:text-darkMode-fg hover:underline"
          >
            {userSelected?.username}
          </Link>
        )}
      </HoverCard.Trigger>

      {/* المحتوى اللي يبان عند الـ hover */}
      <HoverCard.Portal>
        <HoverCard.Content
          side="right"
          sideOffset={8}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                     p-4 rounded-xl shadow-xl w-64 z-50"
        >
          <div className="flex items-center gap-3">
            <Image
              src={userSelected?.profilePhoto?.url || '/default-avatar.png'}
              alt="userSelected"
              width={50}
              height={50}
              className="rounded-full w-12 h-12 object-cover"
            />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white">{userSelected?.username}</span>
              <span className="text-sm text-gray-500">@{userSelected?.profileName}</span>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {userSelected?.description || "No bio available"}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span><b>{userSelected?.followers?.length || 0}</b> Followers</span>
            <span><b>{userSelected?.following?.length || 0}</b> Following</span>
          </div>

          <div className="mt-3">
            <button onClick={() => followUser(userSelected._id)} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 rounded-lg">
                {user?.following?.includes(userSelected._id)
                    ? 'Unfollow User'
                    : 'Follow User'}
            </button>
          </div>

          <HoverCard.Arrow className="fill-white dark:fill-gray-900" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}

export default UserHoverCard
