'use client';

import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectCurrentReportPage,
  selectFilterSeverity,
  selectFilterStatus,
  selectFilterType,
  selectIsTargetId,
  selectReportedOnType,
  selectReportLimit,
  selectShowMenuReport,
} from '../features/reports/reportsSelectors';
import {
  setCurrentPage as setReduxCurrentPage,
  setFilterSeverity as setReduxFilterSeverity,
  setFilterStatus as setReduxFilterStatus,
  setFilterType as setReduxFilterType,
  setIsTargetId as setReduxIsTargetId,
  setLimit as setReduxLimit,
  setReportedOnType as setReduxReportedOnType,
  setShowMenuReport as setReduxShowMenuReport,
} from '../features/reports/reportsSlice';
import {
  useAddReportMutation,
  useDeleteReportMutation,
  useGetReportsQuery,
  useLazyGetReportsQuery,
  useUpdateReportStatusMutation,
} from '../features/reports/reportsApi';

const errorMessage = (error, fallback) => error?.data?.message || error?.message || fallback;

export const useReport = ({ loadReports = false } = {}) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showAlert } = useFeedback();
  const showMenuReport = useAppSelector(selectShowMenuReport);
  const isTargetId = useAppSelector(selectIsTargetId);
  const reportedOnType = useAppSelector(selectReportedOnType);
  const currentPage = useAppSelector(selectCurrentReportPage);
  const limit = useAppSelector(selectReportLimit);
  const filterStatus = useAppSelector(selectFilterStatus);
  const filterType = useAppSelector(selectFilterType);
  const filterSeverity = useAppSelector(selectFilterSeverity);

  const queryArgs = {
    page: currentPage,
    limit,
    status: filterStatus,
    reportedOnType: filterType,
    severity: filterSeverity,
  };
  const reportsQuery = useGetReportsQuery(queryArgs, {
    skip: !loadReports || !user?._id,
  });
  const [loadReportPage] = useLazyGetReportsQuery();
  const [addReportRequest, addState] = useAddReportMutation();
  const [updateStatusRequest, updateState] = useUpdateReportStatusMutation();
  const [deleteReportRequest, deleteState] = useDeleteReportMutation();

  const setShowMenuReport = useCallback((value) => dispatch(setReduxShowMenuReport(value)), [dispatch]);
  const setIsTargetId = useCallback((value) => dispatch(setReduxIsTargetId(value)), [dispatch]);
  const setReportedOnType = useCallback((value) => dispatch(setReduxReportedOnType(value)), [dispatch]);
  const setCurrentPage = useCallback((value) => dispatch(setReduxCurrentPage(value)), [dispatch]);
  const setLimit = useCallback((value) => dispatch(setReduxLimit(value)), [dispatch]);
  const setFilterStatus = useCallback((value) => dispatch(setReduxFilterStatus(value)), [dispatch]);
  const setFilterType = useCallback((value) => dispatch(setReduxFilterType(value)), [dispatch]);
  const setFilterSeverity = useCallback((value) => dispatch(setReduxFilterSeverity(value)), [dispatch]);

  const getAllReports = useCallback(async ({ page = currentPage, perPage = limit } = {}) => {
    if (!user?._id) return;
    return loadReportPage({
      page,
      limit: perPage,
      status: filterStatus,
      reportedOnType: filterType,
      severity: filterSeverity,
    }).unwrap();
  }, [currentPage, filterSeverity, filterStatus, filterType, limit, loadReportPage, user?._id]);

  const addReport = useCallback(async ({ reportedOnType: reportType, targetId, text, reason = 'other' }) => {
    if (!user?._id) return;
    const payload = { text, reason, reportedOnType: reportType };
    if (reportType === 'post') payload.postId = targetId;
    else if (reportType === 'comment') payload.commentId = targetId;
    else if (reportType === 'user') payload.reportedUserId = targetId;
    try {
      await addReportRequest(payload).unwrap();
      showAlert('Report added successfully');
    } catch (error) {
      console.error('Error adding report:', error);
      showAlert(errorMessage(error, 'Failed to add report'));
      throw error;
    }
  }, [addReportRequest, showAlert, user?._id]);

  const updateReportStatus = useCallback(async (reportId, status, reviewNotes = '') => {
    if (!user?._id) return;
    try {
      await updateStatusRequest({ reportId, status, reviewNotes }).unwrap();
      showAlert('Report updated successfully');
    } catch (error) {
      console.error('Error updating report status:', error);
      showAlert(errorMessage(error, 'Failed to update report'));
    }
  }, [showAlert, updateStatusRequest, user?._id]);

  const deleteReport = useCallback(async (reportId) => {
    if (!user?._id) return;
    try {
      await deleteReportRequest(reportId).unwrap();
      showAlert('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      showAlert(errorMessage(error, 'Failed to delete report'));
    }
  }, [deleteReportRequest, showAlert, user?._id]);

  return useMemo(() => ({
    reports: reportsQuery.currentData?.reports || [],
    loading: reportsQuery.isLoading || reportsQuery.isFetching,
    actionLoading: addState.isLoading || updateState.isLoading || deleteState.isLoading,
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
    totalReports: reportsQuery.currentData?.total || 0,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    filterSeverity,
    setFilterSeverity,
    reportedOnType,
    setReportedOnType,
  }), [
    reportsQuery.currentData,
    reportsQuery.isLoading,
    reportsQuery.isFetching,
    addState.isLoading,
    updateState.isLoading,
    deleteState.isLoading,
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
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    filterSeverity,
    setFilterSeverity,
    reportedOnType,
    setReportedOnType,
  ]);
};

export default useReport;
