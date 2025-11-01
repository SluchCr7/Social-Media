'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useAlert } from '../Context/AlertContext';

const AdultContentWarning = () => {
  const [showContent, setShowContent] = useState(false);
  const handleConfirm = () => {
    setShowContent(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!showContent ? (
        <motion.div
          key="warning"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center w-full p-6 md:p-10 bg-gradient-to-br from-red-900 via-gray-900 to-black text-white rounded-2xl shadow-2xl border border-red-700/40"
        >
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center space-y-4 text-center"
          >
            <ShieldAlert size={60} className="text-red-500 drop-shadow-lg" />
            <h2 className="text-2xl font-bold text-red-400">تحذير: محتوى للبالغين</h2>
            <p className="text-gray-300 max-w-md leading-relaxed">
              هذا الملف الشخصي يحتوي على محتوى قد لا يكون مناسبًا لجميع الأعمار.  
              الرجاء المتابعة فقط إذا كنت تبلغ السن القانوني وترغب في عرض المحتوى على مسؤوليتك الخاصة.
            </p>
            <motion.button
              onClick={handleConfirm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white px-6 py-2 rounded-xl shadow-lg"
            >
              <Eye size={18} />
              <span>عرض المحتوى</span>
            </motion.button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {/* 👇 ضع هنا محتوى البروفايل الفعلي */}
          <div className="p-6 border border-gray-700 rounded-2xl bg-gray-900 text-gray-100 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <EyeOff className="text-red-400" />
              <h3 className="text-lg font-semibold">تم عرض المحتوى على مسؤوليتك</h3>
            </div>
            <p className="text-sm text-gray-400">الآن يمكنك مشاهدة البروفايل بشكل كامل.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdultContentWarning;
