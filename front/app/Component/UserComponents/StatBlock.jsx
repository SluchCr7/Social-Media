import React, { useEffect, useState, memo } from 'react'

const AnimatedCounter = memo(({ value = 0, duration = 0.8, className = '' }) => {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const end = Number(value) || 0
    if (end === display) return // ✅ لا تعيد التشغيل إذا لم تتغير القيمة
    if (end === 0) {
      setDisplay(0)
      return
    }

    let start = 0
    const increment = Math.max(1, Math.ceil(end / (duration * 60)))
    const id = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplay(end)
        clearInterval(id)
      } else {
        setDisplay(start)
      }
    }, 1000 / 60)

    return () => clearInterval(id)
  }, [value, duration])

  return <div className={className}>{display}</div>
})

const StatBlock = memo(({ label, value = 0, onClick }) => (
  <div
    className="text-center cursor-pointer select-none"
    onClick={onClick}
  >
    <AnimatedCounter value={value} className="text-lg font-bold" />
    <div className="text-sm text-gray-400">{label}</div>
  </div>
))

export default StatBlock
