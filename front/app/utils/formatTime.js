export const formatTime = (s = 0) => {
  if (!s || isNaN(s)) return '0:00'
  const mm = Math.floor(s / 60)
  const ss = Math.floor(s % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}