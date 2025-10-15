import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next'

const SharedTitle = ({user, post, original}) => {
  const {t} = useTranslation()
  return (
        <div className="text-sm text-gray-800 dark:text-gray-200 italic">
          <Link
            href={user?._id === post.owner?._id ? '/Pages/Profile' : `/Pages/User/${post.owner?._id}`}
            className="font-semibold hover:underline"
          >
            {post.owner.username}
          </Link>{' '}
          {t("shared a post from")}{' '}
          <Link
            href={user?._id === original?.owner?._id ? '/Pages/Profile' : `/Pages/User/${original?.owner?._id}`}
            className="font-semibold hover:underline"
          >
            {original?.owner?.username}
          </Link>
      </div>
  )
}

export default SharedTitle