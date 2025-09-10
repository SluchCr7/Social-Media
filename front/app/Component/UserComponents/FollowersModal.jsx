'use client'
import Image from 'next/image'
import { FiX } from 'react-icons/fi'

const FollowersModal = ({ title, users = [], onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[65vh] px-4 py-2">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={user?.profilePhoto?.url || '/default-profile.png'}
                    alt={user?.username || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user?.username}</span>
                  <span className="text-xs text-gray-500">{user?.profileName}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">No users found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FollowersModal
