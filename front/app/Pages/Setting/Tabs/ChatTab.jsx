import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { CiChat1 } from 'react-icons/ci'
const ChatTab = ({
    handleBackgroundChange,
    colors,
    customColor,
    backgroundValue
}) => {
  return (
                <motion.section
                  key="chat"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg"><CiChat1 /></div>
                    <div>
                      <h2 className="text-lg font-semibold">Chat Colors</h2>
                      <p className="text-sm text-gray-500">Choose bubble colors and accents used in chat previews.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {colors.map((c) => (
                      <div key={c.value} className="text-center">
                        <button onClick={() => handleBackgroundChange('color', c.value)} className="flex flex-col items-center gap-2">
                          <div className={clsx('h-12 w-12 rounded-lg border-2')} style={{ backgroundColor: c.value }} />
                          <div className="text-xs text-gray-500">{c.name}</div>
                        </button>
                      </div>
                    ))}
                    <div className="col-span-full md:col-auto p-3 rounded-lg border bg-white/50 dark:bg-gray-800/50">
                      <div className="text-sm font-medium mb-2">Custom color</div>
                      <div className="flex items-center gap-2">
                        <input type="color" value={customColor || '#000000'} onChange={(e) => handleBackgroundChange('custom', e.target.value)} className="w-12 h-10" />
                        <div className="flex-1 text-sm text-gray-500">Pick any color to be used as your chat accent.</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg border bg-white/30 dark:bg-gray-800/30">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md" style={{ background: backgroundValue }} />
                      <div className="flex-1">
                        <div className="font-medium">This is how your chat accent looks</div>
                        <div className="text-xs text-gray-500">Applied across message bubbles and highlights.</div>
                      </div>
                    </div>
                  </div>
                </motion.section>
  )
}

export default ChatTab