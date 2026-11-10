import { baseApi } from '../../api/baseApi';

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserEvents: builder.query({
      query: (userId) => `/events/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Event', id: `USER_${userId}` }],
    }),
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: '/events',
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: ['Event'],
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...eventData }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: eventData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Event', id }],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Event', id }],
    }),
  }),
});

export const {
  useGetUserEventsQuery,
  useLazyGetUserEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;
