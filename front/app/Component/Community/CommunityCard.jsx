import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaLock, FaUsers, FaGlobe } from 'react-icons/fa'
import Badge from './Badge'

const CommunityCard = ({ comm }) => (
  <motion.article
    whileHover={{ y: -6 }}
    className="bg-lightMode-menu dark:bg-darkMode-menu rounded-2xl shadow-md overflow-hidden border border-transparent hover:shadow-lg transition relative"
  >
    <Link href={`/Pages/Community/${comm._id}`} className="block relative w-full h-36">
      {comm.Cover?.url || comm.cover?.url ? (
        <Image
          src={comm.Cover?.url || comm.cover?.url}
          alt={comm.Name}
          fill
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-sky-300 to-indigo-400 flex items-center justify-center text-white text-2xl font-bold">
          {comm.Name?.charAt(0) || 'C'}
        </div>
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-black/10 opacity-0 hover:opacity-10 transition" />
    </Link>

    <div className="pt-10 pb-6 px-5 text-center">
      <div className="-mt-14 mx-auto w-20 h-20 relative rounded-full overflow-hidden shadow-md bg-gray-200 flex items-center justify-center">
        {comm.Picture?.url || comm.picture?.url ? (
          <Image
            src={comm.Picture?.url || comm.picture?.url}
            alt={comm.Name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <FaUsers className="text-3xl text-gray-400" />
        )}
      </div>

      <h3 className="mt-3 text-lg font-semibold text-lightMode-fg dark:text-darkMode-fg">{comm.Name}</h3>
      <p className="mt-1 text-sm text-lightMode-text2 dark:text-darkMode-text2 line-clamp-1">{comm.description}</p>

      <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
        <Badge className="bg-lightMode-bg dark:bg-darkMode-bg text-lightMode-text dark:text-darkMode-text">{comm.Category}</Badge>
        <Badge className={`${comm.isPrivate ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-green-100 text-green-700 dark:bg-green-900/30'}`}>
          {comm.isPrivate ? <><FaLock className="inline mr-1" />Private</> : <><FaGlobe className="inline mr-1" />Public</>}
        </Badge>
        <span className="flex items-center gap-1 text-sm text-lightMode-text2 dark:text-darkMode-text2"><FaUsers /> {comm.members?.length || 0}</span>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
        <Link href={`/Pages/Community/${comm._id}`} className="px-4 py-2 rounded-lg border border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition">
          View
        </Link>
      </div>
    </div>
  </motion.article>
)

export default CommunityCard