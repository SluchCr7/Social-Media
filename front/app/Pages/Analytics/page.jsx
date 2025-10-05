'use client'
import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaDownload, FaCalendarAlt, FaHeart, FaComment, FaUser } from "react-icons/fa";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";
import { useAuth } from "@/app/Context/AuthContext";
import { usePost } from "@/app/Context/PostContext";

const COLORS = ["#5558f1", "#7c3aed", "#06b6d4", "#fb7185", "#f59e0b"];

export default function AnalyticsDashboard() {
  const { user  , getUserById} = useAuth(); 
  const { posts , fetchUserPosts , userPosts } = usePost();

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    setFollowers(user?.followers || []);
    setFollowing(user?.following || []);
  }, [user]);

  const userPosts = useMemo(() => posts?.filter(p => p?.owner?._id === user?._id) || [], [posts, user]);
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

  // ----- Render Functions -----

  const renderOverview = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {overview.map((item) => (
        <motion.div
          key={item.key}
          whileHover={{ scale: 1.05 }}
          className="p-5 rounded-2xl shadow flex flex-col items-center justify-center transition-colors duration-300 bg-lightMode-menu dark:bg-darkMode-menu"
        >
          <div className="text-xl mb-1 text-lightMode-fg dark:text-darkMode-fg">{item.icon}</div>
          <div className="text-sm opacity-70 text-lightMode-fg dark:text-darkMode-fg">{item.key}</div>
          <div className="text-2xl font-bold text-lightMode-text dark:text-darkMode-text">{item.value}</div>
        </motion.div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="p-5 rounded-2xl shadow bg-lightMode-menu dark:bg-darkMode-menu">
      <h4 className="font-semibold mb-2 text-lightMode-text dark:text-darkMode-text">Activity Over Time</h4>
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeSeries}>
            <XAxis dataKey="date" className="text-lightMode-text2 dark:text-darkMode-text2" stroke="currentColor"/>
            <YAxis stroke="currentColor"/>
            <Tooltip />
            <Line type="monotone" dataKey="posts" stroke={COLORS[0]} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="likes" stroke={COLORS[1]} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="comments" stroke={COLORS[2]} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderEngagementChart = () => (
    <div className="p-5 rounded-2xl shadow bg-lightMode-menu dark:bg-darkMode-menu">
      <h4 className="font-semibold mb-2 text-lightMode-text dark:text-darkMode-text">Engagement Overview</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={engagement} dataKey="value" nameKey="name" outerRadius={80} label>
            {engagement.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderTopPosts = () => (
    <div className="p-5 rounded-2xl shadow bg-lightMode-menu dark:bg-darkMode-menu">
      <h4 className="font-semibold mb-3 text-lightMode-text dark:text-darkMode-text">Top Posts</h4>
      <div className="space-y-3">
        {topPosts.length ? topPosts.map(p => (
          <div key={p._id} className="flex justify-between p-3 rounded-xl transition-colors duration-300 hover:bg-sky-100 dark:hover:bg-gray-800">
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
      <div className="p-5 rounded-2xl shadow bg-lightMode-menu dark:bg-darkMode-menu">
        <h4 className="font-semibold mb-3 text-lightMode-text dark:text-darkMode-text">Peak Hours</h4>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 24 }).map((_, h) => (
            <div key={h} className="text-center">
              <div
                className="w-6 h-6 rounded-md mx-auto transition-colors duration-300"
                style={{ background: `rgba(59,130,246,${(peakHours[h] || 0)/max})` }}
                title={`Hour ${h}: ${peakHours[h] || 0} interactions`}
              ></div>
              <div className="text-[10px] mt-1">{h}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-6 space-y-6 bg-lightMode-bg dark:bg-darkMode-bg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-lightMode-fg dark:text-darkMode-fg">Analytics Dashboard</h1>
          <p className="text-sm opacity-70 text-lightMode-text2 dark:text-darkMode-text2">Overview of your social performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-lightMode-menu dark:bg-darkMode-menu">
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
            className="px-3 py-2 bg-sky-600 text-white rounded-lg flex items-center gap-2 hover:bg-sky-500 transition-colors duration-300"
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
