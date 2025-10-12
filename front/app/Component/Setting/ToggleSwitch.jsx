import React from 'react'
import clsx from 'clsx'

function ToggleSwitch({ checked, onChange, onColor = 'bg-blue-500' }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-8 w-14 items-center rounded-full p-1 transition-shadow focus:outline-none',
        checked ? onColor : 'bg-gray-300 dark:bg-gray-700'
      )}
    >
      <span
        className={clsx(
          'block h-6 w-6 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-0'
        )}
      />
    </button>
  )
}


export default ToggleSwitch