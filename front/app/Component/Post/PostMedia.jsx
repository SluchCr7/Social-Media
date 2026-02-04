'use client';
import React, { memo } from 'react';
import Image from 'next/image';
import { HiPlay } from 'react-icons/hi2';
import SensitiveImage from './SensitiveImage';
import { useTranslation } from 'react-i18next';

const PostMedia = memo(({ media = [], photos = [], setImageView }) => {
    const { t } = useTranslation();
    // Consolidate media sources
    const items = React.useMemo(() => {
        if (media && media.length > 0) return media;
        if (photos && photos.length > 0) {
            return photos.map(p => ({
                url: p.url || p,
                type: 'image',
                publicId: p.publicId,
                isSensitive: p.isSensitive || false
            }));
        }
        return [];
    }, [media, photos]);

    if (!items || items.length === 0) return null;

    const count = items.length;
    const displayItems = items.slice(0, 5);
    const remaining = count - 5;

    const handlePreview = (item) => {
        if (setImageView) {
            setImageView({
                url: item.url,
                type: item.type || 'image',
                postId: item._id
            });
        }
    };

    /**
     * Get specific class names for grid items based on count and index
     */
    const getItemClassName = (index) => {
        let base = "relative overflow-hidden cursor-pointer group bg-black/5 dark:bg-white/5";

        if (count === 1) return `${base} aspect-auto max-h-[650px] rounded-2xl`;
        if (count === 2) return `${base} aspect-[3/4] sm:aspect-square`;

        if (count === 3) {
            if (index === 0) return `${base} col-span-2 row-span-2 aspect-[4/3] sm:aspect-video md:aspect-[16/10]`;
            return `${base} col-span-1 aspect-square`;
        }

        if (count === 4) {
            return `${base} aspect-square`;
        }

        if (count >= 5) {
            if (index === 0 || index === 1) return `${base} col-span-3 aspect-[4/3]`;
            return `${base} col-span-2 aspect-square`;
        }

        return base;
    };

    /**
     * Get grid container classes
     */
    const getGridClassName = () => {
        let base = "grid gap-1.5 sm:gap-2 w-full";
        if (count === 1) return "block"; // Single item doesn't need grid
        if (count === 2) return `${base} grid-cols-2`;
        if (count === 3) return `${base} grid-cols-2`;
        if (count === 4) return `${base} grid-cols-2 grid-rows-2`;
        if (count >= 5) return `${base} grid-cols-6`;
        return base;
    };

    return (
        <div className={getGridClassName()}>
            {displayItems.map((item, index) => {
                const isVideo = item.type === 'video';
                const isSensitive = item.isSensitive;

                return (
                    <div
                        key={index}
                        className={getItemClassName(index)}
                        onClick={() => !isSensitive && handlePreview(item)}
                    >
                        {isVideo ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <video
                                    src={item.url}
                                    poster={item.thumbnail}
                                    className={`w-full h-full object-cover transition-all duration-700 ${isSensitive ? 'blur-3xl scale-110' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}`}
                                    muted
                                    playsInline
                                    loop
                                    onMouseOver={(e) => e.target.play()}
                                    onMouseOut={(e) => e.target.pause()}
                                />
                                {!isSensitive && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-2xl flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                            <HiPlay size={32} className="ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                )}
                                {isSensitive && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10 shadow-inner">
                                            <HiPlay size={24} className="text-white/20" />
                                        </div>
                                        <p className="text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">{t("Sensitive Content") || "Sensitive Content"}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <SensitiveImage
                                src={item.url}
                                alt={`media-${index}`}
                                fill={count > 1}
                                width={count === 1 ? 1200 : undefined}
                                height={count === 1 ? 800 : undefined}
                                isSensitive={isSensitive}
                                className={`object-cover transition-all duration-1000 group-hover:scale-110 ${count === 1 ? 'w-full h-auto rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10' : ''}`}
                            />
                        )}

                        {/* Overlay for +N on the last visible item */}
                        {index === 4 && remaining > 0 && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center text-white z-20 pointer-events-none select-none transition-all group-hover:bg-black/60">
                                <span className="text-4xl font-black tracking-tighter mb-1">+{remaining}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">{t("Explore") || "Explore"}</span>
                            </div>
                        )}

                        {/* Hover Overlay Gradient */}
                        {!isSensitive && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        )}
                    </div>
                );
            })}
        </div>
    );
});

PostMedia.displayName = 'PostMedia';
export default PostMedia;
