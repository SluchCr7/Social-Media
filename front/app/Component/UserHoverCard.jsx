// 'use client'

// import * as HoverCard from '@radix-ui/react-hover-card'
// import Image from 'next/image'
// import Link from 'next/link'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useAuth } from '../Context/AuthContext'
// import { useState } from 'react'
// import { FaUserPlus, FaUserCheck } from 'react-icons/fa'

// const UserHoverCard = ({ userSelected, children, side = 'right' }) => {
//   const { followUser, user } = useAuth()
//   const [isHovered, setIsHovered] = useState(false)

//   if (!userSelected) return null

//   const isFollowing = user?.following?.includes(userSelected._id)

//   return (
//     <HoverCard.Root openDelay={200} closeDelay={150}>
//       <HoverCard.Trigger asChild>
//         {children || (
//           <Link
//             href={`/Pages/User/${userSelected?._id}`}
//             className="font-semibold text-sm text-lightMode-fg dark:text-darkMode-fg hover:underline"
//           >
//             {userSelected?.username}
//           </Link>
//         )}
//       </HoverCard.Trigger>

//       <HoverCard.Portal>
//         <AnimatePresence>
//           <HoverCard.Content
//             side={side}
//             sideOffset={10}
//             className="z-50 rounded-2xl border border-gray-200 dark:border-gray-700
//                      bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800
//                      shadow-xl max-w-[90vw] sm:max-w-[280px] overflow-hidden"
//             onPointerEnter={() => setIsHovered(true)}
//             onPointerLeave={() => setIsHovered(false)}
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 10 }}
//               transition={{ duration: 0.2 }}
//               className="p-4"
//             >
//               {/* Header */}
//               <div className="flex items-center gap-3">
//                 <div className="relative">
//                   <Image
//                     src={userSelected?.profilePhoto?.url || '/default-avatar.png'}
//                     alt="Profile"
//                     width={50}
//                     height={50}
//                     className="rounded-full w-12 h-12 object-cover transition-transform duration-300 hover:scale-105"
//                   />
//                   <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="font-bold text-gray-900 dark:text-white truncate">{userSelected?.username}</span>
//                   <span className="text-sm text-gray-500">@{userSelected?.profileName}</span>
//                 </div>
//               </div>

//               {/* Bio */}
//               <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
//                 {userSelected?.description || "No bio available"}
//               </p>

//               {/* Stats */}
//               <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
//                 <span><b>{userSelected?.followers?.length || 0}</b> Followers</span>
//                 <span><b>{userSelected?.following?.length || 0}</b> Following</span>
//               </div>

//               {/* Action Button */}
//               {user?._id !== userSelected._id && (
//                 <div className="mt-4">
//                   <button
//                     onClick={() => followUser(userSelected._id)}
//                     className={`w-full py-1.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all
//                       ${isFollowing
//                         ? 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
//                         : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'}`}
//                   >
//                     {isFollowing ? <FaUserCheck size={14} /> : <FaUserPlus size={14} />}
//                     {isFollowing ? 'Following' : 'Follow'}
//                   </button>
//                 </div>
//               )}
//             </motion.div>

//             <HoverCard.Arrow className="fill-white dark:fill-gray-900" />
//           </HoverCard.Content>
//         </AnimatePresence>
//       </HoverCard.Portal>
//     </HoverCard.Root>
//   )
// }

// export default UserHoverCard

'use client'

import * as HoverCard from '@radix-ui/react-hover-card'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../Context/AuthContext'
import { useState, useEffect } from 'react'
import { FaUserPlus, FaUserCheck } from 'react-icons/fa'

const UserHoverCard = ({ userSelected, children, side = 'right' }) => {
  const { followUser, user } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 🧩 التحقق من حجم الشاشة لتجنب عرض الكارد في الموبايل
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!userSelected) return null
  const isFollowing = user?.following?.includes(userSelected._id)

  // 🚫 لا يظهر في الشاشات الصغيرة
  if (isMobile) {
    return (
      <Link
        href={`/Pages/User/${userSelected?._id}`}
        className="font-semibold text-sm text-lightMode-fg dark:text-darkMode-fg hover:underline"
      >
        {children || userSelected?.username}
      </Link>
    )
  }

  // ✅ يظهر فقط في الشاشات الكبيرة
  return (
    <HoverCard.Root openDelay={200} closeDelay={150}>
      <HoverCard.Trigger asChild>
        {children || (
          <Link
            href={`/Pages/User/${userSelected?._id}`}
            className="font-semibold text-sm text-lightMode-fg dark:text-darkMode-fg hover:underline"
          >
            {userSelected?.username}
          </Link>
        )}
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <AnimatePresence>
          <HoverCard.Content
            side={side}
            sideOffset={10}
            align="center"
            avoidCollisions={true}
            collisionPadding={8}
            className={`
              z-50 rounded-2xl border border-gray-200 dark:border-gray-700 
              bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 
              shadow-xl overflow-hidden transition-transform duration-300 
              max-w-[90vw] sm:max-w-[280px]
            `}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={userSelected?.profilePhoto?.url || '/default-avatar.png'}
                    alt="Profile"
                    width={50}
                    height={50}
                    className="rounded-full w-12 h-12 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                </div>

                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 dark:text-white truncate">
                    {userSelected?.username}
                  </span>
                  <span className="text-sm text-gray-500">@{userSelected?.profileName}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                {userSelected?.description || "No bio available"}
              </p>

              {/* Stats */}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>
                  <b>{userSelected?.followers?.length || 0}</b> Followers
                </span>
                <span>
                  <b>{userSelected?.following?.length || 0}</b> Following
                </span>
              </div>

              {/* Action Button */}
              {user?._id !== userSelected._id && (
                <div className="mt-4">
                  <button
                    onClick={() => followUser(userSelected._id)}
                    className={`w-full py-1.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all 
                      ${isFollowing
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
                        : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'}`}
                  >
                    {isFollowing ? <FaUserCheck size={14} /> : <FaUserPlus size={14} />}
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              )}
            </motion.div>

            <HoverCard.Arrow className="fill-white dark:fill-gray-900" />
          </HoverCard.Content>
        </AnimatePresence>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}

export default UserHoverCard
