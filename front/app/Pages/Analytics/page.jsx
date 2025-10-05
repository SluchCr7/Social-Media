'use client'
import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaDownload, FaCalendarAlt } from "react-icons/fa";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";
import { useAuth } from "@/app/Context/AuthContext";
import { usePost } from "@/app/Context/PostContext";

const COLORS = ["#0ea5e9", "#7c3aed", "#06b6d4", "#fb7185", "#f59e0b"];

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const { posts } = usePost();

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [period, setPeriod] = useState("30");

  // 👇 مثال: يمكنك جلبهم من context أو API آخر خاص بك
  useEffect(() => {
    setFollowers(user?.followers || []);
    setFollowing(user?.following || []);
  }, [user]);

  // 📊 البيانات الأساسية
  const userPosts = useMemo(() => posts?.filter(p => p.author?._id === user?._id) || [], [posts, user]);
  const totalLikes = useMemo(() => userPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0), [userPosts]);
  const totalComments = useMemo(() => userPosts.reduce((sum, p) => sum + (p.comments?.length || 0), 0), [userPosts]);

  // 🧠 نظرة عامة
  const overview = [
    { key: "Posts", value: userPosts.length },
    { key: "Followers", value: followers.length },
    { key: "Following", value: following.length },
    { key: "Likes", value: totalLikes },
    { key: "Comments", value: totalComments },
  ];

  // 📈 تحليل زمني بسيط (تقديري)
  const timeSeries = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const postsOnDay = userPosts.filter(p => new Date(p.createdAt).toISOString().split("T")[0] === dateStr);
      const likes = postsOnDay.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
      const comments = postsOnDay.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
      data.push({ date: dateStr.slice(5), posts: postsOnDay.length, likes, comments });
    }
    return data;
  }, [userPosts]);

  // 🧩 Top Posts
  const topPosts = useMemo(() => {
    return [...userPosts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 3);
  }, [userPosts]);

  // 🧠 Peak Hours
  const peakHours = useMemo(() => {
    const hours = {};
    userPosts.forEach(p => {
      const h = new Date(p.createdAt).getHours();
      hours[h] = (hours[h] || 0) + (p.likes?.length || 1);
    });
    return hours;
  }, [userPosts]);

  // 📊 Engagement Chart
  const engagement = [
    { name: "Likes", value: totalLikes },
    { name: "Comments", value: totalComments },
    { name: "Followers", value: followers.length },
  ];

  // 🎯 Audience Example (mock from followers)
  const audience = followers.slice(0, 5).map(f => ({
    country: f.country || "Unknown",
    count: 1,
    percent: 100 / followers.length
  }));

  // ⬇️ تصدير CSV
  const exportCSV = () => {
    const rows = [["Metric", "Value"]];
    overview.forEach(o => rows.push([o.key, o.value]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${user?.username || "user"}.csv`;
    a.click();
  };

  // 🧱 Rendering Components
  const renderOverview = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {overview.map((item, i) => (
        <motion.div
          key={item.key}
          whileHover={{ scale: 1.03 }}
          className="bg-lightMode-menu dark:bg-darkMode-menu p-4 rounded-2xl shadow flex flex-col items-center justify-center"
        >
          <div className="text-sm opacity-70">{item.key}</div>
          <div className="text-xl font-semibold">{item.value}</div>
        </motion.div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="bg-lightMode-menu dark:bg-darkMode-menu p-4 rounded-2xl shadow">
      <h4 className="font-semibold mb-2">Activity This Week</h4>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeSeries}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="posts" stroke={COLORS[0]} />
            <Line dataKey="likes" stroke={COLORS[1]} />
            <Line dataKey="comments" stroke={COLORS[2]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderEngagementChart = () => (
    <div className="bg-lightMode-menu dark:bg-darkMode-menu p-4 rounded-2xl shadow">
      <h4 className="font-semibold mb-2">Engagement Overview</h4>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={engagement} dataKey="value" nameKey="name" outerRadius={70} label>
            {engagement.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderTopPosts = () => (
    <div className="bg-lightMode-menu dark:bg-darkMode-menu p-4 rounded-2xl shadow">
      <h4 className="font-semibold mb-3">Top Posts</h4>
      <div className="space-y-3">
        {topPosts.length ? topPosts.map(p => (
          <div key={p._id} className="flex justify-between p-3 bg-lightMode-base dark:bg-darkMode-base rounded-xl">
            <p className="truncate">{p.text}</p>
            <span className="text-sm opacity-70">{p.likes.length} ❤️</span>
          </div>
        )) : <div className="text-sm opacity-70">No posts yet</div>}
      </div>
    </div>
  );

  const renderPeakHours = () => {
    const max = Math.max(...Object.values(peakHours || {}), 1);
    return (
      <div className="bg-lightMode-menu dark:bg-darkMode-menu p-4 rounded-2xl shadow">
        <h4 className="font-semibold mb-3">Peak Hours</h4>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 24 }).map((_, h) => (
            <div key={h} className="text-center">
              <div className="w-6 h-6 rounded-md mx-auto" style={{ background: `rgba(59,130,246,${(peakHours[h] || 0) / max})` }}></div>
              <div className="text-[10px] mt-1">{h}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-sm opacity-70">Overview of your social performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-lightMode-menu dark:bg-darkMode-menu p-2 rounded-lg">
            <FaCalendarAlt />
            <select
              className="outline-none bg-transparent text-sm"
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
            className="px-3 py-2 bg-sky-600 text-white rounded-lg flex items-center gap-2"
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
