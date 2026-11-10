'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiShieldCheck,
  HiArrowPath,
  HiUser,
  HiClock,
  HiComputerDesktop,
  HiTag,
  HiChevronLeft,
  HiChevronRight,
  HiMagnifyingGlass,
} from 'react-icons/hi2';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useAdmin } from '@/app/redux/hooks/useAdmin';

const ACTION_COLORS = {
  update_status: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  toggle_admin: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  toggle_verify: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  force_logout: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  delete_user: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  delete_content: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  broadcast: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  system_cleanup: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

const LogsTab = () => {
  const { t } = useTranslation();
  const {
    logsItems,
    logsTotal,
    logsTotalPages,
    logsPage,
    isLogsLoading,
    setLogsPage,
    refetchLogs,
  } = useAdmin();

  const [filterAction, setFilterAction] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = useMemo(() => {
    return logsItems.filter((log) => {
      const matchesAction = filterAction === 'all' || log.action === filterAction;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesAction;

      const adminName = log.admin?.username?.toLowerCase() || '';
      const actionName = log.action?.toLowerCase() || '';
      const targetType = log.targetType?.toLowerCase() || '';
      const details = typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || '');

      return matchesAction && (
        adminName.includes(query) ||
        actionName.includes(query) ||
        targetType.includes(query) ||
        details.toLowerCase().includes(query)
      );
    });
  }, [logsItems, filterAction, searchQuery]);

  return (
    <div className="min-h-screen w-full p-6 md:p-10 space-y-8">
      {/* 🚀 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
            {t('Audit')} <span className="text-indigo-500">{t('Trail')}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t('Immutable activity records of administrative actions & system alterations')}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => refetchLogs()}
          disabled={isLogsLoading}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 font-black text-xs uppercase tracking-widest disabled:opacity-50"
        >
          <HiArrowPath className={`w-4 h-4 ${isLogsLoading ? 'animate-spin' : ''}`} />
          {t('Refresh Logs')}
        </motion.button>
      </div>

      {/* 🔍 Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('Search audit logs by admin, action, target, or details...')}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full px-4 py-3.5 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-semibold text-gray-900 dark:text-white cursor-pointer transition-all shadow-sm"
          >
            <option value="all">{t('All Actions')}</option>
            <option value="update_status">{t('Status Update')}</option>
            <option value="toggle_admin">{t('Role Change')}</option>
            <option value="toggle_verify">{t('Verification')}</option>
            <option value="force_logout">{t('Session Termination')}</option>
            <option value="delete_user">{t('User Deletion')}</option>
            <option value="delete_content">{t('Content Moderation')}</option>
            <option value="broadcast">{t('Network Broadcast')}</option>
            <option value="system_cleanup">{t('System Maintenance')}</option>
          </select>
        </div>
      </div>

      {/* 📋 Logs Table */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('Administrator')}
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('Action')}
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('Target')}
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('Details')}
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('IP Address')}
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('Timestamp')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs">
              <AnimatePresence>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => {
                    const badgeClass =
                      ACTION_COLORS[log.action] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';

                    return (
                      <motion.tr
                        key={log._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Admin */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl overflow-hidden relative border border-gray-200 dark:border-white/10 flex-shrink-0">
                              <Image
                                src={log.admin?.profilePhoto?.url || '/default-profile.png'}
                                alt={log.admin?.username || 'admin'}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">
                                {log.admin?.username || 'System Admin'}
                              </p>
                              <p className="text-[10px] text-gray-400">{log.admin?.email || '--'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Action Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${badgeClass}`}
                          >
                            {log.action?.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Target */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">
                              {log.targetType || 'System'}
                            </span>
                            {log.targetId && (
                              <p className="text-[10px] font-mono text-gray-400 truncate max-w-[140px]">
                                {log.targetId}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Details */}
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate text-gray-600 dark:text-gray-300 font-medium">
                            {typeof log.details === 'object'
                              ? JSON.stringify(log.details)
                              : String(log.details || '--')}
                          </div>
                        </td>

                        {/* IP Address */}
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400 font-mono text-[11px]">
                          {log.ip || '127.0.0.1'}
                        </td>

                        {/* Timestamp */}
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400 font-medium text-[11px]">
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '--'}
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400 font-medium">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
                          <HiShieldCheck className="w-6 h-6" />
                        </div>
                        <p>{t('No audit records found matching your query')}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {logsTotalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">
              {t('Page')} <span className="font-bold text-gray-900 dark:text-white">{logsPage}</span> {t('of')}{' '}
              <span className="font-bold text-gray-900 dark:text-white">{logsTotalPages}</span> (
              {logsTotal} {t('total records')})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogsPage(Math.max(1, logsPage - 1))}
                disabled={logsPage <= 1}
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-700 dark:text-gray-300"
              >
                <HiChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLogsPage(Math.min(logsTotalPages, logsPage + 1))}
                disabled={logsPage >= logsTotalPages}
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-700 dark:text-gray-300"
              >
                <HiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsTab;
