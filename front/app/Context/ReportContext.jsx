// 'use client';
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import { useAlert } from "./AlertContext";

// const ReportContext = createContext();

// export const ReportContextProvider = ({ children }) => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showMenuReport, setShowMenuReport] = useState(false);
//   const [isPostId, setIsPostId] = useState(null);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [totalReports, setTotalReports] = useState(0);

//   const { user } = useAuth();
//   const { showAlert } = useAlert();

//   // 📌 Fetch reports with pagination
//   const getAllReports = async (page = currentPage, perPage = limit) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/report`, {
//         params: { page, limit: perPage },
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       setReports(res.data.reports);
//       setTotalReports(res.data.total);
//       setCurrentPage(res.data.page);
//       setLimit(res.data.limit);
//     } catch (err) {
//       console.error('Error fetching reports:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📌 Add new report
//   const addReport = async (postId, text, reason = "other") => {
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/report/add`,
//         { postId, text, reason },
//         { headers: { Authorization: `Bearer ${user?.token}` } }
//       );

//       showAlert('Report added successfully');
//       // ✅ مش لازم نجيب كل التقارير من جديد، نسيبها للأدمن
//     } catch (err) {
//       console.error('Error adding report:', err);
//       showAlert(err?.response?.data?.message || "Failed to add report");
//       throw err;
//     }
//   };

//   // 📌 Delete report
//   const deleteReport = async (reportId) => {
//     try {
//       await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/report/delete/${reportId}`, {
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       setReports(prev => prev.filter(report => report._id !== reportId));
//       setTotalReports(prev => prev - 1);
//       showAlert("Report deleted successfully");
//     } catch (err) {
//       console.error('Error deleting report:', err);
//       showAlert(err?.response?.data?.message || "Failed to delete report");
//     }
//   };

//   // 📌 Update report status (Admin action)
//   const updateReportStatus = async (reportId, status) => {
//     try {
//       const res = await axios.patch(
//         `${process.env.NEXT_PUBLIC_BACK_URL}/api/report/status/${reportId}`,
//         { status },
//         { headers: { Authorization: `Bearer ${user?.token}` } }
//       );

//       setReports(prev =>
//         prev.map(r => (r._id === reportId ? { ...r, status: res.data.report.status } : r))
//       );

//       showAlert("Report status updated");
//     } catch (err) {
//       console.error('Error updating report status:', err);
//       showAlert(err?.response?.data?.message || "Failed to update report status");
//     }
//   };

//   useEffect(() => {
//     if (user?.token) getAllReports();
//   }, [user?.token]);

//   return (
//     <ReportContext.Provider
//       value={{
//         reports,
//         loading,
//         getAllReports,
//         addReport,
//         deleteReport,
//         updateReportStatus,
//         showMenuReport,
//         setShowMenuReport,
//         isPostId,
//         setIsPostId,
//         currentPage,
//         setCurrentPage,
//         limit,
//         totalReports,
//       }}
//     >
//       {children}
//     </ReportContext.Provider>
//   );
// };

// export const useReport = () => useContext(ReportContext);

'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useAlert } from "./AlertContext";

const ReportContext = createContext();

export const ReportContextProvider = ({ children }) => {
  // ========= State =========
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // Loading لكل عملية
  const [showMenuReport, setShowMenuReport] = useState(false);
  const [isTargetId, setIsTargetId] = useState(null);
  const [reportedOnType, setReportedOnType] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalReports, setTotalReports] = useState(0);

  // Filters
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState(null);

  const { user } = useAuth();
  const { showAlert } = useAlert();

  // ========= Fetch Reports (Admin) =========
  const getAllReports = async ({ page = currentPage, perPage = limit } = {}) => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const params = { page, limit: perPage };
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.reportedOnType = filterType;
      if (filterSeverity) params.severity = filterSeverity;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/report`, {
        params,
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setReports(res.data.reports);
      setTotalReports(res.data.total);
      setCurrentPage(res.data.page);
      setLimit(res.data.limit);
    } catch (err) {
      console.error('Error fetching reports:', err);
      showAlert("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  // ========= Add New Report =========
  const addReport = async ({ reportedOnType, targetId, text, reason = "other" }) => {
    if (!user?.token) return;

    const payload = { text, reason, reportedOnType };
    if (reportedOnType === "post") payload.postId = targetId;
    else if (reportedOnType === "comment") payload.commentId = targetId;
    else if (reportedOnType === "user") payload.reportedUserId = targetId;

    try {
      setActionLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/report/add`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      showAlert('Report added successfully');
    } catch (err) {
      console.error('Error adding report:', err);
      showAlert(err?.response?.data?.message || "Failed to add report");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // ========= Update Report Status =========
  const updateReportStatus = async (reportId, status, reviewNotes = "") => {
    if (!user?.token) return;

    try {
      setActionLoading(true);
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/report/status/${reportId}`,
        { status, reviewNotes },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setReports(prev =>
        prev.map(r => (r._id === reportId ? { ...r, ...res.data.report } : r))
      );

      showAlert("Report updated successfully");
    } catch (err) {
      console.error('Error updating report status:', err);
      showAlert(err?.response?.data?.message || "Failed to update report");
    } finally {
      setActionLoading(false);
    }
  };

  // ========= Delete Report =========
  const deleteReport = async (reportId) => {
    if (!user?.token) return;

    try {
      setActionLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/report/${reportId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setReports(prev => prev.filter(r => r._id !== reportId));
      setTotalReports(prev => prev - 1);
      showAlert("Report deleted successfully");
    } catch (err) {
      console.error('Error deleting report:', err);
      showAlert(err?.response?.data?.message || "Failed to delete report");
    } finally {
      setActionLoading(false);
    }
  };

  // ========= Effects =========
  useEffect(() => {
    if (user?.token) getAllReports();
  }, [user?.token, filterStatus, filterType, filterSeverity]);

  // ========= Provider =========
  return (
    <ReportContext.Provider
      value={{
        reports,
        loading,
        actionLoading,
        getAllReports,
        addReport,
        updateReportStatus,
        deleteReport,
        showMenuReport,
        setShowMenuReport,
        isTargetId,
        setIsTargetId,
        currentPage,
        setCurrentPage,
        limit,
        totalReports,
        filterStatus,
        setFilterStatus,
        filterType,
        setFilterType,
        filterSeverity,
        setFilterSeverity,
        reportedOnType, setReportedOnType
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => useContext(ReportContext);
