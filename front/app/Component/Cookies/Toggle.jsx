import { ToggleRight } from 'lucide-react';
import React from 'react'

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/60 dark:bg-black/40 border border-white/5">
    <div>
      <div className="font-medium text-sm">{label}</div>
      {description && <div className="text-xs opacity-75 mt-1">{description}</div>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition ${
        checked ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
      }`}
    >
      <ToggleRight className="w-4 h-4" />
      <span className="sr-only">{checked ? 'Enabled' : 'Disabled'}</span>
    </button>
  </div>
);

export default Toggle