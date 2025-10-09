import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const PostLinks = ({links}) => {
  return (
    links?.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
        {links.map((link, i) => {
            // محاولة استخراج عنوان الموقع (domain)
            const url = new URL(link);
            const domain = url.hostname.replace('www.', '');
            const favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;

            return (
            <Link
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-3 rounded-xl
                bg-white/70 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-700/50
                shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
            >
                {/* 🌐 favicon */}
                <Image
                src={favicon}
                alt="link-favicon"
                width={28}
                height={28}
                className="rounded-md object-cover"
                />

                {/* 📄 نص الرابط */}
                <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                    {domain}
                </p>
                <p className="truncate text-xs text-gray-500">{link}</p>
                </div>

                {/* 🔗 أيقونة */}
                <span className="text-blue-500 text-sm font-semibold ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                Visit →
                </span>
            </Link>
            )
        })}
        </div>
        )  
    )
}

export default PostLinks