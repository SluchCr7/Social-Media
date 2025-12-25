'use client';
import React, { memo, useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Laptop, MapPin, Clock, Shield } from 'lucide-react';

dayjs.extend(relativeTime);
dayjs.locale('en');

const LoginHistoryTimeline = memo(function LoginHistoryTimeline({ items = [] }) {
  const { t } = useTranslation();

  const timelineItems = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        displayTime: it.date ? dayjs(it.date).fromNow() : t('Unknown time'),
      })),
    [items, t]
  );

  if (!timelineItems.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex p-6 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 mb-4"
        >
          <Shield className="w-12 h-12 text-gray-400" />
        </motion.div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {t('No recent login activity found.')}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Animated vertical timeline */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/70 via-purple-500/50 to-transparent" />

      <ul className="space-y-5 pl-14">
        {timelineItems.map((it, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300 }}
            className="relative group"
          >
            {/* Animated dot */}
            <div className="absolute -left-[34px] top-4">
              <motion.div
                whileHover={{ scale: 1.3 }}
                className="relative"
              >
                <div className="h-4 w-4 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-blue-500/50"
                />
              </motion.div>
            </div>

            {/* Event card with neural glass */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                      <Laptop className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {it.device || t('Unknown device')}
                    </span>
                    {it.location && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{it.location}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                      {it.displayTime}
                    </span>
                  </div>
                </div>

                {/* IP Address */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100/50 dark:bg-gray-700/30 backdrop-blur-sm">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">IP:</span>
                  <span className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-300 break-all">
                    {it.ip || t('No IP info')}
                  </span>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
});
LoginHistoryTimeline.displayName = 'LoginHistoryTimeline';
export default LoginHistoryTimeline;
