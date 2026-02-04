'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HiEye, HiLockClosed } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

/**
 * A professional image component that automatically handles sensitive content blurring.
 */
const SensitiveImage = ({
    src,
    alt,
    className,
    fill,
    width,
    height,
    isSensitive,
    containerClassName = "",
    ...props
}) => {
    const [revealed, setRevealed] = useState(false);
    const { t } = useTranslation();

    // If not sensitive, render a normal Next.js Image
    if (!isSensitive) {
        return (
            <Image
                src={src}
                alt={alt || "image"}
                className={className}
                fill={fill}
                width={width}
                height={height}
                {...props}
            />
        );
    }

    return (
        <div className={`relative overflow-hidden group/sensitive ${containerClassName} ${fill ? 'w-full h-full' : ''}`}>
            {/* 🖼️ The Blurred Image */}
            <Image
                src={src}
                alt={alt || "sensitive content"}
                fill={fill}
                width={width}
                height={height}
                className={`${className} transition-all duration-700 ${!revealed ? 'blur-[40px] scale-110 pointer-events-none' : 'blur-0 scale-100'}`}
                {...props}
            />

            {/* 🛡️ Sensitive Content Overlay */}
            <AnimatePresence>
                {!revealed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xl p-4 text-center cursor-pointer select-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            setRevealed(true);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20 shadow-2xl"
                        >
                            <HiLockClosed className="text-white text-2xl" />
                        </motion.div>

                        <div className="space-y-1 mb-5">
                            <h3 className="text-white text-sm font-bold tracking-tight">
                                {t('Sensitive Content')}
                            </h3>
                            <p className="text-white/70 text-[10px] sm:text-[11px] font-medium max-w-[200px] leading-relaxed">
                                {t("هذه الصورة قد تحتوي على محتوى حساس")}
                            </p>
                        </div>

                        <button
                            className="
                flex items-center gap-2 px-6 py-2.5 
                bg-white/95 hover:bg-white text-black 
                rounded-full text-[10px] font-bold 
                shadow-xl transition-all active:scale-95
              "
                        >
                            <HiEye className="text-sm" />
                            {t("اظهار المحتوى")}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SensitiveImage;
