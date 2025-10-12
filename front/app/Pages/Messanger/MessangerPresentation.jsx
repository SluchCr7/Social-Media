import Chat from '@/app/Component/ChatMessngerComponents/Chat'
import ChatSlider from '@/app/Component/ChatMessngerComponents/ChatSlider'
import NoChat from '@/app/Component/ChatMessngerComponents/NoChat'
import React from 'react'
import { FaBars } from 'react-icons/fa'

const MessangerPresentation = ({
    showSidebar , setShowSidebar,  selectedUser
}) => {
  return (
    <div className="w-full h-screen overflow-hidden bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text">
      <div className="flex h-full w-full m-0 p-0">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 
            w-[80%] max-w-[300px] 
            bg-white dark:bg-darkMode-menu 
            border-r border-gray-300 dark:border-gray-700 
            transform transition-transform duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0 md:w-[280px]
          `}
        >
          <ChatSlider />
        </aside>

        {/* Overlay للموبايل */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Chat Area */}
        <main className="flex-1 w-full h-full relative">
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-10 p-2 rounded-md bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text shadow md:hidden"
          >
            <FaBars size={20} />
          </button>

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