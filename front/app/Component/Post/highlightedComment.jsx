'use client'
import React from 'react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
const HighlightedComment = ({
    highlightedComment
}) => {
    const { t } = useTranslation()
    return (
        <div
            className="
                mt-4 px-3 sm:px-4 py-3 
                rounded-2xl 
                border border-gray-200/70 dark:border-gray-700/60 
                bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl 
                shadow-md hover:shadow-lg 
                transition-all duration-300 ease-in-out
            "
        >
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <Image
                src={highlightedComment?.owner?.profilePhoto?.url || '/default-avatar.png'}
                alt="comment-user"
                width={40}
                height={40}
                className="
                    rounded-full w-9 h-9 sm:w-10 sm:h-10 
                    object-cover border border-gray-300 dark:border-gray-600
                    shadow-sm
                "
            />
            <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm sm:text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[70%]">
                    {highlightedComment?.owner?.username}
                </span>
                {highlightedComment?.label && (
                    <span className="
                        text-[8px] sm:text-[10px] font-medium 
                        px-2 py-0.5 rounded-full 
                        bg-blue-100 dark:bg-blue-900/40 
                        text-blue-700 dark:text-blue-300
                        whitespace-nowrap
                    ">
                        {t(highlightedComment?.label)}
                    </span>
                )}
            </div>
                <p className="
                    mt-1 text-[13px] sm:text-sm 
                    text-gray-700 dark:text-gray-300 
                    leading-relaxed break-words 
                    whitespace-pre-wrap
                ">
                    {highlightedComment?.text}
                </p>
            </div>
        </div>
        </div>
    )
}

export default HighlightedComment