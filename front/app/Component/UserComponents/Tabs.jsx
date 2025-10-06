import React from 'react'
import { motion } from 'framer-motion'

const tabs = ['Posts', 'Saved', 'Comments', 'Reels', 'Photos', 'Music']

const Tabs = ({ activeTab, setActiveTab }) => (
  <div className="mt-6 border-b w-full border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
    <div className="flex gap-6 justify-start md:justify-around w-max md:w-[60%] mx-auto px-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-3 relative font-semibold text-sm whitespace-nowrap transition-colors duration-200 ${
            activeTab === tab
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-500 hover:text-purple-400'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <motion.span
              layoutId="underline"
              className="absolute -bottom-[1px] left-0 right-0 h-1 bg-purple-500 rounded"
            />
          )}
        </button>
      ))}
    </div>
  </div>
)

export default Tabs
