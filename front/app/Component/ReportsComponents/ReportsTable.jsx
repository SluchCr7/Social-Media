'use client'
import React from 'react';
import Image from 'next/image';
import StatusBadge from './StatusBadge';
import DropdownActions from './DropdownActions';
import { useTranslation } from 'react-i18next';

const ReportsTable = ({ reports, type, openModal }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto bg-lightMode-bg dark:bg-darkMode-bg rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text2 dark:text-darkMode-text font-semibold uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4">{t("Reporter")}</th>
            <th className="px-6 py-4">{t("Target")}</th>
            <th className="px-6 py-4">{t("Reason")}</th>
            <th className="px-6 py-4">{t("Status")}</th>
            <th className="px-6 py-4 text-center">{t("Actions")}</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report, idx) => (
            <tr
              key={report._id || idx}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-lightMode-menu dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {/* Reporter */}
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={report.owner?.profilePhoto?.url || '/default-profile.png'}
                    alt="Reporter"
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover border-2 border-lightMode-text dark:border-darkMode-text shadow-sm"
                  />
                </div>
                <div>
                  <p className="font-semibold text-lightMode-fg dark:text-darkMode-fg">
                    {report.owner?.username}
                  </p>
                  <p className="text-xs text-gray-500">@{report.owner?.profileName}</p>
                </div>
              </td>

              {/* Target */}
              <td className="px-6 py-4 text-lightMode-text2 dark:text-darkMode-text2">
                {type === 'user' && <span>{report.reportedUserId?.username}</span>}
                {type === 'post' && (
                  <span>{report.postId?.text?.slice(0, 40) || t("Post")}</span>
                )}
                {type === 'comment' && (
                  <span>{report.commentId?.text?.slice(0, 40) || t("Comment")}</span>
                )}
              </td>

              {/* Reason */}
              <td className="px-6 py-4 text-lightMode-text2 dark:text-darkMode-text2 italic">
                {report.reason || t("No reason provided")}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <StatusBadge status={report.status} />
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-center">
                <DropdownActions
                  type={type}
                  onDeleteReport={() => openModal('deleteReport', report)}
                  onDeleteTarget={() => openModal('deleteTarget', report)}
                  onSuspend={() => openModal('suspendUser', report)}
                  onBan={() => openModal('banUser', report)}
                  onResolve={() => openModal('resolve', report)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reports.length === 0 && (
        <div className="py-10 text-center text-lightMode-text2 dark:text-darkMode-text2 text-sm">
          {t("No reports found")}
        </div>
      )}
    </div>
  );
};

export default ReportsTable;
