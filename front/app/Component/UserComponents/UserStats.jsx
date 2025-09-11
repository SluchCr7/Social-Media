'use client'
import { useEffect, useState } from 'react'

const AnimatedCounter = ({ value = 0 }) => {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = Number(value) || 0
    if (end === 0) return setDisplay(0)
    const step = Math.max(1, Math.ceil(end / 30))
    const id = setInterval(() => {
      start += step
      if (start >= end) {
        setDisplay(end)
        clearInterval(id)
      } else setDisplay(start)
    }, 20)
    return () => clearInterval(id)
  }, [value])
  return <span>{display}</span>
}

const UserStats = ({ posts, followers, following, onShowFollowers, onShowFollowing }) => {
  return (
    <div className="flex justify-center gap-10 mt-6">
      <div className="text-center">
        <AnimatedCounter value={posts} /> <div className="text-sm text-gray-400">Posts</div>
      </div>
      <div className="text-center cursor-pointer" onClick={onShowFollowers}>
        <AnimatedCounter value={followers} /> <div className="text-sm text-gray-400">Followers</div>
      </div>
      <div className="text-center cursor-pointer" onClick={onShowFollowing}>
        <AnimatedCounter value={following} /> <div className="text-sm text-gray-400">Following</div>
      </div>
    </div>
  )
}

export default UserStats
