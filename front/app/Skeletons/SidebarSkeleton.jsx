'use client';
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-full border-r border-gray-200 dark:border-gray-700 bg-lightMode-bg dark:bg-darkMode-bg flex flex-col">
      <div className="overflow-y-auto w-full py-3 space-y-2 px-3">
        {skeletonContacts.map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="flex items-center gap-3 p-2 rounded-xl"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
            {/* Info */}
            <div className="hidden lg:flex flex-col flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
