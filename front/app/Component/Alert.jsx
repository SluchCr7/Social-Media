'use client';
import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const Alert = ({ notify }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notify) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000); // إخفاء بعد 3 ثوانٍ
      return () => clearTimeout(timer);
    }
  }, [notify]);

  return (
    <div
      className={`${
        visible ? 'opacity-100 w-[80%] md:w-[350px]' : 'opacity-0 pointer-events-none w-0'
      } transition-all fixed top-6 right-6 z-[1000] flex items-center gap-3 p-5 rounded-xl shadow-lg backdrop-blur-lg  bg-opacity-80`}
    >
      <FaCheck className="text-green-400 text-2xl" />
      <p className="text-lightMode-fg dark:text-darkMode-fg text-sm">{notify}</p>
    </div>
  );
};

export default Alert;
