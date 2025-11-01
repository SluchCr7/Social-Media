'use client'
import React, { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserCog, FaTrashAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import ToggleSwitch from '@/app/Component/Setting/ToggleSwitch'

const AccountTab = React.memo(({
  user,
  isVerified,
  setIsVerified,
  onMakePremiumVerify,
  showConfirmDelete,
  setShowConfirmDelete,
  handleDelete
}) => {
  const { t } = useTranslation()

  // ✅ تحسين الأداء باستخدام useCallback لتجنب إعادة إنشاء الدوال في كل ريندر
  const handleVerifyToggle = useCallback(
    (v) => {
      setIsVerified(v)
      onMakePremiumVerify(v)
    },
    [setIsVerified, onMakePremiumVerify]
  )

  const confirmDelete = useCallback(() => {
    setShowConfirmDelete(true)
  }, [setShowConfirmDelete])

  const cancelDelete = useCallback(() => {
    setShowConfirmDelete(false)
  }, [setShowConfirmDelete])

  return (
    <motion.section
      key="account"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border shadow space-y-4 w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg">
          <FaUserCog />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t('Account')}</h2>
          <p className="text-sm text-gray-500">
            {t('Manage privacy, verification and account actions.')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Premium Verification */}
        <div className="rounded-lg p-4 border bg-white/50 dark:bg-gray-800/50">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium">{t('Premium verified')}</div>
              <div className="text-sm text-gray-500">
                {t('Get a verified badge and priority support.')}
              </div>
            </div>
            <ToggleSwitch
              checked={isVerified}
              onChange={handleVerifyToggle}
              onColor="bg-yellow-400"
            />
          </div>
        </div>

        {/* Delete Account */}
        <div className="md:col-span-2 rounded-lg p-4 border bg-white/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-red-600 dark:text-red-400">
                {t('Danger zone')}
              </div>
              <div className="text-sm text-gray-500">
                {t('Delete account and data permanently.')}
              </div>
            </div>
            <button
              onClick={confirmDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <FaTrashAlt /> {t('Delete account')}
            </button>
          </div>

          {/* Confirm Delete Modal */}
          <AnimatePresence>
            {showConfirmDelete && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-600"
              >
                <div className="text-sm">
                  {t('Are you sure? This action cannot be undone.')}
                </div>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    {t('Yes, delete')}
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    {t('Cancel')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
})

AccountTab.displayName = 'AccountTab'

export default AccountTab
