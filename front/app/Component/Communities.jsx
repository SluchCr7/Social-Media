import React from 'react'
import { useCommunity } from '../Context/CommunityContext'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../Context/AuthContext'

const Communities = () => {
    const {community , joinToCommunity} = useCommunity()
    const {user} = useAuth()
  return (
    <div className="w-full bg-lightMode-menu dark:bg-darkMode-menu rounded-xl shadow-lg flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b  border-lightMode-fg/40 dark:border-darkMode-fg/40">
        <h2 className="text-lightMode-fg dark:text-darkMode-fg text-lg font-semibold">Communities</h2>
      </div>

      {/* Body */}
      <div className="flex flex-col items-start w-full px-4 py-2 space-y-2">
        {community.length === 0 ? (
          <p className="text-lightMode-fg dark:text-darkMode-fg/60">No communities yet.</p>
        ) : (
          community.map((community) => (
            <Link
              href={`/Pages/Community/${community._id}`}
              key={community._id}
              className="flex items-center justify-between px-2 py-3 hover:bg-darkMode-fg/5 transition-all cursor-pointer w-full group"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={community?.Picture?.url}
                  alt="profile"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-cover ring-1 ring-darkMode-fg/10"
                />
                <div className="flex flex-col items-start">
                  <h2 className="text-lightMode-fg dark:text-darkMode-fg text-sm font-semibold">{community.Name}</h2>
                  <p className="text-muted text-lightMode-text dark:text-darkMode-text text-xs">{community.description}</p>
                </div>
              </div>
              <button className="text-lightMode-fg dark:text-darkMode-fg border border-lightMode-fg dark:border-darkMode-fg p-2 text-sm rounded-md" onClick={() => joinToCommunity(community._id)}>
                {
                  community.members.includes(user._id) ? 'Joined' : 'Join'
                }
              </button>
            </Link>
          )).slice(0, 3)
        )}
      </div>
    </div>
  )
}

export default Communities