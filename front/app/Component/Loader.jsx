'use client';

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* 🔮 Neural Background Pulse */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[100px] rounded-full"
        />
      </div>

      <div className="relative flex flex-col items-center justify-center space-y-12">
        {/* 💎 The Core Prism */}
        <div className="relative group">
          <motion.div
            animate={{
              rotate: 360,
              borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "30% 70% 50% 50% / 50% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.2)]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-24 h-24">
              <Image
                src="/Logo.png"
                alt="Logo"
                fill
                className="object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                priority
              />
            </div>
          </motion.div>

          {/* Orbiting Particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                rotate: 360,
              }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-20px] pointer-events-none"
            >
              <div className={`w-2 h-2 rounded-full bg-indigo-500/50 blur-[2px] absolute top-0 left-1/2 -translate-x-1/2`} />
            </motion.div>
          ))}
        </div>

        {/* 📡 Signal Status */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 flex items-center gap-2">
              Initializing <span className="text-white mt-1">•••</span> Global Grid
            </span>
          </div>

          <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-full"
            />
          </div>
        </div>
      </div>

      {/* 🎭 Metadata Overlay */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2">
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
          Zocial Pulse Engine • Operational
        </span>
      </div>
    </div>
  );
};

export default Loader;
