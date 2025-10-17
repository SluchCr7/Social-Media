// ملف: Explore/PhotosTabContent.jsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const PhotosTabContent = ({ followingPhotos, t }) => {
    // التأكد من أن followingPhotos تحتوي على بيانات (url, postUrl)
    const filteredPhotos = followingPhotos.filter(p => p.url);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredPhotos.length > 0 ? (
                filteredPhotos.map((photo, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="overflow-hidden rounded-xl relative group aspect-square"
                    >
                        <Link href={photo.postUrl || '#'}>
                            <Image
                                src={photo.url || '/placeholder.png'}
                                alt="Photo from following"
                                // يجب أن تستخدم 'fill' أو تحديد نسبة عرض إلى ارتفاع محددة
                                width={300} // تم تحديد الأبعاد هنا لتجنب مشاكل Next.js
                                height={300} 
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>
                    </motion.div>
                ))
            ) : (
                <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-8 col-span-full">
                    {t("No photos from people you follow yet.")}
                </p>
            )}
        </div>
    );
}

export default PhotosTabContent;