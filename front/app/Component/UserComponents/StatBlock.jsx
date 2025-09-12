import React from 'react'

const StatBlock = ({ label, value = 0, onClick }) => (
  <div className="text-center cursor-pointer" onClick={onClick}>
    <AnimatedCounter value={value} className="text-lg font-bold" />
    <div className="text-sm text-gray-400">{label}</div>
  </div>
)

export default StatBlock