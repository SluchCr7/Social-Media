'use client'
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaDownload, FaCalendarAlt, FaHeart, FaComment, FaUser } from "react-icons/fa";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";
import { useAuth } from "@/app/Context/AuthContext";
import { usePost } from "@/app/Context/PostContext";

// ----- COLORS & THEME -----
const COLORS = ["#3b82f6", "#2563eb", "#14b8a6", "#facc15", "#f97316"];

export default function AnalyticsDashboard() {
  const { user, getUserById } = useAuth();
  const { fetchUserPosts, userPosts } = usePost();

  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [period, setPeriod] = useState("30");
  const [loading, setLoading] = useState(false);

  // ----- Fetch user data -----
  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    getUserById(user._id)
      .then(res => {
        setUserData(res);
        setFollowers(res?.followers || []);
        setFollowing(res?.following || []);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [user?._id]);

  // ----- Fetch user's posts -----
  useEffect(() => {
    
    if (!userData?._id) return;
    fetchUserPosts(userData._id, 1, 100, true); // جلب 100 بوست
  }, [userData?._id]);

  // ----- Derived data -----
  const totalLikes = useMemo(() => userPosts.reduce((sum, p) => sum + (p?.likes?.length || 0), 0), [userPosts]);
  const totalComments = useMemo(() => userPosts.reduce((sum, p) => sum + (p?.comments?.length || 0), 0), [userPosts]);

  const overview = [
    { key: "Posts", value: userPosts.length, icon: <FaUser /> },
    { key: "Followers", value: followers.length, icon: <FaUser /> },
    { key: "Following", value: following.length, icon: <FaUser /> },
    { key: "Likes", value: totalLikes, icon: <FaHeart /> },
    { key: "Comments", value: totalComments, icon: <FaComment /> },
  ];

  const timeSeries = useMemo(() => {
    const data = [];
    const now = new Date();
    const days = period === "7" ? 7 : period === "30" ? 30 : 90;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const postsOnDay = userPosts.filter(p => new Date(p.createdAt).toISOString().split("T")[0] === dateStr);
      const likes = postsOnDay.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
      const comments = postsOnDay.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
      data.push({ date: dateStr.slice(5), posts: postsOnDay.length, likes, comments });
    }
    return data;
  }, [userPosts, period]);

  const topPosts = useMemo(() => {
    return [...userPosts]
      .sort((a, b) => ((b.likes?.length || 0) + (b.comments?.length || 0)*2) - ((a.likes?.length || 0) + (a.comments?.length || 0)*2))
      .slice(0, 3);
  }, [userPosts]);

  const peakHours = useMemo(() => {
    const hours = {};
    userPosts.forEach(p => {
      const h = new Date(p.createdAt).getHours();
      hours[h] = (hours[h] || 0) + (p.likes?.length || 1);
    });
    return hours;
  }, [userPosts]);

  const engagement = [
    { name: "Likes", value: totalLikes },
    { name: "Comments", value: totalComments },
    { name: "Followers", value: followers.length },
  ];

  // ----- Export CSV -----
  const exportCSV = () => {
    const rows = [["Metric", "Value"]];
    overview.forEach(o => rows.push([o.key, o.value]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${userData?.username || "user"}.csv`;
    a.click();
  };

  // ----- Render Functions -----
  const renderOverview = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {overview.map(item => (
        <motion.div
          key={item.key}
          whileHover={{ scale: 1.05 }}
          className="p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700"
        >
          <div className="text-2xl mb-2 text-blue-600 dark:text-blue-400">{item.icon}</div>
          <div className="text-sm opacity-70 text-gray-700 dark:text-gray-300">{item.key}</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{item.value}</div>
        </motion.div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Activity Over Time</h4>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeSeries}>
            <XAxis dataKey="date" stroke="currentColor"/>
            <YAxis stroke="currentColor"/>
            <Tooltip formatter={(value, name) => [value, name]} />
            <Line type="monotone" dataKey="posts" stroke={COLORS[0]} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="likes" stroke={COLORS[1]} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="comments" stroke={COLORS[2]} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderEngagementChart = () => (
    <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Engagement Overview</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={engagement} dataKey="value" nameKey="name" outerRadius={80} startAngle={180} endAngle={0} label>
            {engagement.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderTopPosts = () => (
    <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Top Posts</h4>
      <div className="space-y-3">
        {topPosts.length ? topPosts.map(p => (
          <div key={p._id} className="flex justify-between p-3 rounded-xl transition-all duration-300 hover:bg-blue-50 dark:hover:bg-gray-700">
            <p className="truncate" title={p.text}>{p.text}</p>
            <span className="text-sm opacity-70">{(p.likes?.length || 0) + (p.comments?.length || 0)*2} ❤️</span>
          </div>
        )) : <div className="text-sm opacity-70">No posts yet</div>}
      </div>
    </div>
  );

  const renderPeakHours = () => {
    const max = Math.max(...Object.values(peakHours || {}), 1);
    return (
      <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Peak Hours</h4>
        <div className="flex gap-1 overflow-x-auto">
          {Array.from({ length: 24 }).map((_, h) => (
            <div key={h} className="text-center flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-md mb-1 transition-colors duration-300"
                style={{ background: `rgba(59,130,246,${(peakHours[h] || 0)/max})` }}
                title={`Hour ${h}: ${peakHours[h] || 0} interactions`}
              ></div>
              <div className="text-[10px]">{h}</div>
            </div>
          ))}
        </div>
        <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">Color intensity represents total interactions</div>
      </div>
    );
  };

  // ----- Loading Skeleton -----
  if (loading) return (
    <div className="w-full p-6 space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      ))}
    </div>
  );

  // ----- Main Render -----
  return (
    <div className="w-full p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-sm opacity-70 text-gray-700 dark:text-gray-300">Overview of {userData?.username}'s social performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow">
            <FaCalendarAlt />
            <select
              className="outline-none bg-transparent text-sm text-lightMode-fg dark:text-darkMode-fg"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500 transition-all duration-300 shadow"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {renderOverview()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">{renderLineChart()}</div>
        <div>{renderEngagementChart()}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">{renderTopPosts()}</div>
        <div>{renderPeakHours()}</div>
      </div>
    </div>
  );
}
