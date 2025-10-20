'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaUserFriends, FaCheck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const PostPrivacySelector = ({ onChange, defaultValue = 'public' }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const {t} = useTranslation()
  
  const options = [
    { value: 'public', label: t('Public'), icon: <FaGlobe /> },
    { value: 'friends', label: t('Friends'), icon: <FaUserFriends /> },
    // يمكن إضافة خيارات أخرى مثل 'only_me' هنا
  ];

  const handleSelect = (option) => {
    setSelected(option.value);
    onChange(option.value);
    setOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === selected);

  return (
    <div className="relative w-full min-w-[120px] max-w-[180px]">
      {/* Selector Button - مُحدث بالألوان المُخصصة */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 bg-lightMode-menu dark:bg-gray-800 text-lightMode-text2 dark:text-darkMode-fg rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm hover:border-lightMode-text dark:hover:border-darkMode-text transition-all focus:outline-none focus:ring-2 focus:ring-lightMode-text dark:focus:ring-darkMode-text"
      >
        <div className="flex items-center gap-2 text-sm font-semibold">
          {/* لون الأيقونة يتغير بالوضع الداكن والفاتح */}
          <span className="text-lightMode-text dark:text-darkMode-text">{selectedOption.icon}</span>
          <span className="truncate">{selectedOption.label}</span>
        </div>
        {/* لون السهم يتغير بالوضع الداكن والفاتح */}
        <span className={`text-xs ml-2 transform transition-transform ${open ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>

      {/* Dropdown - مُحدث بالألوان المُخصصة */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 mt-2 w-full bg-lightMode-menu dark:bg-gray-800 text-lightMode-text2 dark:text-darkMode-fg rounded-xl shadow-xl border border-gray-300 dark:border-gray-700 z-50 overflow-hidden"
          >
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors text-sm ${
                  selected === option.value 
                    ? 'bg-lightMode-text/10 dark:bg-darkMode-text/10 font-bold border-l-4 border-lightMode-text dark:border-darkMode-text' // تمييز العنصر المختار بلون الموقع
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {/* الأيقونة داخل القائمة */}
                <span className="text-lightMode-text dark:text-darkMode-text">{option.icon}</span>
                <span className="flex-1">{option.label}</span>
                
                {/* علامة التحقق */}
                {selected === option.value && <FaCheck className="ml-auto text-lightMode-text dark:text-darkMode-text" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostPrivacySelector;