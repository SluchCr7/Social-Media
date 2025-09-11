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
    <div className="w-full max-h-[500px] overflow-hidden bg-white dark:bg-[#16181c] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">Communities</h2>
      </div>

      {/* Body */}
      <div className="flex flex-col w-full px-4 py-3 space-y-3 overflow-y-auto">
        {communities?.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">No communities to join.</p>
        ) : (
          communities?.slice(0, 3).map((community) => {
            const isJoined = community?.members?.some(
              (member) => member._id === user._id
            )

            return (
              <div
                key={community?._id}
                className="flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer group"
              >
                <Link
                  className="flex items-center gap-3"
                  href={`/Pages/Community/${community?._id}`}
                >
                  <div className="relative w-12 h-12">
                    <Image
                      src={community?.Picture?.url || '/placeholder.png'}
                      alt="community"
                      width={48}
                      height={48}
                      className="rounded-full object-cover w-full h-full ring-1 ring-gray-200 dark:ring-gray-700 transition-all group-hover:ring-green-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-gray-900 dark:text-gray-100 text-base font-semibold">{community?.Name}</h2>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                        ? 'border-gray-400 text-gray-400 cursor-not-allowed opacity-60'
                        : 'border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white transform hover:scale-105'
                    }`}
                    onClick={() => !isJoined && joinToCommunity(community._id)}
                    disabled={isJoined}
                  >
                    {isJoined ? <FaCheck className="text-sm" /> : <FaPlus className="text-sm" />}
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* See More Button if communities > 3 */}
      {communities?.length > 3 && (
        <div className="px-4 py-3 border-t border-gray-300 dark:border-gray-600">
          <Link
            href="/Pages/Communities"
            className="w-full text-center text-sm font-medium text-blue-500 hover:underline"
          >
            See More Communities
          </Link>
        </div>
      )}
    </div>
  )
}

export default Communities
