'use client'
import Image from 'next/image'
import { FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
const FollowModal = memo(({ visible, onClose, type, list }) => {
  const {t} = useTranslation()
  if (!visible) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center">
      <AnimatePresence>
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="
            w-full md:w-[460px]
            bg-lightMode-menu dark:bg-darkMode-menu
            border border-lightMode-text/10 dark:border-darkMode-text/20
            rounded-t-2xl md:rounded-2xl shadow-xl
            p-5 max-h-[80vh] overflow-y-auto
            transition-colors duration-300
          "
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-lightMode-text/10 dark:border-darkMode-text/20 pb-2">
            <h3 className="text-base sm:text-lg font-semibold text-lightMode-text2 dark:text-darkMode-text">
              {type === 'followers' ? t('Followers') : t('Following')}
            </h3>
            <button
              onClick={onClose}
              className="
                text-lightMode-text2 dark:text-gray-400
                hover:text-lightMode-text dark:hover:text-darkMode-text
                transition text-xl
              "
            >
              <FiX />
            </button>
          </div>

          {/* List */}
          {list?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {list.map((p) => (
                <Link
                  href={`/Pages/User/${p._id}`}
                  key={p._id}
                  className="
                    flex items-center gap-3 p-3 rounded-xl
                    hover:bg-lightMode-bg/60 dark:hover:bg-darkMode-bg/60
                    border border-transparent hover:border-lightMode-text/10 dark:hover:border-darkMode-text/20
                    transition duration-200
                  "
                >
                  <Image
                    src={p?.profilePhoto?.url || '/default-profile.png'}
                    alt="User Profile"
                    width={48}
                    height={48}
                    className="rounded-full w-12 h-12 min-w-12 aspect-square object-cover ring-1 ring-lightMode-text/10 dark:ring-darkMode-text/30"
                  />
                  <div>
                    <div className="font-semibold text-sm text-lightMode-text dark:text-darkMode-text hover:text-lightMode-text transition">
                      {p.username}
                    </div>
                    <div className="text-xs text-lightMode-text2/70 dark:text-gray-400">
                      {p.profileName}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
              {t("No results found.")}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
})
FollowModal.displayName = 'FollowModal'
export default FollowModal
