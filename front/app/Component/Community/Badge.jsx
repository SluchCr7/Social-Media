import React from 'react'

const Badge = ({ children, className = '' }) => (
  <span className={`inline-block text-xs px-2 py-1 rounded-full ${className}`}>{children}</span>
)
export default Badge