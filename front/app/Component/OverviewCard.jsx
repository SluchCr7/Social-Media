import React from 'react'
import { motion } from 'framer-motion'
const OverviewCard = ({ title, value,formatNumber,children }) => (
    <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-800 shadow-[0_8px_30px_rgba(2,6,23,0.6)]"
    >
        <div className="flex items-start justify-between gap-3">
        <div>
            <div className="text-xs text-gray-400">{title}</div>
            <div className="text-2xl font-semibold text-white">{formatNumber(value)}</div>
        </div>
        <div className="w-16 h-10 flex items-center justify-center text-white/80">{children}</div>
        </div>
    </motion.div>
)


export default OverviewCard