'use client';
import React, { memo } from 'react';
import Image from 'next/image';
import { HiPlay } from 'react-icons/hi2';

const PostMedia = memo(({ media = [], photos = [], setImageView }) => {
    // Consolidate media sources
    // If 'media' (mixed) exists, use it. Else fallback to 'photos' (legacy images).
    // Ensure we map legacy photos to a unified structure { url, type: 'image' } if needed.

    const items = React.useMemo(() => {
        if (media && media.length > 0) return media;
        if (photos && photos.length > 0) {
            return photos.map(p => ({
                url: p.url || p,
                type: 'image',
                publicId: p.publicId
            }));
        }
        return [];
    }, [media, photos]);

    if (!items || items.length === 0) return null;

    // Grid Logic
    const count = items.length;
    let gridClass = 'grid-cols-1';
    if (count === 2) gridClass = 'grid-cols-2';
    else if (count === 3) gridClass = 'grid-cols-2 md:grid-cols-3'; // Or custom layout
    else if (count >= 4) gridClass = 'grid-cols-2';

    // Display max 4 items, 4th item has "+N" overlay if count > 4
    const displayItems = items.slice(0, 4);
    const remaining = count - 4;

    const handlePreview = (item) => {
        if (setImageView) {
            setImageView({
                url: item.url,
                type: item.type || 'image', // explicit type
                postId: item._id
            });
        }
    };

    return (
        <div className={`grid gap-1 rounded-2xl overflow-hidden ${gridClass} aspect-[4/5] sm:aspect-square md:aspect-[4/3] max-h-[500px]`}>
            {displayItems.map((item, index) => {
                const isVideo = item.type === 'video';
                // Logic for specialized 3-item layout (first item big)
                // If 3 items, make first item span 2 rows if in 2-col grid? 
                // Simple grid for now:
                // 1: full
                // 2: split
                // 3: 1 top, 2 bottom? Or just 3 cols.
                // Let's stick to standard 2x2 for 4.

                // For 3 items: let's do customized className index 0 -> row-span-2 ?
                let itemClass = "relative w-full h-full cursor-pointer group bg-black";
                if (count === 3 && index === 0) itemClass += " row-span-2 col-span-2 md:col-span-1";

                return (
                    <div key={index} className={itemClass} onClick={() => handlePreview(item)}>
                        {isVideo ? (
                            // Thumbnail for video if avaiable? Or just the video element muted
                            <div className="relative w-full h-full">
                                <video
                                    src={item.url}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    muted
                                    playsInline
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                                        <HiPlay size={24} fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Image
                                src={item.url}
                                alt="media"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        )}

                        {/* Overlay for +N */}
                        {index === 3 && remaining > 0 && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-xl font-bold text-white">
                                +{remaining}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});

PostMedia.displayName = 'PostMedia';
export default PostMedia;
