import React, { useState } from 'react'

const AnimatedCounter = ({ value = 0, duration = 0.8, className = '' }) => {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const end = Number(value) || 0
    if (!end) {
      setDisplay(0)
      return
    }
    const increment = Math.max(1, Math.ceil(end / (duration * 60)))
    const id = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplay(end)
        clearInterval(id)
      } else setDisplay(start)
    }, 1000 / 60)

    return () => clearInterval(id)
  }, [value, duration])

  return <div className={className}>{display}</div>
}


const StatBlock = ({ label, value = 0, onClick }) => (
  <div className="text-center cursor-pointer" onClick={onClick}>
    <AnimatedCounter value={value} className="text-lg font-bold" />
    <div className="text-sm text-gray-400">{label}</div>
  </div>
)

export default StatBlock