'use client';

import React, { useState, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiGlobeAlt, HiUsers, HiCheck } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

const PostPrivacySelector = memo(({ onChange, defaultValue = 'public' }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const { t } = useTranslation();

  const options = useMemo(() => [
    { value: 'public', label: t('Public'), icon: <HiGlobeAlt /> },
    { value: 'friends', label: t('Friends'), icon: <HiUsers /> },
  ], [t]);

  const selectedOption = useMemo(
    () => options.find(opt => opt.value === selected),
    [options, selected]
  );

  const handleSelect = useCallback((option) => {
    setSelected(option.value);
    onChange(option.value);
    setOpen(false);
  }, [onChange]);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm transition-all focus:outline-none"
      >
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <span className="text-indigo-500">{selectedOption.icon}</span>
          <span className="truncate">{selectedOption.label}</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="text-[8px] text-gray-400"
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-3 w-48 bg-white/90 dark:bg-[#0B0F1A]/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 z-[100] overflow-hidden"
          >
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all text-[10px] font-black uppercase tracking-widest ${selected === option.value
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-white/5'
                  }`}
              >
                <span className={selected === option.value ? 'text-white' : 'text-indigo-500'}>
                  {option.icon}
                </span>
                <span className="flex-1">{option.label}</span>
                {selected === option.value && <HiCheck className="text-white" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
});

PostPrivacySelector.displayName = 'PostPrivacySelector';
export default PostPrivacySelector;
