'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'
import { FaDownload, FaCalendarAlt } from 'react-icons/fa'
import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'
import AnalyticsSkeleton from '../../Skeletons/AnalyticsSkeleton'

// Dark themed color palette
const COLORS = ['#60a5fa', '#2563eb', '#06b6d4', '#f59e0b', '#fb7185']

// Small utility
const formatNumber = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)

export default function AnalyticsDashboardImproved() {
  const { user, getUserById } = useAuth()
  const { fetchUserPosts, userPosts = [] } = usePost()

  const [userData, setUserData] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [period, setPeriod] = useState('30')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  // fetch user profile
  useEffect(() => {
    if (!user?._id) return
    setLoading(true)
    getUserById(user._id)
      .then((res) => {
        setUserData(res)
        setFollowers(res?.followers || [])
        setFollowing(res?.following || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?._id])

  // fetch posts after we have userData
  useEffect(() => {
    if (!userData?._id) return
    fetchUserPosts(userData._id, 1, 200, true)
  }, [userData?._id])

  // derived metrics
  const totalLikes = useMemo(() => userPosts.reduce((s, p) => s + (p?.likes?.length || 0), 0), [userPosts])
  const totalComments = useMemo(() => userPosts.reduce((s, p) => s + (p?.comments?.length || 0), 0), [userPosts])
  const engagementRate = useMemo(() => {
    const followersCount = followers.length || 1
    return (((totalLikes + totalComments) / followersCount) * 100).toFixed(2)
  }, [totalLikes, totalComments, followers])

  // time series for chart
  const timeSeries = useMemo(() => {
    const days = period === '7' ? 7 : period === '30' ? 30 : 90
    const now = new Date()
    const arr = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const postsOnDay = userPosts.filter(p => new Date(p.createdAt).toISOString().split('T')[0] === dateStr)
      const likes = postsOnDay.reduce((s, p) => s + (p.likes?.length || 0), 0)
      const comments = postsOnDay.reduce((s, p) => s + (p.comments?.length || 0), 0)
      arr.push({ date: dateStr.slice(5), posts: postsOnDay.length, likes, comments })
    }
    return arr
  }, [userPosts, period])

  // top posts
  const topPosts = useMemo(() => {
    return [...(userPosts || [])]
      .sort((a, b) => ((b.likes?.length || 0) + (b.comments?.length || 0) * 2) - ((a.likes?.length || 0) + (a.comments?.length || 0) * 2))
      .slice(0, 4)
  }, [userPosts])

  // peak hours calculation
  const peakHours = useMemo(() => {
    const hours = {}
    userPosts.forEach(p => {
      const h = new Date(p.createdAt).getHours()
      hours[h] = (hours[h] || 0) + (p.likes?.length || 1)
    })
    return hours
  }, [userPosts])

  const engagement = [
    { name: 'Likes', value: totalLikes },
    { name: 'Comments', value: totalComments },
    { name: 'Followers', value: followers.length },
  ]

  // export CSV (small helper)
  const exportCSV = () => {
    setExporting(true)
    try {
      const rows = [['Metric', 'Value']]
      rows.push(['Username', userData?.username || user?.email || 'user'])
      rows.push(['Followers', followers.length])
      rows.push(['Following', following.length])
      rows.push(['Total Posts', userPosts.length])
      rows.push(['Total Likes', totalLikes])
      rows.push(['Total Comments', totalComments])
      const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics_${userData?.username || 'user'}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  // Small overview card
  const OverviewCard = ({ title, value, children }) => (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-800 shadow-[0_8px_30px_rgba(2,6,23,0.6)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-gray-400">{title}</div>
          <div className="text-2xl font-semibold text-white">{formatNumber(value)}</div>
        </div>
        <div className="w-16 h-10 flex items-center justify-center text-white/80">{children}</div>
      </div>
    </motion.div>
  )

  if (loading) return (
    <div className="p-6 max-w-6xl mx-auto">
      <AnalyticsSkeleton />
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-gray-300 mt-1">Quick overview of <span className="font-medium text-white">{userData?.username || user?.email}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-900/60 rounded-lg p-2 border border-gray-800">
            <FaCalendarAlt className="text-gray-300" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-100"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <button
            onClick={exportCSV}
            disabled={exporting}
            className="px-3 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg shadow-md flex items-center gap-2 text-sm"
          >
            <FaDownload />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <OverviewCard title="Posts" value={userPosts.length}>
          <div className="text-xs text-gray-300">P</div>
        </OverviewCard>

        <OverviewCard title="Followers" value={followers.length}>
          <div className="text-xs text-gray-300">F</div>
        </OverviewCard>

        <OverviewCard title="Likes" value={totalLikes}>
          <div className="text-xs text-gray-300">L</div>
        </OverviewCard>

        <OverviewCard title="Engagement %" value={Number(engagementRate)}>
          <div className="text-xs text-gray-300">ER</div>
        </OverviewCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-2 p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold">Activity Over Time</h4>
            <div className="text-sm text-gray-300">Posts • Likes • Comments</div>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries}>
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ background: '#0b1220', border: '1px solid #111827' }}
                />
                <Line dataKey="posts" stroke={COLORS[0]} dot={false} strokeWidth={2} />
                <Line dataKey="likes" stroke={COLORS[1]} dot={false} strokeWidth={2} />
                <Line dataKey="comments" stroke={COLORS[2]} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-800"
        >
          <h4 className="text-lg font-semibold mb-2">Engagement</h4>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={engagement} dataKey="value" nameKey="name" outerRadius={70} innerRadius={35}>
                  {engagement.map((e, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {engagement.map((e, i) => (
              <div key={i} className="flex items-center justify-between text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span>{e.name}</span>
                </div>
                <div>{formatNumber(e.value)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row: Top posts + Peak hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-800">
          <h4 className="text-lg font-semibold mb-3">Top Posts</h4>
          <div className="space-y-3">
            {topPosts.length ? topPosts.map(p => {
              const score = (p.likes?.length || 0) + (p.comments?.length || 0) * 2
              const maxScore = Math.max(...topPosts.map(tp => (tp.likes?.length || 0) + (tp.comments?.length || 0) * 2), 1)
              return (
                <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                  <div className="flex-1 pr-4">
                    <div className="truncate text-sm font-medium">{p.text || (p.caption || '—')}</div>
                    <div className="text-xs text-gray-400 mt-1">{formatNumber(p.likes?.length || 0)} likes • {formatNumber(p.comments?.length || 0)} comments</div>
                  </div>
                  <div className="w-36 flex items-center gap-3">
                    <div className="text-sm font-semibold text-indigo-300">{score}</div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-2 bg-indigo-500 rounded-full" style={{ width: `${(score / maxScore) * 100}%` }} />
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="text-sm text-gray-400">No posts yet</div>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-800">
          <h4 className="text-lg font-semibold mb-3">Peak Hours</h4>
          <div className="flex gap-2 items-end h-36 px-2">
            {Array.from({ length: 24 }).map((_, h) => {
              const max = Math.max(...Object.values(peakHours || {}), 1)
              const value = peakHours[h] || 0
              return (
                <div key={h} className="flex flex-col items-center text-gray-300 text-xs">
                  <div className="w-4 rounded-sm" style={{ height: `${(value / max) * 100}%`, background: `linear-gradient(180deg, #2563eb, #60a5fa)` }} />
                  <div className="mt-1">{h}</div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 text-xs text-gray-400">Best posting hours are shown as taller bars.</div>
        </div>
      </div>

    </div>
  )
}
