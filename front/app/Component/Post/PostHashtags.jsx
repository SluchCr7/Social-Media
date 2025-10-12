import Link from 'next/link'
import React from 'react'

const PostHashtags = ({
    post
}) => {
  return (
        <div className="flex flex-wrap gap-2">
            {post?.Hashtags.map((tag, i) => (
                <Link
                href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                key={i}
                className="bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full"
                >
                #{tag}
                </Link>
            ))}
        </div>
  )
}

export default PostHashtags