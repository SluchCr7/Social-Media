'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaUsers, FaCrown, FaUserFriends } from 'react-icons/fa'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon className="text-indigo-500 text-lg" />
    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
  </div>
)

const EmptyState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-8 opacity-70">
    <FaUsers className="text-4xl text-gray-400 mb-3" />
    <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
  </div>
)

const CommunityCard = ({ community }) => {
  const router = useRouter()  // ✅ أضف هذا السطر

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => router.push(`/Pages/Community/${community._id}`)}
    >
      <div className="relative w-14 h-14 rounded-full overflow-hidden">
        <Image
          src={community?.Picture?.url || '/default-community.png'}
          alt={community?.Name || 'Community'}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-base font-medium text-gray-800 dark:text-gray-100">
          {community?.Name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {community?.members?.length || 0} members
        </p>
      </div>
    </motion.div>
  )
}


const CommunitySection = ({ title, icon, communities, emptyMessage }) => (
  <div className="mb-8">
    <SectionHeader icon={icon} title={title} />
    {communities?.length > 0 ? (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((c) => (
          <CommunityCard key={c._id} community={c} />
        ))}
      </div>
    ) : (
      <EmptyState text={emptyMessage} />
    )}
  </div>
)

const CommunityTab = ({ user }) => {
  const { communities = [], adminCommunities = [], joinedCommunities = [] } = user || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-10 bg-gray-50 dark:bg-black/20 rounded-3xl"
    >
      <CommunitySection
        title="My Communities"
        icon={FaUsers}
        communities={communities}
        emptyMessage="You haven't created any communities yet."
      />

      <CommunitySection
        title="Admin Communities"
        icon={FaCrown}
        communities={adminCommunities}
        emptyMessage="You are not an admin in any community yet."
      />

      <CommunitySection
        title="Joined Communities"
        icon={FaUserFriends}
        communities={joinedCommunities}
        emptyMessage="You haven't joined any communities yet."
      />
    </motion.div>
  )
}

export default CommunityTab
