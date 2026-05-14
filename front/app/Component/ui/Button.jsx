'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/app/utils/cn';

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  disabled = false,
  isLoading = false,
  children,
  ...props 
}, ref) => {
  
  const variants = {
    default: 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md',
    outline: 'bg-transparent border border-gray-200 dark:border-threads-border hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
    secondary: 'bg-gray-100 dark:bg-threads-border text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-threads-border/80',
  };

  const sizes = {
    default: 'h-10 px-6 py-2 text-[15px]',
    sm: 'h-8 px-4 py-1.5 text-[13px]',
    lg: 'h-12 px-8 py-3 text-[17px]',
    icon: 'h-10 w-10 flex items-center justify-center p-0',
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{children}</span>
        </div>
      ) : children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export { Button };
