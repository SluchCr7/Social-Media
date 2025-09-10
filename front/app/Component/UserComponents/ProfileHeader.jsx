'use client'
import Image from 'next/image'
import { BsPatchCheckFill } from 'react-icons/bs'

const ProfileHeader = ({ user, isCurrentUser, onEdit, onAddStory, followBtn }) => {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      {/* Avatar */}
      <div className="relative w-36 h-36 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden shadow-xl">
        <Image
          src={user?.profilePhoto?.url || '/default-profile.png'}
          alt="Profile photo"
          fill
          className="object-cover"
        />
      </div>

      {/* Username */}
      <div className="flex items-center gap-2 mt-3">
        <h1 className="text-2xl font-bold">{user?.username || 'Username'}</h1>
        {user?.isVerify && <BsPatchCheckFill className="text-blue-500 text-xl" title="Verified account" />}
      </div>
      <span className="text-sm text-gray-400">{user?.profileName || ''}</span>
      <p className="text-sm text-gray-500 max-w-xl">{user?.description || 'No bio yet.'}</p>

      {/* Actions */}
      <div className="flex gap-3 mt-3 flex-wrap">
        {isCurrentUser ? (
          <>
            <button onClick={onEdit} className="px-4 py-2 border rounded-lg text-sm hover:shadow">Edit profile</button>
            <button onClick={onAddStory} className="px-4 py-2 border rounded-lg text-sm hover:shadow">Add story</button>
          </>
        ) : (
          followBtn
        )}
      </div>
    </div>
  )
}

export default ProfileHeader
