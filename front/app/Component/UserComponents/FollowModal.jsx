'use client'
import Image from 'next/image'
import { FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const FollowModal = ({ visible, onClose, type, list }) => {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full md:w-[480px] bg-lightMode-menu dark:bg-darkMode-menu rounded-t-2xl md:rounded-2xl p-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{type === 'followers' ? 'Followers' : 'Following'}</h3>
          <button onClick={onClose} className="text-gray-500 text-xl">&times;</button>
        </div>

        {list?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {list.map((p) => (
              <div
                key={p._id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition"
              >
                <Image
                  src={p.profilePhoto?.url || '/default-profile.png'}
                  alt={p.username}
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-sm">{p.username}</div>
                  <div className="text-xs text-gray-400">{p.profileName}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-6">No results</div>
        )}
      </motion.div>
    </div>
  )
}

export default FollowModal
