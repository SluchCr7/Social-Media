import { baseApi } from '../../api/baseApi';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (params = {}) => ({
        url: '/report',
        params,
      }),
      providesTags: ['Report'],
    }),
    createReport: builder.mutation({
      query: (payload) => ({
        url: '/report/add',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Report'],
    }),
    updateReportStatus: builder.mutation({
      query: ({ reportId, status, reviewNotes = '' }) => ({
        url: `/report/status/${reportId}`,
        method: 'PATCH',
        body: { status, reviewNotes },
      }),
      invalidatesTags: ['Report'],
    }),
    deleteReport: builder.mutation({
      query: (reportId) => ({
        url: `/report/delete/${reportId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Report'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useLazyGetReportsQuery,
  useCreateReportMutation,
  useUpdateReportStatusMutation,
  useDeleteReportMutation,
} = reportsApi;
