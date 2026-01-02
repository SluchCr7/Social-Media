import Chat from '@/app/Component/ChatMessngerComponents/Chat'
import ChatSlider from '@/app/Component/ChatMessngerComponents/ChatSlider'
import NoChat from '@/app/Component/ChatMessngerComponents/NoChat'
import React from 'react'
import { FaBars } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MessangerPresentation = ({
  showSidebar, setShowSidebar, selectedUser
}) => {
  return (
    <div className="w-full h-screen overflow-hidden bg-[#050505]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050505] to-[#050505] opacity-50 z-0 pointer-events-none" />

      <div className="relative z-10 flex h-full w-full">
        {/* Sidebar Panel */}
        <motion.aside
          initial={false}
          animate={{
            x: showSidebar ? 0 : '-100%',
            opacity: showSidebar ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`
            fixed inset-y-0 left-0 z-30 
            w-[85%] sm:w-[320px]
            bg-black/40 backdrop-blur-xl border-r border-white/5
            md:static md:translate-x-0 md:opacity-100 md:w-[320px] md:flex
          `}
        >
          <ChatSlider />
        </motion.aside>

        {/* Mobile Overlay */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Chat Area Panel */}
        <main className="flex-1 w-full h-full relative flex flex-col bg-[#050505]/50 backdrop-blur-3xl">
          {/* Mobile Toggle Button */}
          <div className="absolute top-4 left-4 z-20 md:hidden">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white shadow-lg backdrop-blur-md active:scale-95 transition-all"
            >
              <FaBars size={18} />
            </button>
          </div>


          {selectedUser ? (
            <Chat onBack={() => setShowSidebar(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <NoChat />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default MessangerPresentation