'use client';

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight, FaLock, FaUsers, FaGlobe } from 'react-icons/fa'
import Badge from './Badge'
import { useTranslation } from 'react-i18next'

const CommunityCard = React.memo(({ comm, viewMode = 'grid' }) => {
  const { t } = useTranslation()
  const membersCount = comm.membersCount ?? comm.members?.length ?? 0

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={`group h-full overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-950/5 dark:border-white/10 dark:bg-[#101117] dark:hover:border-indigo-400/40 ${
        viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
      }`}
    >
      <Link
        href={`/Pages/Community/${comm._id}`}
        aria-label={`${t('View')} ${comm.Name}`}
        className={`relative block overflow-hidden bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ${
          viewMode === 'list' ? 'h-36 sm:h-auto sm:w-56 sm:shrink-0' : 'h-40'
        }`}
      >
        {comm.Cover?.url || comm.cover?.url ? (
          <Image
            src={comm.Cover?.url || comm.cover?.url}
            alt=""
            fill
            sizes={viewMode === 'list' ? '(max-width: 640px) 100vw, 224px' : '(max-width: 640px) 100vw, 33vw'}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-black text-indigo-600/60 dark:text-indigo-300/70">
            {comm.Name?.charAt(0) || 'C'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        <span className="absolute left-4 top-4">
          <Badge className="border border-white/20 bg-black/40 text-white backdrop-blur-md">
            {comm.isPrivate ? <><FaLock className="mr-1 inline" />{t('Private')}</> : <><FaGlobe className="mr-1 inline" />{t('Public')}</>}
          </Badge>
        </span>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="relative -mt-10 h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-gray-100 shadow-md dark:border-[#101117] dark:bg-white/10">
            {comm.Picture?.url || comm.picture?.url ? (
              <Image
                src={comm.Picture?.url || comm.picture?.url}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xl font-bold text-indigo-500">
                {comm.Name?.charAt(0) || 'C'}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 pt-1 text-start">
            <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              {t(comm.Category || 'General')}
            </Badge>
          </div>
        </div>

        <Link href={`/Pages/Community/${comm._id}`} className="mt-3 block">
          <h2 className="truncate text-lg font-bold tracking-tight text-gray-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
            {comm.Name}
          </h2>
        </Link>
        <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500 dark:text-gray-400">
          {comm.description || t('A place to connect and share.')}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
          <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FaUsers className="text-indigo-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-200">{membersCount.toLocaleString()}</span>
            {t('members')}
          </span>
          <Link
            href={`/Pages/Community/${comm._id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-600 dark:bg-white/10 dark:hover:bg-indigo-500"
          >
            {t('Explore')}
            <FaArrowRight className="text-[10px] rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
})

CommunityCard.displayName = 'CommunityCard'

export default CommunityCard
