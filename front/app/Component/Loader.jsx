"use client";

import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="w-screen h-screen fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-lightMode-bg dark:bg-darkMode-bg overflow-hidden">

      {/* خلفية دوائر متحركة */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute w-[280px] h-[280px] rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-pink-500/30 to-yellow-500/30 blur-2xl"
      />

      {/* Spinner ثلاثي دوائر */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-14 h-14 border-4 border-t-transparent border-blue-500 dark:border-purple-400 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute w-10 h-10 border-4 border-b-transparent border-pink-500 dark:border-yellow-400 rounded-full"
        />
      </div>

      {/* Loading dots */}
      <div className="flex space-x-1 mt-6 text-gray-500 dark:text-gray-400 text-sm">
        <span>Loading</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.6 }}
        >
          .
        </motion.span>
      </div>
    </div>
  );
};

export default Loader;
