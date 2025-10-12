'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/Context/AuthContext'
import { usePost } from '@/app/Context/PostContext'
import AnalyticsPresentation from './AnalyticsPresentation'
import AnalyticsSkeleton from '../../Skeletons/AnalyticsSkeleton'
import { useUser } from '@/app/Context/UserContext'
import { useGetData } from '@/app/Custome/useGetData'

export default function AnalyticsContainer() {
  const { user } = useAuth()
  const { fetchUserPosts, userPosts = [] } = usePost()
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [period, setPeriod] = useState('30')
  const [exporting, setExporting] = useState(false)
  const {userData,loading} = useGetData(user._id)

  // Fetch posts
  useEffect(() => {
    if (!userData?._id) return
    fetchUserPosts(userData._id, 1, 200, true)
  }, [userData?._id])

  // Derived metrics
  const totalLikes = useMemo(() => userPosts.reduce((s, p) => s + (p?.likes?.length || 0), 0), [userPosts])
  const totalComments = useMemo(() => userPosts.reduce((s, p) => s + (p?.comments?.length || 0), 0), [userPosts])
  const engagementRate = useMemo(() => {
    const followersCount = followers.length || 1
    return (((totalLikes + totalComments) / followersCount) * 100).toFixed(2)
  }, [totalLikes, totalComments, followers])

  // Time series
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

  const topPosts = useMemo(() => {
    return [...(userPosts || [])]
      .sort((a, b) => ((b.likes?.length || 0) + (b.comments?.length || 0) * 2) - ((a.likes?.length || 0) + (a.comments?.length || 0) * 2))
      .slice(0, 4)
  }, [userPosts])

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

  // CSV export
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

  if (loading) return <div className="p-6 max-w-6xl mx-auto"><AnalyticsSkeleton /></div>

  return (
    <AnalyticsPresentation
      userData={userData}
      user={user}
      followers={followers}
      following={following}
      userPosts={userPosts}
      totalLikes={totalLikes}
      totalComments={totalComments}
      engagementRate={engagementRate}
      timeSeries={timeSeries}
      topPosts={topPosts}
      peakHours={peakHours}
      engagement={engagement}
      exporting={exporting}
      exportCSV={exportCSV}
      period={period}
      setPeriod={setPeriod}
    />
  )
}
