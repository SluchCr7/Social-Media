'use client';
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext"; // لو عندك AuthContext موجود

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
    const { user } = useAuth(); // لو الأدمن داخل بحساب
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = user?.token;
  const getAdminStats = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      getAdminStats();
    }
  }, [user]);

  return (
    <AdminContext.Provider value={{ stats, loading, getAdminStats }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminUser = () => useContext(AdminContext);
