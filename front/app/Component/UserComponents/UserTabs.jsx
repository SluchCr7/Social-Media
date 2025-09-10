'use client'
import { motion } from 'framer-motion'

const tabs = ['Posts', 'Saved', 'Comments']

const UserTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex gap-6 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 relative font-semibold text-sm ${
              activeTab === tab ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.span layoutId="underline" className="absolute -bottom-[1px] left-0 right-0 h-1 bg-purple-500 rounded" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default UserTabs
