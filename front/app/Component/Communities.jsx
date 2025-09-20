// 'use client'
// import React from 'react'
// import { useCommunity } from '../Context/CommunityContext'
// import Link from 'next/link'
// import Image from 'next/image'
// import { useAuth } from '../Context/AuthContext'
// import { FaPlus, FaCheck, FaUsers } from 'react-icons/fa'

// const Communities = () => {
//   const { communities, joinToCommunity, sendJoinRequest } = useCommunity()
//   const { user } = useAuth()

//   const handleJoin = (community) => {
//     if (community?.isPrivate) {
//       sendJoinRequest(community._id)
//     } else {
//       joinToCommunity(community._id)
//     }
//   }

//   return (
//     <div className="w-full max-h-[500px] overflow-hidden bg-white dark:bg-[#16181c] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      
//       {/* Header */}
//       <div className="flex justify-between items-center px-5 py-4 border-b border-gray-300 dark:border-gray-600 bg-gradient-to-r from-blue-600 to-purple-600">
//         <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">Communities</h2>
//       </div>

//       {/* Body */}
//       <div className="flex flex-col w-full px-4 py-3 space-y-3 overflow-y-auto">
//         {communities?.length === 0 ? (
//           <p className="text-center text-gray-500 dark:text-gray-400 py-6">No communities to join.</p>
//         ) : (
//           communities?.slice(0, 3).map((community) => {
//             const isJoined = community?.members?.some(
//               (member) => member._id === user._id
//             )

//             return (
//               <div
//                 key={community?._id}
//                 className="flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer group"
//               >
//                 <Link
//                   className="flex items-center gap-3"
//                   href={`/Pages/Community/${community?._id}`}
//                 >
//                   <div className="relative w-12 h-12">
//                     <Image
//                       src={community?.Picture?.url || '/placeholder.png'}
//                       alt="community"
//                       width={48}
//                       height={48}
//                       className="rounded-full object-cover w-full h-full ring-1 ring-gray-200 dark:ring-gray-700 transition-all group-hover:ring-green-400"
//                     />
//                   </div>
//                   <div className="flex flex-col">
//                     <h2 className="text-gray-900 dark:text-gray-100 text-base font-semibold">{community?.Name}</h2>
//                     <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       <FaUsers className="text-[10px]" />
//                       {community?.members?.length || 0} members
//                     </span>
//                   </div>
//                 </Link>

//                 {community?.owner?._id === user?._id ? (
//                   <p className="text-xs font-medium px-3 py-1.5 rounded-md border border-blue-500 text-blue-500">
//                     Owner
//                   </p>
//                 ) : (
//                   <button
//                     className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md border transition-all duration-200 ${
//                       isJoined
//                         ? 'border-gray-400 text-gray-400 cursor-not-allowed opacity-60'
//                         : 'border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white transform hover:scale-105'
//                     }`}
//                     onClick={() => !isJoined && handleJoin(community)}
//                     disabled={isJoined}
//                   >
//                     {isJoined ? <FaCheck className="text-sm" /> : <FaPlus className="text-sm" />}
//                   </button>
//                 )}
//               </div>
//             )
//           })
//         )}
//       </div>

//       {/* See More Button if communities > 3 */}
//       {communities?.length > 3 && (
//         <div className="px-4 py-3 border-t border-gray-300 dark:border-gray-600">
//           <Link
//             href="/Pages/Communities"
//             className="w-full text-center text-sm font-medium text-blue-500 hover:underline"
//           >
//             See More Communities
//           </Link>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Communities


'use client'
import React from 'react'
import { useCommunity } from '../Context/CommunityContext'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../Context/AuthContext'
import { FaPlus, FaCheck, FaUsers, FaHourglassHalf, FaCrown, FaUserShield } from 'react-icons/fa'

const Communities = () => {
  const { communities, joinToCommunity, sendJoinRequest } = useCommunity()
  const { user } = useAuth()

  const handleJoin = (community) => {
    if (community?.isPrivate) {
      sendJoinRequest(community._id)
    } else {
      joinToCommunity(community._id)
    }
  }

  return (
    <div className="w-full max-h-[500px] overflow-hidden bg-white dark:bg-[#16181c] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-300 dark:border-gray-600 bg-gradient-to-r from-blue-600 to-purple-600">
        <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">Communities</h2>
      </div>

      {/* Body */}
      <div className="flex flex-col w-full px-4 py-3 space-y-3 overflow-y-auto">
        {communities?.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">No communities to join.</p>
        ) : (
          communities?.slice(0, 3).map((community) => {
            const isOwner = community?.owner?._id === user._id
            const isAdmin = community?.Admins?.some((admin) => admin._id === user._id)
            const isJoined = community?.members?.some((member) => member._id === user._id)
            const isPending = community?.joinRequests?.some((req) => req._id === user._id)

            return (
              <div
                key={community?._id}
                className="flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer group"
              >
                <Link
                  className="flex items-center gap-3"
                  href={`/Pages/Community/${community?._id}`}
                >
                  <div className="relative w-12 h-12">
                    <Image
                      src={community?.Picture?.url || '/placeholder.png'}
                      alt="community"
                      width={48}
                      height={48}
                      className="rounded-full object-cover w-full h-full ring-1 ring-gray-200 dark:ring-gray-700 transition-all group-hover:ring-green-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-gray-900 dark:text-gray-100 text-base font-semibold">{community?.Name}</h2>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <FaUsers className="text-[10px]" />
                      {community?.members?.length || 0} members
                    </span>
                  </div>
                </Link>

                {/* Role / Join Button */}
                {isOwner ? (
                  <p className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md border border-yellow-500 text-yellow-600">
                    <FaCrown className="text-yellow-500" /> Owner
                  </p>
                ) : isAdmin ? (
                  <p className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md border border-purple-500 text-purple-500">
                    <FaUserShield className="text-purple-500" /> Admin
                  </p>
                ) : isJoined ? (
                  <button
                    disabled
                    className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md border border-gray-400 text-gray-400 cursor-not-allowed opacity-60"
                  >
                    <FaCheck className="text-sm" /> Joined
                  </button>
                ) : isPending ? (
                  <button
                    disabled
                    className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md border border-yellow-500 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 cursor-not-allowed"
                  >
                    <FaHourglassHalf className="text-sm" /> Pending
                  </button>
                ) : (
                  <button
                    className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md border transition-all duration-200 ${
                      community?.isPrivate
                        ? 'border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white'
                        : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
                    }`}
                    onClick={() => handleJoin(community)}
                  >
                    <FaPlus className="text-sm" />
                    {community?.isPrivate ? 'Request Join' : 'Join'}
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* See More Button */}
      {communities?.length > 3 && (
        <div className="px-4 py-3 border-t border-gray-300 dark:border-gray-600">
          <Link
            href="/Pages/Communities"
            className="w-full text-center text-sm font-medium text-blue-500 hover:underline"
          >
            See More Communities
          </Link>
        </div>
      )}
    </div>
  )
}

export default Communities
