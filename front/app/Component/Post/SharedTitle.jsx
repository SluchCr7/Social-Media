'use client';
import Link from 'next/link'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

const SharedTitle = memo(({ user, post, original }) => {
  const { t } = useTranslation();
  
  const getProfileLink = (ownerId) => 
    user?._id === ownerId ? '/Pages/Profile' : `/Pages/User/${ownerId}`;

  return (
    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-gray-400 dark:text-white/20 mb-2 px-1">
      <Link
        href={getProfileLink(post?.owner?._id)}
        className="font-bold text-gray-900 dark:text-white/60 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
      >
        {post?.owner?.username}
      </Link>
      <span>{t("shared a post from")}</span>
      <Link
        href={getProfileLink(original?.owner?._id)}
        className="font-bold text-gray-900 dark:text-white/60 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
      >
        {original?.owner?.username}
      </Link>
    </div>
  );
});
SharedTitle.displayName = 'SharedTitle'
export default SharedTitle