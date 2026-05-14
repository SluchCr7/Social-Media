'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/app/utils/cn';

const Avatar = ({ 
  src, 
  alt = 'User Avatar', 
  size = 'default', 
  className,
  fallback = '/default-avatar.png'
}) => {
  
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  const [imgSrc, setImgSrc] = React.useState(src || fallback);

  React.useEffect(() => {
    if (src) setImgSrc(src);
  }, [src]);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-threads-border shadow-sm',
        sizeClasses[size],
        className
      )}
    >
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-opacity duration-300"
        onError={() => setImgSrc(fallback)}
        loading="lazy"
      />
    </motion.div>
  );
};

export { Avatar };
