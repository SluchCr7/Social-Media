import Link from 'next/link'
import React from 'react'

const SharedTitle = ({user, post, original}) => {
  return (
        <div className="text-sm text-gray-800 dark:text-gray-200 italic">
          <Link
            href={user?._id === post.owner?._id ? '/Pages/Profile' : `/Pages/User/${post.owner?._id}`}
            className="font-semibold hover:underline"
          >
            {post.owner.username}
          </Link>{' '}
          shared a post from{' '}
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