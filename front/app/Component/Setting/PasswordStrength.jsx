import { getPasswordStrength } from '@/app/utils/getPasswordStrength';
import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle } from 'lucide-react';

function PasswordStrength({ password }) {
  const { score, label } = getPasswordStrength(password);
  const pct = (score / 4) * 100;

  const getStrengthColor = () => {
    if (score <= 1) return 'from-red-500 to-red-600';
    if (score === 2) return 'from-yellow-400 to-amber-500';
    return 'from-emerald-400 to-green-500';
  };

  const getStrengthIcon = () => {
    if (score <= 1) return <Lock className="w-4 h-4" />;
    if (score === 2) return <Shield className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-3">
      {/* Progress bar container */}
      <div className="relative w-full h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-full overflow-hidden shadow-inner">
        {/* Animated progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={clsx(
            'relative h-full rounded-full bg-gradient-to-r transition-all duration-500',
            getStrengthColor()
          )}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          />
        </motion.div>

        {/* Glow effect */}
        {password && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className={clsx(
              'absolute inset-0 blur-md bg-gradient-to-r',
              getStrengthColor()
            )}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>

      {/* Strength info */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className={clsx(
            'p-1.5 rounded-lg transition-colors',
            score <= 1 && 'bg-red-500/10 text-red-600 dark:text-red-400',
            score === 2 && 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
            score >= 3 && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          )}>
            {getStrengthIcon()}
          </div>
          <span className={clsx(
            'text-sm font-bold transition-colors',
            score <= 1 && 'text-red-600 dark:text-red-400',
            score === 2 && 'text-yellow-600 dark:text-yellow-400',
            score >= 3 && 'text-emerald-600 dark:text-emerald-400'
          )}>
            {label}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
            {password ? `${Math.round(pct)}%` : '0%'}
          </span>
          {/* Strength dots */}
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((dot) => (
              <motion.div
                key={dot}
                initial={{ scale: 0 }}
                animate={{ scale: dot <= score ? 1 : 0.5 }}
                className={clsx(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  dot <= score
                    ? clsx(
                      score <= 1 && 'bg-red-500',
                      score === 2 && 'bg-yellow-500',
                      score >= 3 && 'bg-emerald-500'
                    )
                    : 'bg-gray-300 dark:bg-gray-600'
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PasswordStrength;