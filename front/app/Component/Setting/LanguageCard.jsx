import React from 'react'
import clsx from 'clsx'
import { FaCheck } from 'react-icons/fa'

function LanguageCard({ lang, active, onClick }) {
  return (
    <button
      onClick={() => onClick(lang.code)}
      className={clsx(
        'p-3 border rounded-lg text-left w-full hover:shadow transition flex items-center gap-3',
        active ? 'bg-gradient-to-r from-white/60 to-blue-50 dark:from-gray-800 dark:to-gray-900 ring-2 ring-offset-1 ring-blue-400' : 'bg-transparent'
      )}
    >
      <div className="text-2xl">{lang.flag}</div>
      <div className="flex-1">
        <div className="font-medium">{lang.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{lang.code.toUpperCase()}</div>
      </div>
      {active && <FaCheck className="text-blue-600" />}
    </button>
  )
}

export default LanguageCard