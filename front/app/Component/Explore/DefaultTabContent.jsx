// ملف: Explore/DefaultTabContent.jsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const DefaultTabContent = ({ news = [], t }) => {
    if (news.length === 0) {
        return (
            <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-8">
                {t("No recent news available in this category.")}
            </p>
        );
    }

    return (
        <>
            {news.map((item, index) => (
                <Link
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 p-4 hover:opacity-80 transition rounded-xl 
                      bg-lightMode-menu dark:bg-darkMode-menu"
                >
                    <div className="flex-1">
                        <h3 className="text-sm break-all whitespace-pre-wrap font-semibold 
                          text-lightMode-text dark:text-darkMode-text leading-snug">
                            {item.title}
                        </h3>
                        <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2 mt-1">
                            {new Date(item.publishedAt).toLocaleDateString()}
                        </p>
                    </div>
                    {item.image && (
                        <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-lightMode-bg dark:bg-darkMode-bg">
                            <Image
                                src={item.image}
                                alt="news"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        </div>
                    )}
                </Link>
            ))}
        </>
    );
}

export default DefaultTabContent;