'use client';
import React from 'react';
import Image from 'next/image';
import { motion, Reorder } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { useHighlights } from '../Context/HighlightContext';

export default function HighlightsBar({
  highlights = [],
  onAddHighlight,
  isOwner = false
}) {
  const { setSelectedHighlight, reorderHighlights, setHighlights } = useHighlights();

  const handleReorder = (newOrder) => {
    setHighlights(newOrder);
    if (isOwner) {
      reorderHighlights(newOrder.map(h => h._id));
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 py-4">
      <Reorder.Group
        axis="x"
        values={highlights}
        onReorder={handleReorder}
        className="flex w-full overflow-x-auto scrollbar-hide gap-6 px-4 py-2"
      >
        {/* زر إنشاء Highlight جديد */}
        {isOwner && (
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <motion.div
              whileTap={{ scale: 0.9 }}
              onClick={onAddHighlight}
              className="
                w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed 
                border-gray-300 dark:border-gray-700 flex flex-col items-center 
                justify-center text-gray-400 dark:text-gray-500 cursor-pointer 
                hover:bg-gray-100 dark:hover:bg-white/5 hover:border-indigo-500/50 hover:text-indigo-500 transition-all
              "
            >
              <FaPlus size={18} />
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600">New</span>
          </div>
        )}

        {/* عرض جميع الهايلايتس */}
        {highlights.map((highlight) => (
          <Reorder.Item
            key={highlight._id}
            value={highlight}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedHighlight(highlight)}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
          >
            <div
              className={`
                w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white dark:border-[#0A0A0A] 
                p-[2.5px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg 
                transition-transform group-hover:rotate-12
              `}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#0A0A0A] border-2 border-white dark:border-[#0A0A0A]">
                <Image
                  src={highlight.coverImage || '/placeholder.jpg'}
                  alt={highlight.title}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <p className="text-[10px] font-black mt-3 text-gray-900 dark:text-white/60 uppercase tracking-widest text-center truncate w-20 group-hover:text-white transition-colors">
              {highlight.title}
            </p>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
