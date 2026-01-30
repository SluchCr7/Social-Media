import React from 'react'

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    rejected: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };

  const dots = {
    pending: 'bg-orange-500',
    resolved: 'bg-emerald-500',
    rejected: 'bg-gray-500',
  };

  const activeStyle = styles[status] || styles.rejected;
  const activeDot = dots[status] || dots.rejected;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${activeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${activeDot} ${status === 'pending' ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  );
};

export default StatusBadge