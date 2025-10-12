import React from 'react'

function LoginHistoryTimeline({ items = [] }) {
  if (!items.length) return <div className="text-sm text-gray-500">No recent activity found.</div>
  return (
    <ul className="space-y-4">
      {items.map((it, idx) => (
        <li key={idx} className="flex gap-4 items-start">
          <div className="w-3">
            <div className="h-3 w-3 rounded-full bg-blue-500 mt-1" />
            {idx !== items.length - 1 && <div className="w-px bg-gray-200 dark:bg-gray-800 flex-1 mx-auto" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">{it.device} • {it.location}</div>
              <div className="text-xs text-gray-500">{it.time}</div>
            </div>
            <div className="text-sm text-gray-500 mt-1">{it.ip}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}


export default LoginHistoryTimeline