'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // تأكد من وجود AuthContext فيه التوكن

const ReportContext = createContext();

export const ReportContextProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMenuReport, setShowMenuReport] = useState(false);
    const [isPostId , setIsPostId] = useState(null)
    const {user} = useAuth()
  const getAllReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/report');
      setReports(res.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (postId, text) => {
    try {
      const res = await axios.post('/api/report/add', { postId, text }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setReports((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error('Error adding report:', err);
      throw err;
    }
  };

  const deleteReport = async (reportId) => {
    try {
      await axios.delete(`/api/report/add/${reportId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setReports((prev) => prev.filter((report) => report._id !== reportId));
    } catch (err) {
      console.error('Error deleting report:', err);
    }
  };

  useEffect(() => {
    getAllReports();
  }, []);

  return (
    <ReportContext.Provider
      value={{
        reports,
        loading,
        getAllReports,
        addReport,
        deleteReport,
        showMenuReport, setShowMenuReport,
        isPostId , setIsPostId
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => useContext(ReportContext);
