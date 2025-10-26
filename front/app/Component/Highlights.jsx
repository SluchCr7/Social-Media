'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { useHighlights } from '../Context/HighlightContext';
export default function HighlightsBar({
  highlights = [],
  onAddHighlight,
  isOwner = false
}) {
  const {setSelectedHighlight} = useHighlights()
  return (
    <div className="w-full flex flex-col items-center gap-3 py-4">
      <div className="flex w-full overflow-x-auto scrollbar-hide gap-4 px-3">
        {/* زر إنشاء Highlight جديد */}
        {isOwner && (
          <motion.div
            whileTap={{ scale: 0.9 }}
            onClick={onAddHighlight}
            className="
              flex-shrink-0 w-20 h-20 rounded-full border-2 border-dashed 
              border-gray-400 dark:border-gray-600 flex flex-col items-center 
              justify-center text-gray-500 dark:text-gray-400 cursor-pointer 
              hover:bg-lightMode-menu dark:hover:bg-darkMode-bg transition-colors
            "
          >
            <FaPlus size={18} />
            <span className="text-xs mt-1 font-medium">New</span>
          </motion.div>
        )}

        {/* عرض جميع الهايلايتس */}
        {highlights.map((highlight) => (
          <motion.div
            key={highlight._id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedHighlight(highlight)}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer"
          >
            <div
              className="
                w-20 h-20 rounded-full border-2 border-lightMode-text dark:border-darkMode-text 
                p-[3px] bg-gradient-to-tr from-pink-500 to-yellow-400
              "
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-lightMode-bg dark:bg-darkMode-bg">
                <Image
                  src={highlight.cover || '/placeholder.jpg'}
                  alt={highlight.title}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <p className="text-sm mt-1 text-lightMode-text2 dark:text-darkMode-text2 text-center truncate w-20">
              {highlight.title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
