import LoginHistoryTimeline from '@/app/Component/Setting/LoginHistoryTimeline'
import React from 'react'
import { motion } from 'framer-motion'
import { FaHistory } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
const HistoryTab = ({ loginHistory }) => {
  const {t} = useTranslation()
  return (
    <motion.section
        key="history"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28 }}
        className="p-6 rounded-2xl w-full bg-white/60 dark:bg-gray-900/60 border shadow"
    >
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 text-white shadow-lg"><FaHistory /></div>
            <div>
            <h2 className="text-lg font-semibold">{t("Login History")}</h2>
            <p className="text-sm text-gray-500">{t("Recent sign-ins and devices.")}</p>
            </div>
        </div>

        <LoginHistoryTimeline items={loginHistory} />
    </motion.section>
  )
}

export default HistoryTab