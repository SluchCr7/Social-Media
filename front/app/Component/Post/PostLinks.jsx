import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const PostLinks = ({ links }) => {
  if (!links?.length) return null;

  return (
    <div
      className="
        flex flex-col gap-2 sm:gap-3 mt-2
        w-full max-w-full
      "
    >
      {links.map((link, i) => {
        let domain = '';
        let favicon = '';
        try {
          const url = new URL(link);
          domain = url.hostname.replace('www.', '');
          favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
        } catch (err) {
          return null; // لو الرابط مش صحيح، نتجاهله بأمان
        }

        return (
          <Link
            key={i}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group flex items-center sm:items-start gap-3 sm:gap-4
              p-3 sm:p-4 rounded-xl w-full
              bg-white/70 dark:bg-gray-900/40
              border border-gray-200/60 dark:border-gray-700/50
              shadow-sm hover:shadow-lg hover:scale-[1.01]
              transition-all duration-200
            "
          >
            {/* 🌐 favicon */}
            <div className="flex-shrink-0">
              <Image
                src={favicon}
                alt="link-favicon"
                width={28}
                height={28}
                className="rounded-md object-cover sm:w-8 sm:h-8 w-6 h-6"
              />
            </div>

            {/* 📄 نص الرابط */}
            <div className="flex-1 min-w-0">
              <p
                className="
                  truncate font-medium text-gray-800 dark:text-gray-200
                  text-sm sm:text-base
                  group-hover:text-blue-500 transition-colors
                "
              >
                {domain}
              </p>
              <p
                className="
                  truncate text-xs sm:text-sm text-gray-500
                "
              >
                {link}
              </p>
            </div>

            {/* 🔗 أيقونة */}
            <span
              className="
                hidden sm:inline-block
                text-blue-500 text-sm font-semibold ml-auto
                opacity-0 group-hover:opacity-100 transition-opacity
              "
            >
              Visit →
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default PostLinks;
