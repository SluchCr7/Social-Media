'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text px-4">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="mb-6"
      >
        <FaSearch className="text-6xl text-blue-500" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold mb-2"
      >
        this page could not be found
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md"
      >
        you might have misspelled the address or the page might have been removed
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 transition shadow-lg"
        >
          return home
        </Link>
      </motion.div>
    </div>
  );
}