'use client'
import SluchitEntry from '@/app/Component/SluchitEntry'
import { usePost } from '@/app/Context/PostContext'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaHashtag } from 'react-icons/fa'

const Page = ({ params }) => {
  const [postsRelated, setPostsRelated] = useState([])
  const { posts } = usePost()
  const text = params.text
  const {t} = useTranslation()
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return []
    return posts.filter((post) => 
      Array.isArray(post?.Hashtags) && post.Hashtags.includes(text)
    )
  }, [posts, text])

  // ✅ تحديث الحالة فقط عند التغيير الحقيقي (لتقليل rerenders)
  useEffect(() => {
    setPostsRelated(filteredPosts)
  }, [filteredPosts])

  return (
    <div className="w-full px-4 md:px-8 py-8 min-h-screen bg-lightMode-bg dark:bg-darkMode-bg transition-colors duration-300">
      
      {/* هيدر الهاشتاج */}
      <div className="max-w-4xl mx-auto rounded-2xl bg-lightMode-menu dark:bg-darkMode-menu shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl">
            <FaHashtag />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-lightMode-fg dark:text-darkMode-fg">
              #{text}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {postsRelated.length} {postsRelated.length === 1 ? t("post") : t("posts")} {t("found")}
            </p>
          </div>
        </div>

        {/* Badge عدد البوستات */}
        <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
          {postsRelated.length} {t("results")}
        </span>
      </div>

      {/* قائمة البوستات */}
      <div className="w-full">
        {postsRelated.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 w-full">
            {postsRelated.map((post) => (
              <div
                key={post._id}
                className="animate-fadeIn w-full"
              >
                <SluchitEntry post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-16 flex flex-col items-center space-y-4">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-3xl">
              <FaHashtag className="text-gray-500" />
            </div>
            <p className="text-gray-500 text-lg">
              {t("No posts found with")} <span className="font-semibold text-darkMode-fg">#{text}</span>
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-2 px-5 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
            >
              {t("Go Back")}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(Page)
