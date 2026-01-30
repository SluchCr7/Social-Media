'use client'
import React, { useCallback, memo } from 'react';
import Image from 'next/image';
import StatusBadge from './StatusBadge';
import DropdownActions from './DropdownActions';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ReportRow = memo(({ report, type, openModal, callbacks, t }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group border-b border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
    >
      {/* Reporter */}
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-white/10">
            <Image
              src={report.owner?.profilePhoto?.url || '/default-profile.png'}
              alt="Reporter"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {report.owner?.username}
            </p>
            <p className="text-[11px] text-gray-400 font-medium">@{report.owner?.profileName}</p>
          </div>
        </div>
      </td>

      {/* Target */}
      <td className="px-8 py-5">
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 font-medium">
            {type === 'user' && <span className="font-bold text-indigo-500">@{report.reportedUserId?.username}</span>}
            {type === 'post' && (report.postId?.text || <span className="italic text-gray-400">{t("Content unavailable")}</span>)}
            {type === 'comment' && (report.commentId?.text || <span className="italic text-gray-400">{t("Content unavailable")}</span>)}
          </p>
        </div>
      </td>

      {/* Reason */}
      <td className="px-8 py-5">
        <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-bold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5">
          {report.reason || t("No reason")}
        </span>
      </td>

      {/* Status */}
      <td className="px-8 py-5">
        <StatusBadge status={report.status} />
      </td>

      {/* Actions */}
      <td className="px-8 py-5 text-right">
        <div className="inline-block relative">
          <DropdownActions
            type={type}
            onDeleteReport={() => callbacks.handleDeleteReport(report)}
            onDeleteTarget={() => callbacks.handleDeleteTarget(report)}
            onSuspend={() => callbacks.handleSuspend(report)}
            onBan={() => callbacks.handleBan(report)}
            onResolve={() => callbacks.handleResolve(report)}
          />
        </div>
      </td>
    </motion.tr>
  );
}, (prev, next) => prev.report === next.report && prev.type === next.type);
ReportRow.displayName = 'ReportRow'


const ReportsTable = ({ reports, type, openModal }) => {
  const { t } = useTranslation();

  const handleDeleteReport = useCallback((report) => openModal('deleteReport', report), [openModal]);
  const handleDeleteTarget = useCallback((report) => openModal('deleteTarget', report), [openModal]);
  const handleSuspend = useCallback((report) => openModal('suspendUser', report), [openModal]);
  const handleBan = useCallback((report) => openModal('banUser', report), [openModal]);
  const handleResolve = useCallback((report) => openModal('resolve', report), [openModal]);

  const callbacks = {
    handleDeleteReport,
    handleDeleteTarget,
    handleSuspend,
    handleBan,
    handleResolve,
  };

  if (!reports || reports.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-bold">{t("No pending reports found")}</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
          <tr>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">{t("Reporter")}</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">{t("Target Content")}</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">{t("Reason")}</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">{t("Status")}</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right">{t("Actions")}</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report, idx) => (
            <ReportRow
              key={report._id || idx}
              report={report}
              type={type}
              openModal={openModal}
              callbacks={callbacks}
              t={t}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;
