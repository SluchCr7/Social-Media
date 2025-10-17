// ملف: Explore/ExploreSearchBar.jsx

import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ExploreSearchBar = ({ search, setSearch, placeholder = "Search..." }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-2xl mx-auto mb-6"
        >
            <input
                type="search"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 pl-12 pr-12 rounded-2xl 
                   bg-lightMode-menu dark:bg-darkMode-menu
                   text-lightMode-text dark:text-darkMode-text 
                   placeholder-lightMode-text2 dark:placeholder-darkMode-text2
                   focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-600 
                   focus:outline-none shadow-md transition"
            />
            <FiSearch
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    search ? 'text-indigo-500' : 'text-lightMode-text2 dark:text-darkMode-text2'
                }`}
                size={20}
            />
            {search && (
                <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 
                      bg-lightMode-menu dark:bg-darkMode-menu 
                      p-1.5 rounded-full hover:opacity-80 transition"
                >
                    <FiX size={16} className="text-lightMode-text2 dark:text-darkMode-text2" />
                </button>
            )}
        </motion.div>
    );
}

export default ExploreSearchBar;