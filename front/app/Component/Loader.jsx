'use client'

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Loader = () => {
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
          className="w-40 h-40 rounded-full overflow-hidden shadow-lg"
          style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))" }}
        >
          <Image 
            src="/Logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </motion.div>

      </div>
    </div>
  );
};

export default Loader;
