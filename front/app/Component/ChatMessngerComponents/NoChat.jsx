'use client';
import React from 'react'
import { motion } from 'framer-motion';

const NoChat = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center pointer-events-none select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="mb-8 relative"
      >
        {/* Abstract Graphic */}
        <div className="w-40 h-40 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-[50px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 w-24 h-24 border border-white/10 rounded-[2rem] flex items-center justify-center bg-white/[0.01]">
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
        </div>
      </motion.div>

      <h2 className="text-2xl font-black text-white/60 mb-2 tracking-tight">Decentralized Hub</h2>
      <p className="text-sm text-white/30 max-w-xs leading-relaxed">
        Select a neural node from the sidebar to establish a secure connection.
      </p>
    </div>
  )
}

export default NoChat
