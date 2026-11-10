'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectReports,
  selectReportsLoading,
  selectActionLoading,
  selectShowMenuReport,
  selectIsTargetId,
  selectReportedOnType,
  selectCurrentReportPage,
  selectReportLimit,
  selectTotalReports,
  selectFilterStatus,
  selectFilterType,
  selectFilterSeverity,
} from '../features/reports/reportsSelectors';
import {
  setReports as setReduxReports,
  setLoading as setReduxLoading,
  setActionLoading as setReduxActionLoading,
  setShowMenuReport as setReduxShowMenuReport,
  setIsTargetId as setReduxIsTargetId,
  setReportedOnType as setReduxReportedOnType,
  setCurrentPage as setReduxCurrentPage,
  setLimit as setReduxLimit,
  setTotalReports as setReduxTotalReports,
  setFilterStatus as setReduxFilterStatus,
  setFilterType as setReduxFilterType,
  setFilterSeverity as setReduxFilterSeverity,
  updateReportInState,
  removeReportFromState,
} from '../features/reports/reportsSlice';



export const useReport = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showAlert } = useFeedback();

  const reports = useAppSelector(selectReports);
  const loading = useAppSelector(selectReportsLoading);
  const actionLoading = useAppSelector(selectActionLoading);
  const showMenuReport = useAppSelector(selectShowMenuReport);
  const isTargetId = useAppSelector(selectIsTargetId);
  const reportedOnType = useAppSelector(selectReportedOnType);
  const currentPage = useAppSelector(selectCurrentReportPage);
  const limit = useAppSelector(selectReportLimit);
  const totalReports = useAppSelector(selectTotalReports);
  const filterStatus = useAppSelector(selectFilterStatus);
  const filterType = useAppSelector(selectFilterType);
  const filterSeverity = useAppSelector(selectFilterSeverity);

  const setShowMenuReport = useCallback((val) => dispatch(setReduxShowMenuReport(val)), [dispatch]);
  const setIsTargetId = useCallback((val) => dispatch(setReduxIsTargetId(val)), [dispatch]);
  const setReportedOnType = useCallback((val) => dispatch(setReduxReportedOnType(val)), [dispatch]);
  const setCurrentPage = useCallback((val) => dispatch(setReduxCurrentPage(val)), [dispatch]);
  const setLimit = useCallback((val) => dispatch(setReduxLimit(val)), [dispatch]);
  const setFilterStatus = useCallback((val) => dispatch(setReduxFilterStatus(val)), [dispatch]);
  const setFilterType = useCallback((val) => dispatch(setReduxFilterType(val)), [dispatch]);
  const setFilterSeverity = useCallback((val) => dispatch(setReduxFilterSeverity(val)), [dispatch]);

  const getAllReports = useCallback(
    async ({ page = currentPage, perPage = limit } = {}) => {
      if (!user?.token) return;
      dispatch(setReduxLoading(true));
      try {
        const params = { page, limit: perPage };
        if (filterStatus) params.status = filterStatus;
        if (filterType) params.reportedOnType = filterType;
        if (filterSeverity) params.severity = filterSeverity;

        const res = await api.get('/report', {
          params,
          headers: { Authorization: `Bearer ${user.token}` },
        });

        dispatch(setReduxReports(res.data.reports || []));
        dispatch(setReduxTotalReports(res.data.total || 0));
        dispatch(setReduxCurrentPage(res.data.page || 1));
        dispatch(setReduxLimit(res.data.limit || 20));
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        dispatch(setReduxLoading(false));
      }
    },
    [user?.token, currentPage, limit, filterStatus, filterType, filterSeverity, dispatch]
  );

  const addReport = useCallback(
    async ({ reportedOnType, targetId, text, reason = 'other' }) => {
      if (!user?.token) return;

      const payload = { text, reason, reportedOnType };
      if (reportedOnType === 'post') payload.postId = targetId;
      else if (reportedOnType === 'comment') payload.commentId = targetId;
      else if (reportedOnType === 'user') payload.reportedUserId = targetId;

      try {
        dispatch(setReduxActionLoading(true));
        await api.post('/report/add', payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        showAlert('Report added successfully');
      } catch (err) {
        console.error('Error adding report:', err);
        showAlert(err?.response?.data?.message || 'Failed to add report');
        throw err;
      } finally {
        dispatch(setReduxActionLoading(false));
      }
    },
    [user?.token, showAlert, dispatch]
  );

  const updateReportStatus = useCallback(
    async (reportId, status, reviewNotes = '') => {
      if (!user?.token) return;

      try {
        dispatch(setReduxActionLoading(true));
        const res = await api.patch(
          `/report/status/${reportId}`,
          { status, reviewNotes },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        dispatch(updateReportInState({ _id: reportId, ...res.data.report }));
        showAlert('Report updated successfully');
      } catch (err) {
        console.error('Error updating report status:', err);
        showAlert(err?.response?.data?.message || 'Failed to update report');
      } finally {
        dispatch(setReduxActionLoading(false));
      }
    },
    [user?.token, showAlert, dispatch]
  );

  const deleteReport = useCallback(
    async (reportId) => {
      if (!user?.token) return;

      try {
        dispatch(setReduxActionLoading(true));
        await api.delete(`/report/delete/${reportId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        dispatch(removeReportFromState(reportId));
        showAlert('Report deleted successfully');
      } catch (err) {
        console.error('Error deleting report:', err);
        showAlert(err?.response?.data?.message || 'Failed to delete report');
      } finally {
        dispatch(setReduxActionLoading(false));
      }
    },
    [user?.token, showAlert, dispatch]
  );

  useEffect(() => {
    if (user?.token) getAllReports();
  }, [user?.token, filterStatus, filterType, filterSeverity, getAllReports]);

  return useMemo(
    () => ({
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
      reportedOnType,
      setReportedOnType,
    }),
    [
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
      reportedOnType,
      setReportedOnType,
    ]
  );
};

export default useReport;
