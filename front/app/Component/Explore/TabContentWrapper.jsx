'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';

const TabContentWrapper = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.99, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex flex-col gap-6"
        >
            {children}
        </motion.div>
    );
}

TabContentWrapper.displayName = 'TabContentWrapper';
export default memo(TabContentWrapper);
