// 'use client'
// import React, { useEffect, useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import { FaDownload, FaCalendarAlt, FaHeart, FaComment, FaUser } from "react-icons/fa";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip,
//   PieChart, Pie, Cell, ResponsiveContainer, Legend
// } from "recharts";
// import { useAuth } from "@/app/Context/AuthContext";
// import { usePost } from "@/app/Context/PostContext";
// import AnalyticsSkeleton from "@/app/Skeletons/AnalyticsSkeleton";

// // ----- COLORS & THEME -----
// const COLORS = ["#3b82f6", "#2563eb", "#14b8a6", "#facc15", "#f97316"];

// export default function AnalyticsDashboard() {
//   const { user, getUserById } = useAuth();
//   const { fetchUserPosts, userPosts } = usePost();

//   const [userData, setUserData] = useState(null);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [period, setPeriod] = useState("30");
//   const [loading, setLoading] = useState(false);

//   // ----- Fetch user data -----
//   useEffect(() => {
//     if (!user?._id) return;
//     setLoading(true);
//     getUserById(user._id)
//       .then(res => {
//         setUserData(res);
//         setFollowers(res?.followers || []);
//         setFollowing(res?.following || []);
//       })
//       .catch(err => console.log(err))
//       .finally(() => setLoading(false));
//   }, [user?._id]);

//   // ----- Fetch user's posts -----
//   useEffect(() => {
    
//     if (!userData?._id) return;
//     fetchUserPosts(userData._id, 1, 100, true); // جلب 100 بوست
//   }, [userData?._id]);

//   // ----- Derived data -----
//   const totalLikes = useMemo(() => userPosts.reduce((sum, p) => sum + (p?.likes?.length || 0), 0), [userPosts]);
//   const totalComments = useMemo(() => userPosts.reduce((sum, p) => sum + (p?.comments?.length || 0), 0), [userPosts]);

//   const overview = [
//     { key: "Posts", value: userPosts.length, icon: <FaUser /> },
//     { key: "Followers", value: followers.length, icon: <FaUser /> },
//     { key: "Following", value: following.length, icon: <FaUser /> },
//     { key: "Likes", value: totalLikes, icon: <FaHeart /> },
//     { key: "Comments", value: totalComments, icon: <FaComment /> },
//   ];

//   const timeSeries = useMemo(() => {
//     const data = [];
//     const now = new Date();
//     const days = period === "7" ? 7 : period === "30" ? 30 : 90;
//     for (let i = days - 1; i >= 0; i--) {
//       const d = new Date(now);
//       d.setDate(d.getDate() - i);
//       const dateStr = d.toISOString().split("T")[0];
//       const postsOnDay = userPosts.filter(p => new Date(p.createdAt).toISOString().split("T")[0] === dateStr);
//       const likes = postsOnDay.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
//       const comments = postsOnDay.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
//       data.push({ date: dateStr.slice(5), posts: postsOnDay.length, likes, comments });
//     }
//     return data;
//   }, [userPosts, period]);

//   const topPosts = useMemo(() => {
//     return [...userPosts]
//       .sort((a, b) => ((b.likes?.length || 0) + (b.comments?.length || 0)*2) - ((a.likes?.length || 0) + (a.comments?.length || 0)*2))
//       .slice(0, 3);
//   }, [userPosts]);

//   const peakHours = useMemo(() => {
//     const hours = {};
//     userPosts.forEach(p => {
//       const h = new Date(p.createdAt).getHours();
//       hours[h] = (hours[h] || 0) + (p.likes?.length || 1);
//     });
//     return hours;
//   }, [userPosts]);

//   const engagement = [
//     { name: "Likes", value: totalLikes },
//     { name: "Comments", value: totalComments },
//     { name: "Followers", value: followers.length },
//   ];

//   // ----- Export CSV -----
//   const exportCSV = () => {
//     const rows = [["Metric", "Value"]];
//     overview.forEach(o => rows.push([o.key, o.value]));
//     const csv = rows.map(r => r.join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `analytics_${userData?.username || "user"}.csv`;
//     a.click();
//   };

//   // ----- Render Functions -----
//   const renderOverview = () => (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//       {overview.map(item => (
//         <motion.div
//           key={item.key}
//           whileHover={{ scale: 1.05 }}
//           className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700"
//         >
//           <div className="text-2xl mb-2 text-blue-600 dark:text-blue-400">{item.icon}</div>
//           <div className="text-sm opacity-70 text-gray-700 dark:text-gray-300">{item.key}</div>
//           <div className="text-3xl font-bold text-gray-900 dark:text-white">{item.value}</div>
//         </motion.div>
//       ))}
//     </div>
//   );

//   const renderLineChart = () => (
//     <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
//       <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Activity Over Time</h4>
//       <div style={{ height: 300 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={timeSeries}>
//             <XAxis dataKey="date" stroke="currentColor"/>
//             <YAxis stroke="currentColor"/>
//             <Tooltip formatter={(value, name) => [value, name]} />
//             <Line type="monotone" dataKey="posts" stroke={COLORS[0]} dot={{ r: 3 }} />
//             <Line type="monotone" dataKey="likes" stroke={COLORS[1]} dot={{ r: 3 }} />
//             <Line type="monotone" dataKey="comments" stroke={COLORS[2]} dot={{ r: 3 }} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );

//   const renderEngagementChart = () => (
//     <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
//       <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Engagement Overview</h4>
//       <ResponsiveContainer width="100%" height={250}>
//         <PieChart>
//           <Pie data={engagement} dataKey="value" nameKey="name" outerRadius={80} startAngle={180} endAngle={0} label>
//             {engagement.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//           </Pie>
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );

// // ----- Top Posts Component -----
// const renderTopPosts = () => (
//   <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
//     <h4 className="font-semibold mb-4 text-gray-900 dark:text-white text-lg">Top Posts</h4>
//     <div className="space-y-3">
//       {topPosts.length ? topPosts.map(p => {
//         const engagementScore = (p.likes?.length || 0) + (p.comments?.length || 0) * 2;
//         const maxScore = Math.max(...topPosts.map(tp => (tp.likes?.length || 0) + (tp.comments?.length || 0) * 2), 1);
//         const progressPercent = (engagementScore / maxScore) * 100;

//         return (
//           <motion.div
//             key={p._id}
//             whileHover={{ scale: 1.02 }}
//             className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:shadow-md hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 dark:hover:from-gray-700 dark:hover:to-gray-600 cursor-pointer"
//             title={p.text}
//           >
//             <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{p.text}</p>
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{engagementScore} ❤️</span>
//               <div className="w-20 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
//                 <div
//                   className="h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
//                   style={{ width: `${progressPercent}%` }}
//                 ></div>
//               </div>
//             </div>
//           </motion.div>
//         );
//       }) : (
//         <div className="text-sm opacity-70 text-gray-700 dark:text-gray-300">No posts yet</div>
//       )}
//     </div>
//   </div>
// );

// // ----- Peak Hours Component -----
// const renderPeakHours = () => {
//   const max = Math.max(...Object.values(peakHours || {}), 1);

//   // function to determine color based on value
//   const getColor = (value) => {
//     const ratio = value / max;
//     if (ratio > 0.75) return '#f87171'; // red
//     if (ratio > 0.5) return '#2563eb'; // blue dark
//     if (ratio > 0.25) return '#60a5fa'; // blue medium
//     if (ratio > 0) return '#bfdbfe'; // blue light
//     return '#e5e7eb'; // gray
//   };

//   return (
//     <div className="p-6 rounded-2xl  shadow-lg bg-white dark:bg-gray-800">
//       <h4 className="font-semibold mb-4 text-gray-900 dark:text-white text-lg">Peak Hours</h4>
//       <div className="flex gap-1 overflow-x-auto py-2">
//         {Array.from({ length: 24 }).map((_, h) => (
//           <div key={h} className="flex flex-col items-center min-w-[24px]">
//             <div
//               className="w-6 rounded-md mb-1 transition-all duration-300 cursor-pointer"
//               style={{
//                 height: `${((peakHours[h] || 0) / max) * 80}px`,
//                 backgroundColor: getColor(peakHours[h] || 0)
//               }}
//               title={`Hour ${h}: ${peakHours[h] || 0} interactions`}
//             ></div>
//             <div className="text-[10px] text-gray-600 dark:text-gray-300">{h}</div>
//           </div>
//         ))}
//       </div>
//       <div className="text-xs mt-2 text-gray-500 dark:text-gray-400 flex gap-2">
//         <span className="inline-block w-3 h-3 bg-bfdbfe rounded-full"></span> Low
//         <span className="inline-block w-3 h-3 bg-60a5fa rounded-full"></span> Medium
//         <span className="inline-block w-3 h-3 bg-2563eb rounded-full"></span> High
//         <span className="inline-block w-3 h-3 bg-f87171 rounded-full"></span> Peak
//       </div>
//     </div>
//   );
// };

//   // ----- Loading Skeleton -----
//   if (loading) return (
//     <AnalyticsSkeleton/>
//   );

//   // ----- Main Render -----
//   return (
//     <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
//           <p className="text-sm opacity-70 text-gray-700 dark:text-gray-300">Overview of {userData?.username}&apos;s social performance</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow">
//             <FaCalendarAlt />
//             <select
//               className="outline-none bg-transparent text-sm text-lightMode-fg dark:text-darkMode-fg"
//               value={period}
//               onChange={(e) => setPeriod(e.target.value)}
//             >
//               <option value="7">Last 7 days</option>
//               <option value="30">Last 30 days</option>
//               <option value="90">Last 90 days</option>
//             </select>
//           </div>
//           <button
//             onClick={exportCSV}
//             className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500 transition-all duration-300 shadow"
//           >
//             <FaDownload /> Export CSV
//           </button>
//         </div>
//       </div>

//       {renderOverview()}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="lg:col-span-2">{renderLineChart()}</div>
//         <div>{renderEngagementChart()}</div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="lg:col-span-2">{renderTopPosts()}</div>
//         <div>{renderPeakHours()}</div>
//       </div>
//     </div>
//   );
// }


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

  // small Skeleton component inline
  const Skeleton = () => (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-gray-800/60 rounded-md animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-800/50 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-64 rounded-2xl bg-gray-800/50 animate-pulse" />
        <div className="h-64 rounded-2xl bg-gray-800/50 animate-pulse" />
        <div className="h-64 rounded-2xl bg-gray-800/50 animate-pulse" />
      </div>
    </div>
  )

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
      <Skeleton />
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
