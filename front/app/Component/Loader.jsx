'use client'

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const loadingTexts = [
  "Loading your feed...",
  "Fetching stories...",
  "Almost ready 🚀",
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
      
      {/* خلفية gradient هادئة احترافية */}
      <motion.div 
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #0f172a, #1e293b, #111827)" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Overlay خفيف */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* المكون المركزي */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        
        {/* لوجو مع pulse + glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full overflow-hidden shadow-lg"
          style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))" }}
        >
          <Image 
            src="/Logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </motion.div>

        {/* Progress bar حديث بgradient */}
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600"
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
            className="text-gray-200 font-medium text-lg tracking-wide"
          >
            {loadingTexts[textIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Loader;
