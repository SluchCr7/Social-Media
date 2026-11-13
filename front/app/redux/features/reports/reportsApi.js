import { baseApi } from '../../api/baseApi';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReports: build.query({
      query: ({ page, limit, status, reportedOnType, severity }) => ({
        url: '/report',
        params: {
          page,
          limit,
          ...(status ? { status } : {}),
          ...(reportedOnType ? { reportedOnType } : {}),
          ...(severity ? { severity } : {}),
        },
      }),
      providesTags: (result) => [
        { type: 'Report', id: 'LIST' },
        ...(result?.reports || []).filter((report) => report?._id)
          .map((report) => ({ type: 'Report', id: report._id })),
      ],
    }),
    addReport: build.mutation({
      query: (body) => ({ url: '/report/add', method: 'POST', body }),
      invalidatesTags: [{ type: 'Report', id: 'LIST' }],
    }),
    updateReportStatus: build.mutation({
      query: ({ reportId, status, reviewNotes }) => ({
        url: `/report/status/${reportId}`,
        method: 'PATCH',
        body: { status, reviewNotes },
      }),
      invalidatesTags: (result, error, { reportId }) => [
        { type: 'Report', id: reportId },
        { type: 'Report', id: 'LIST' },
      ],
    }),
    deleteReport: build.mutation({
      query: (reportId) => ({ url: `/report/delete/${reportId}`, method: 'DELETE' }),
      invalidatesTags: (result, error, reportId) => [
        { type: 'Report', id: reportId },
        { type: 'Report', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useLazyGetReportsQuery,
  useAddReportMutation,
  useUpdateReportStatusMutation,
  useDeleteReportMutation,
} = reportsApi;
