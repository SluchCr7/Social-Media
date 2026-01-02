'use client';

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden">

      {/* Background Gradient Subtle */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050505] to-[#050505]" />

      <div className="relative flex flex-col items-center justify-center p-12">
        {/* Main Logo Container */}
        <div className="relative mb-8">
          {/* Animated Glow Behind Logo */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full"
          />

          {/* Logo with Breathing Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-32 h-32 md:w-40 md:h-40 z-10"
          >
            <Image
              src="/Logo.png"
              alt="Loading..."
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Spinning Ring (Minimalist) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] rounded-full border border-indigo-500/10 border-t-indigo-500/50 z-0"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-10px] rounded-full border border-white/5 border-b-white/20 z-0"
          />
        </div>

        {/* Text & Progress */}
        <div className="flex flex-col items-center space-y-4 z-10 w-full max-w-[200px]">

          {/* Elegant Text */}
          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-xs md:text-sm font-medium tracking-[0.3em] text-white/80 uppercase"
          >
            Loading
          </motion.h2>

          {/* Minimalist Progress Line */}
          <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0.5
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent w-full"
            />
          </div>
        </div>
      </div>

      {/* Footer / Version / Quote (Optional for premium feel) */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-[10px] text-white/20 font-light tracking-widest"
        >
          EXPERIENCE THE FUTURE
        </motion.span>
      </div>
    </div>
  );
};

export default Loader;
