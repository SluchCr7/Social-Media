'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useAlert } from "./AlertContext";

const ReportContext = createContext();

export const ReportContextProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMenuReport, setShowMenuReport] = useState(false);
  const [isPostId, setIsPostId] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalReports, setTotalReports] = useState(0);

  const { user } = useAuth();
  const { showAlert } = useAlert();

  // Fetch reports with pagination
  const getAllReports = async (page = currentPage, perPage = limit) => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/report`, {
        params: { page, limit: perPage }
      });

      // تحديث state بالـ reports وبيانات pagination
      setReports(res.data.reports);
      setTotalReports(res.data.total);
      setCurrentPage(res.data.page);
      setLimit(res.data.limit);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (postId, text) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/report/add`, { postId, text }, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      showAlert('Report added successfully');
      getAllReports(); // تحديث القائمة بعد الإضافة
    } catch (err) {
      console.error('Error adding report:', err);
      throw err;
    }
  };

  const deleteReport = async (reportId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/report/delete/${reportId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReports(prev => prev.filter(report => report._id !== reportId));
      setTotalReports(prev => prev - 1);
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
        showMenuReport,
        setShowMenuReport,
        isPostId,
        setIsPostId,
        currentPage,
        setCurrentPage,
        limit,
        totalReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => useContext(ReportContext);
