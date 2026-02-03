'use client';

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505]" />

      <div className="relative flex flex-col items-center justify-center p-12 space-y-8">
        {/* Logo Container with Breathing Effect */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
            filter: ["drop-shadow(0 0 0px rgba(99,102,241,0))", "drop-shadow(0 0 20px rgba(99,102,241,0.3))", "drop-shadow(0 0 0px rgba(99,102,241,0))"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-24 h-24 md:w-32 md:h-32"
        >
          <Image
            src="/Logo.png"
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Minimalist Loading Bar */}
        {/* <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full bg-indigo-500/80 rounded-full"
          />
        </div> */}
      </div>
    </div>
  );
};

export default Loader;
