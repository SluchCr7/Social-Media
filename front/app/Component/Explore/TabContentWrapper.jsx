// ملف: Explore/TabContentWrapper.jsx

import React from 'react';
import { motion } from 'framer-motion';

const TabContentWrapper = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
            className="flex flex-col gap-3"
        >
            {children}
        </motion.div>
    );
}

export default TabContentWrapper;