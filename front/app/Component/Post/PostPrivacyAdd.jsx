'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaUserFriends, FaCheck } from 'react-icons/fa';

const PostPrivacySelector = ({ onChange, defaultValue = 'public' }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);

  const options = [
    { value: 'public', label: 'Public', icon: <FaGlobe /> },
    { value: 'friends', label: 'Friends', icon: <FaUserFriends /> },
  ];

  const handleSelect = (option) => {
    setSelected(option.value);
    onChange(option.value);
    setOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === selected);

  return (
    <div className="relative w-52">
      {/* Selector Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none"
      >
        <div className="flex items-center gap-2">
          {selectedOption.icon}
          <span>{selectedOption.label}</span>
        </div>
        <span className="text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 mt-2 w-full bg-gray-900 text-white rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-800 transition-colors ${
                  selected === option.value ? 'bg-gray-800 font-semibold' : ''
                }`}
              >
                {option.icon}
                <span>{option.label}</span>
                {selected === option.value && <FaCheck className="ml-auto text-green-400" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostPrivacySelector;
