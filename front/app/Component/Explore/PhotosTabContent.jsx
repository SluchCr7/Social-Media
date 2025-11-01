'use client';
import React, { memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePost } from '@/app/Context/PostContext';

const PhotosTabContent = ({ followingPhotos = [], t }) => {
  const { setImageView } = usePost();

  // ✅ استخدم useMemo لتصفية الصور مرة واحدة فقط عند تغير البيانات
  const filteredPhotos = useMemo(
    () => followingPhotos.filter((p) => !!p.url),
    [followingPhotos]
  );

  // ✅ استخدم useCallback لتجنب إنشاء دالة جديدة في كل render
  const handleViewImage = useCallback(
    (photo) => setImageView({ url: photo.url, postUrl: photo.postUrl }),
    [setImageView]
  );

  // ✅ Return مبكر في حال عدم وجود صور (أفضل للأداء من شرط داخل JSX)
  if (!filteredPhotos.length) {
    return (
      <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-8">
        {t('No photos from people you follow yet.')}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <AnimatePresence>
        {filteredPhotos.map((photo, idx) => (
          <motion.div
            key={photo.url} // ✅ استخدم URL كمفتاح بدل index
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: idx * 0.02, type: 'spring', stiffness: 150 }}
            className="overflow-hidden rounded-xl relative group aspect-square cursor-pointer"
            onClick={() => handleViewImage(photo)}
          >
            <Image
              src={photo.url}
              alt={t('Photo from following')}
              width={300}
              height={300}
              loading="lazy" // ✅ Lazy load لتسريع تحميل الصفحة
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
PhotosTabContent.displayName = 'PhotosTabContent'

export default memo(PhotosTabContent);
