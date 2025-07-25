'use client'
import React from 'react'
import { useCommunity } from '../Context/CommunityContext'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../Context/AuthContext'
import { FaPlus, FaCheck, FaUsers } from 'react-icons/fa'

const Communities = () => {
  const { communities, joinToCommunity } = useCommunity()
  const { user } = useAuth()

  return (
    <div className="w-full bg-white dark:bg-[#16181c] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col max-h-[500px] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-lightMode-fg/40 dark:border-darkMode-fg/40">
        <h2 className="text-lightMode-fg dark:text-darkMode-fg text-lg font-semibold">Communities</h2>
      </div>

      {/* Body */}
      <div className="flex flex-col items-start w-full px-4 py-2 space-y-2 overflow-y-auto">
        {communities?.length === 0 ? (
          <p className="text-lightMode-fg dark:text-darkMode-fg/60">No communities to join.</p>
        ) : (
          communities
            ?.slice(0, 3)
            .map((community) => {
              const isJoined = community?.members?.some(
                (member) => member._id === user._id
              )

              return (
                <div
                  key={community?._id}
                  className="flex items-center justify-between px-2 py-3 hover:bg-darkMode-fg/5 transition-all cursor-pointer w-full rounded-lg group"
                >
                  <Link
                    className="flex items-center gap-3"
                    href={`/Pages/Community/${community?._id}`}
                  >
                    <Image
                      src={community?.Picture?.url}
                      alt="community"
                      width={40}
                      height={40}
                      className="rounded-full w-10 h-10 object-cover ring-1 ring-darkMode-fg/10"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-lightMode-fg dark:text-darkMode-fg text-sm font-semibold">
                        {community?.Name}
                      </h2>
                      <span className="flex items-center gap-1 text-xs text-muted dark:text-gray-400 mt-1">
                        <FaUsers className="text-[10px]" />
                        {community?.members?.length || 0} members
                      </span>
                    </div>
                  </Link>

                  {community?.owner?._id === user?._id ? (
                    <p className="text-xs font-medium px-3 py-1.5 rounded-md border border-blue-500 text-blue-500">
                      Owner
                    </p>
                  ) : (
                    <button
                      className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md border transition-all duration-200 ${
                        isJoined
                          ? 'border-gray-400 text-gray-400 cursor-not-allowed'
                          : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
                      }`}
                      onClick={() => !isJoined && joinToCommunity(community._id)}
                      disabled={isJoined}
                    >
                      {isJoined ? (
                        <FaCheck className="text-sm" />
                      ) : (
                        <FaPlus className="text-sm" />
                      )}
                    </button>
                  )}
                </div>
              )
            })
        )}
      </div>
    </div>
  )
}

export default Communities
