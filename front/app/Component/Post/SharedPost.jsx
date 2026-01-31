'use client'
import React, { memo, useState, useEffect } from 'react'
import { HiBadgeCheck } from 'react-icons/hi'
import UserHoverCard from '../UserHoverCard'
import RenderPostText from './RenderText'
import PostMedia from './PostMedia'
import PostLinks from './PostLinks'
import Link from 'next/link'
import Image from 'next/image'
import { formatRelativeTime } from '@/app/utils/FormatDataCreatedAt'
import { useTranslate } from '../../Context/TranslateContext'
import { motion, AnimatePresence } from 'framer-motion'

const SharedPost = memo(({
    original,
    user,
    setImageView
}) => {
    const { translate, loading, language } = useTranslate();
    const [translated, setTranslated] = useState(null);
    const [showTranslateButton, setShowTranslateButton] = useState(false);
    const [showOriginal, setShowOriginal] = useState(false);

    useEffect(() => {
        import('franc').then(({ franc }) => {
            import('@/app/utils/Data').then(({ iso6391Map }) => {
                if (!original?.text || !language) return;
                if (original.text.length < 3) return setShowTranslateButton(false);
                const langCode3 = franc(original.text, { minLength: 3 });
                if (langCode3 === 'und') return setShowTranslateButton(false);
                const textLang = iso6391Map[langCode3] || 'en';
                setShowTranslateButton(textLang !== language);
            });
        });
    }, [original?.text, language]);

    const handleTranslate = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!original?.text || !language) return;
        const result = await translate(original.text, language);
        setTranslated(result);
        setShowOriginal(true);
        setShowTranslateButton(false);
    };

    const handleShowOriginal = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setShowOriginal(false);
        setTranslated(null);
        setShowTranslateButton(true);
    };
    return (
        <Link href={`/Pages/Post/${original?._id}`}
            className="bg-white/40 dark:bg-white/5 backdrop-blur-md 
            border border-gray-200/40 dark:border-gray-700/40 
            rounded-xl p-4 flex flex-col gap-3 
            shadow-md hover:shadow-lg transition-all duration-300 
            border-l-4 border-blue-400"
        >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4">
                <Link
                    href={user?._id === original?.owner?._id ? '/Pages/Profile' : `/Pages/User/${original?.owner?._id}`}
                    className="flex items-center gap-3 hover:underline"
                >
                    <Image
                        src={original?.owner?.profilePhoto?.url}
                        alt="Shared_profile_post"
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
                    />
                    <UserHoverCard userSelected={original?.owner}>
                        <div className="flex flex-col">
                            <div className='flex items-center gap-1'>
                                <span className="font-semibold text-gray-900 dark:text-white">{original?.owner?.username}</span>
                                {original?.owner?.isAccountWithPremiumVerify && (
                                    <HiBadgeCheck className="text-blue-500 text-lg sm:text-xl" title="Verified" />
                                )}
                            </div>
                            <span className="text-gray-500 text-xs">{original?.owner?.profileName}</span>
                        </div>
                    </UserHoverCard>
                </Link>
                <span className="text-gray-400 text-xs whitespace-nowrap">
                    {formatRelativeTime(original?.createdAt)}
                </span>
            </div>

            <RenderPostText
                text={original?.text}
                mentions={original?.mentions}
                hashtags={original?.Hashtags}
                italic={true}
            />

            {/* Translation Widget */}
            <AnimatePresence>
                {showTranslateButton && !showOriginal && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleTranslate}
                        className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 w-fit flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 transition-all"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        {loading ? "Processing..." : "Translate Source"}
                    </motion.button>
                )}
                {translated && showOriginal && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        className="p-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-2"
                    >
                        <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-white/30">
                            <span>Relayed Translation</span>
                            <button onClick={handleShowOriginal} className="hover:text-indigo-600 dark:hover:text-white transition-colors border-b border-transparent hover:border-current pb-0.5">Show Original</button>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-white/80 leading-relaxed italic">
                            <RenderPostText text={translated} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {(original?.media?.length > 0 || original?.Photos?.length > 0) && (
                <PostMedia media={original?.media} photos={original?.Photos} setImageView={setImageView} />
            )}
            <PostLinks links={original?.links} />
        </Link>
    )
})
SharedPost.displayName = 'SharedPost'
export default SharedPost