'use client';

import React, { memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePost } from '@/app/Context/PostContext';
import { HiPhoto } from 'react-icons/hi2';

const PhotoCard = memo(({ photo, index, onImageClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
    whileHover={{ scale: 0.98 }}
    whileTap={{ scale: 0.95 }}
    className="group relative aspect-square rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-white/[0.03] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
    onClick={() => onImageClick(photo)}
  >
    <Image
      src={photo.url}
      alt="Discovery Insight"
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      className="object-cover transition-transform duration-1000 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.div>
));

PhotoCard.displayName = 'PhotoCard';

const PhotosTabContent = ({ followingPhotos = [], t }) => {
  const { setImageView } = usePost();

  const filteredPhotos = useMemo(
    () => followingPhotos.filter((p) => !!p.url),
    [followingPhotos]
  );

  const handleViewImage = useCallback(
    (photo) => {
      if (setImageView) {
        setImageView({ url: photo.url, postUrl: photo.postUrl });
      }
    },
    [setImageView]
  );

  if (!filteredPhotos.length) {
    return (
      <div className="py-20 text-center space-y-4 opacity-30">
        <HiPhoto size={48} className="mx-auto" />
        <p className="text-[11px] font-black uppercase tracking-[0.2em]">{t('No visual assets detected in your orbital path.')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {filteredPhotos.map((photo, idx) => (
        <PhotoCard
          key={photo.url || idx}
          photo={photo}
          index={idx}
          onImageClick={handleViewImage}
        />
      ))}
    </div>
  );
};

PhotosTabContent.displayName = 'PhotosTabContent';
export default memo(PhotosTabContent);

