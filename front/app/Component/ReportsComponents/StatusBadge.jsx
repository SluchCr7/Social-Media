import React from 'react'

const StatusBadge = ({ status }) => {
  const colors = {
    pending:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300',
    resolved:
      'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300',
    rejected:
      'bg-gray-100 text-gray-800 dark:bg-gray-700/20 dark:text-gray-300',
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        colors[status] || colors.rejected
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge