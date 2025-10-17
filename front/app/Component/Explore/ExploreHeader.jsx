// ملف: Explore/ExploreHeader.jsx

import React from 'react';
import { motion } from 'framer-motion';

const ExploreHeader = ({ t, icon: Icon }) => {
    return (
        <div className="text-center mb-8 flex items-center flex-col gap-2 justify-center w-full">
            <motion.h2
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="text-4xl font-extrabold flex items-center gap-2 justify-center w-full
                    text-lightMode-fg dark:text-darkMode-fg"
            >
                {Icon && <Icon />} {t("Explore")}
            </motion.h2>
            <p className="mt-2 text-lightMode-text2 dark:text-darkMode-text2">
                {t("Discover friends, creators, trending topics and news.")}
            </p>
        </div>
    );
}

export default ExploreHeader;