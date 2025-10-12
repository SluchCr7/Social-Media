import { getPasswordStrength } from '@/app/utils/getPasswordStrength'
import React from 'react'

function PasswordStrength({ password }) {
  const { score, label } = getPasswordStrength(password)
  const pct = (score / 4) * 100
  return (
    <div className="space-y-2">
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          style={{ width: `${pct}%` }}
          className={clsx('h-full rounded-full transition-all', {
            'bg-red-500': score <= 1,
            'bg-yellow-400': score === 2,
            'bg-emerald-400': score >= 3,
          })}
        />
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>{label}</span>
        <span>{password ? `${pct}%` : '0%'}</span>
      </div>
    </div>
  )
}


export default PasswordStrength