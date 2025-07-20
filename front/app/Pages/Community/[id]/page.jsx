'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/app/Context/AuthContext'
import { useCommunity } from '@/app/Context/CommunityContext'
import { usePost } from '@/app/Context/PostContext'
import SluchitEntry from '@/app/Component/SluchitEntry'
import EditCommunityMenu from '@/app/Component/EditCommunityMenu'
import Loading from '@/app/Component/Loading'

import {
  FaPlus,
  FaEdit,
  FaUsers,
  FaTrashAlt,
  FaCrown,
  FaUser,
} from 'react-icons/fa'

const ActionButton = ({ children, onClick, variant = 'primary' }) => {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    dark: 'bg-gray-800 hover:bg-gray-900',
  }
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm ${styles[variant]} text-white py-1.5 px-4 rounded-md transition`}
    >
      {children}
    </button>
  )
}

const Page = ({ params }) => {
  const id = params?.id
  const [CommunitySelected, setCommunitySelected] = useState(null)
  const { communities, joinToCommunity, removeMember, makeAdmin } = useCommunity()
  const { user } = useAuth()
  const { posts } = usePost()

  const [postsFiltered, setPostsFiltered] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const matched = communities?.find((c) => c._id === id)
    if (matched) setCommunitySelected(matched)
  }, [communities, id])

  useEffect(() => {
    const filtered = posts?.filter((post) => post?.community?._id === id)
    setPostsFiltered(filtered)
  }, [posts, id])

  if (!CommunitySelected) {
    return (
      <div className="flex justify-center items-center min-h-[100vh] text-gray-500 w-full">
        <Loading />
      </div>
    )
  }

  const isOwner = (memberId) => {
    return CommunitySelected.owner === memberId || CommunitySelected.owner?._id === memberId
  }

  const isAdmin = (memberId) =>
    CommunitySelected?.Admins?.some((a) => a === memberId || a?._id === memberId)

  const filteredMembers = CommunitySelected?.members?.filter(
    (m) =>
      m?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m?.profileName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isJoined = CommunitySelected.members?.some((m) => m._id === user._id)

  return (
    <div className="w-[100%] md:w-[70%] max-w-5xl mx-auto text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen">
      {/* Cover Section */}
      <div className="relative w-full">
        <Image
          src={CommunitySelected?.Cover?.url || '/default-cover.jpg'}
          alt="Cover"
          width={1200}
          height={300}
          className="w-full h-[200px] object-cover rounded-b-xl shadow"
        />
        <div className="absolute inset-0 bg-black/30 rounded-b-xl" />

        <div className="absolute left-6 -bottom-12">
          <Image
            src={CommunitySelected?.Picture?.url || '/default-avatar.png'}
            alt="Avatar"
            width={100}
            height={100}
            className="w-24 h-24 rounded-full border-4 border-white dark:border-darkMode-bg object-cover shadow-md"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-20 px-4 flex flex-col gap-5">
        <div className=" text-black dark:text-white">
          <h1 className="text-2xl font-bold">
            {CommunitySelected?.Name}{' '}
            <span className="text-xs bg-white/30 px-2 py-0.5 rounded">
              {CommunitySelected?.isPrivate ? 'Private' : 'Public'}
            </span>
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(isOwner(user?._id) || isAdmin(user?._id)) && (
              <>
                <ActionButton onClick={() => setShowEdit(true)} variant="warning">
                  <FaEdit /> Edit
                </ActionButton>
                <ActionButton onClick={() => setShowMembers(true)} variant="dark">
                  <FaUsers /> Members
                </ActionButton>
              </>
            )}
            {!isOwner(user?._id) && (
              <ActionButton
                onClick={() => joinToCommunity(CommunitySelected._id)}
                variant={isJoined ? 'danger' : 'primary'}
              >
                <FaPlus /> {isJoined ? 'Leave' : 'Join'}
              </ActionButton>
            )}
          </div>
        </div>

        {/* Description */}
        {CommunitySelected?.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
            {CommunitySelected.description}
          </p>
        )}

        {/* Members Summary */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FaUser /> {CommunitySelected?.members?.length || 0} Members
          </p>
          <div className="flex -space-x-3">
            {CommunitySelected?.members?.slice(0, 5).map((member) => (
              <Image
                key={member._id}
                src={member?.profilePhoto?.url || '/default-avatar.png'}
                alt="Member"
                width={30}
                height={30}
                className="w-9 h-9 rounded-full border-2 border-white dark:border-darkMode-bg object-cover shadow"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-lightMode-fg/20 dark:border-darkMode-fg/20 mx-4" />

      {/* Posts Section */}
      <div className="px-4 flex flex-col gap-6 pb-10">
        {postsFiltered?.length > 0 ? (
          postsFiltered.map((post) => <SluchitEntry post={post} key={post._id} />)
        ) : (
          <div className="text-center text-gray-400 text-sm py-12 bg-gray-100 dark:bg-darkMode-menu rounded-lg">
            This community has no posts yet.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <EditCommunityMenu
          community={CommunitySelected}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* Members Modal */}
      {showMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-darkMode-menu rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowMembers(false)}
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-500"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-center mb-4">
              Community Members
            </h3>

            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-4 p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-darkMode-bg"
            />

            <div className="max-h-96 overflow-y-auto flex flex-col gap-4">
              {filteredMembers?.map((member) => {
                const isMemberAdmin = isAdmin(member._id)
                if (!member) return null
                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={member?.profilePhoto?.url || '/default-avatar.png'}
                        alt="Member"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                          {member?.username}
                          {isOwner(member._id) && (
                            <span className="text-xs bg-yellow-400 text-white px-2 py-0.5 rounded-full">
                              Owner
                            </span>
                          )}
                          {isMemberAdmin && !isOwner(member._id) && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                              Admin
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{member?.profileName}</p>
                      </div>
                    </div>

                    {(isOwner(user._id) || isAdmin(user._id)) && !isOwner(member._id) && (
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => makeAdmin(CommunitySelected._id, member._id)}
                          title={isMemberAdmin ? 'Remove Admin' : 'Make Admin'}
                        >
                          <FaCrown
                            className={`hover:scale-110 transition ${
                              isMemberAdmin ? 'text-yellow-600' : 'text-yellow-400'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => removeMember(CommunitySelected._id, member._id)}
                        >
                          <FaTrashAlt className="text-red-500 hover:text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page;
