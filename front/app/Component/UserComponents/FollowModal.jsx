'use client'
import Image from 'next/image'
import { FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { useTranslate } from '@/app/Context/TranslateContext'

const FollowModal = memo(({ visible, onClose, type, list }) => {
  const { t } = useTranslation()
  const { isRTL } = useTranslate()

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 md:p-0">
      <AnimatePresence>
        {visible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-0"
            />

            {/* Modal */}
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`
                relative w-full md:w-[480px] z-10
                bg-white/80 dark:bg-[#1a1a1a]/90 backdrop-blur-2xl
                border border-white/20 dark:border-white/5
                shadow-2xl rounded-3xl overflow-hidden
                flex flex-col max-h-[85vh]
                ${isRTL ? 'text-right' : 'text-left'}
              `}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-gray-100/50 dark:border-gray-800/50 bg-white/50 dark:bg-black/20">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                  {type === 'followers' ? t('Followers') : t('Following')}
                  {list?.length > 0 && <span className="ml-2 text-sm font-normal text-gray-400">({list.length})</span>}
                </h3>
                <button
                  onClick={onClose}
                  className="
                    p-2 rounded-full
                    bg-gray-100 dark:bg-gray-800
                    text-gray-500 dark:text-gray-400
                    hover:bg-gray-200 dark:hover:bg-gray-700
                    hover:text-gray-900 dark:hover:text-white
                    transition-all duration-200
                  "
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* List */}
              <div className="overflow-y-auto p-4 custom-scrollbar flex-1">
                {list?.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {list.map((p, index) => (
                      <Link
                        href={`/Pages/User/${p._id}`}
                        key={p._id}
                        onClick={onClose}
                        className="
                          group flex items-center gap-4 p-3 rounded-2xl
                          bg-white dark:bg-white/5
                          hover:bg-gray-50 dark:hover:bg-white/10
                          border border-gray-100 dark:border-white/5
                          hover:border-gray-200 dark:hover:border-white/10
                          shadow-sm hover:shadow-md
                          transition-all duration-200
                        "
                      >
                        <div className="relative">
                          <Image
                            src={p?.profilePhoto?.url || '/default-profile.png'}
                            alt={p.username}
                            width={56}
                            height={56}
                            className="rounded-full w-14 h-14 object-cover ring-2 ring-white dark:ring-gray-800 group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {p.username}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {p.profileName || `@${p.username}`}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-3xl">
                      👀
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {t("No results found.")}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
})
FollowModal.displayName = 'FollowModal'
export default FollowModal
