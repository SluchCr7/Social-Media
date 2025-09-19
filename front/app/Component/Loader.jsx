'use client'

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const loadingTexts = [
  "Loading your feed...",
  "Fetching stories...",
  "Almost ready! 🚀",
  "Preparing content..."
];

const Loader = () => {
  const [textIndex, setTextIndex] = useState(0);

  // تغيير النص كل 2.5 ثانية
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % loadingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
      
      {/* خلفية gradient متحركة */}
      <motion.div 
        className="absolute inset-0"
        style={{ background: "linear-gradient(270deg, #4f46e5, #ec4899, #facc15, #14b8a6)" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Overlay أسود شبه شفاف */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* المكون المركزي */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        
        {/* لوجو الموقع مع pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full overflow-hidden"
        >
          <Image 
            src="/Logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </motion.div>

        {/* Progress bar سلس */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            animate={{ width: ["0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        </div>

        {/* نص ديناميكي */}
        <AnimatePresence mode="wait">
          <motion.span
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-white font-semibold text-lg"
          >
            {loadingTexts[textIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Loader;
