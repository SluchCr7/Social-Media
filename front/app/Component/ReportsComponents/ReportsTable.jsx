import React from 'react'
import StatusBadge from './StatusBadge';
import DropdownActions from './DropdownActions';
import Image from 'next/image';

const ReportsTable = ({ reports, type, openModal }) => (
  <div className="w-full">
    <table className="w-full text-sm text-left border-collapse">
      <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
        <tr>
          <th className="px-4 py-2">Reporter</th>
          <th className="px-4 py-2">Target</th>
          <th className="px-4 py-2">Reason</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr
            key={report._id}
            className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {/* Reporter */}
            <td className="px-4 py-2 flex items-center gap-2">
              <Image
                src={report.owner?.profilePhoto?.url || '/default-profile.png'}
                alt="Reporter"
                width={30}
                height={30}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{report.owner?.username}</p>
                <p className="text-xs text-gray-500">
                  {report.owner?.profileName}
                </p>
              </div>
            </td>

            {/* Target */}
            <td className="px-4 py-2">
              {type === 'user' && (
                <span>{report.reportedUserId?.username}</span>
              )}
              {type === 'post' && (
                <span>{report.postId?.text?.slice(0, 30) || 'Post'}</span>
              )}
              {type === 'comment' && (
                <span>{report.commentId?.text?.slice(0, 30) || 'Comment'}</span>
              )}
            </td>

            {/* Reason */}
            <td className="px-4 py-2">{report.reason}</td>

            {/* Status */}
            <td className="px-4 py-2">
              <StatusBadge status={report.status} />
            </td>

            {/* Actions */}
            <td className="px-4 py-2">
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
  </div>
);

export default ReportsTable