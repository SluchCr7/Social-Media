'use client';
import React, { memo, useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Laptop, MapPin, Clock } from 'lucide-react';

dayjs.extend(relativeTime);
dayjs.locale('en');

const LoginHistoryTimeline = memo(function LoginHistoryTimeline({ items = [] }) {
  const { t } = useTranslation();

  // ✅ تجهيز البيانات مسبقًا (Memoized)
  const timelineItems = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        displayTime: it.date ? dayjs(it.date).fromNow() : t('Unknown time'),
      })),
    [items, t]
  );

  // ✅ حالة عدم وجود بيانات
  if (!timelineItems.length) {
    return (
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">
        {t('No recent login activity found.')}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* الخط الزمني العمودي */}
      <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/70 via-indigo-400/50 to-transparent" />

      <ul className="space-y-6 pl-10">
        {timelineItems.map((it, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="relative group"
          >
            {/* النقطة الزرقاء */}
            <div className="absolute -left-[9px] top-3">
              <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md shadow-blue-400/20 group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* بطاقة الحدث */}
            <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md 
                            border border-gray-200/40 dark:border-gray-700/40 
                            hover:shadow-md hover:shadow-blue-400/10 transition-all duration-300">
              
              {/* الرأس: الجهاز والموقع والوقت */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                  <Laptop className="w-4 h-4 text-blue-500 shrink-0" />
                  {it.device || t('Unknown device')}
                  {it.location && (
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {it.location}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                  <Clock className="w-3 h-3 shrink-0" />
                  {it.displayTime}
                </div>
              </div>

              {/* الـ IP */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 break-all pl-5 sm:pl-0">
                IP: <span className="font-mono">{it.ip || t('No IP info')}</span>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
});
LoginHistoryTimeline.displayName = 'LoginHistoryTimeline'
export default LoginHistoryTimeline;
