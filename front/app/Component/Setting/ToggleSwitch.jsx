'use client'
import React, { memo } from 'react'
import clsx from 'clsx'

function ToggleSwitch({ checked, onChange, onColor = 'bg-blue-500' }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-8 w-14 rounded-full transition-colors focus:outline-none',
        checked ? 'bg-gray-700' : 'bg-yellow-400'
      )}
    >
      <span
        className={clsx(
          'absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-300',
          checked ? 'translate-x-0' : 'translate-x-6'
        )}
      />
    </button>
  )
}


export default memo(ToggleSwitch)