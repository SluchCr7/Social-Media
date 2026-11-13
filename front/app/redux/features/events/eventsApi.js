import { baseApi } from '../../api/baseApi';

const eventListTags = (result) => [
  { type: 'Event', id: 'LIST' },
  ...(Array.isArray(result) ? result.filter((event) => event?._id)
    .map((event) => ({ type: 'Event', id: event._id })) : []),
];

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEventsByUser: build.query({
      query: ({ userId }) => `/events/user/${userId}`,
      transformResponse: (response) => {
        if (!response?.success || !Array.isArray(response.events)) {
          throw new Error(response?.message || 'Unable to load events.');
        }
        return response.events;
      },
      providesTags: eventListTags,
    }),
    getUpcomingEvents: build.query({
      query: () => '/events/upcoming',
      transformResponse: (response) => {
        if (!response?.success || !Array.isArray(response.events)) {
          throw new Error(response?.message || 'Unable to load upcoming events.');
        }
        return response.events;
      },
      providesTags: eventListTags,
    }),
    createEvent: build.mutation({
      query: (event) => ({
        url: '/events',
        method: 'POST',
        body: { ...event, repeatYearly: event.repeatYearly || false },
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
    updateEvent: build.mutation({
      query: ({ id, changes }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: changes,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Event', id },
        { type: 'Event', id: 'LIST' },
      ],
    }),
    deleteEvent: build.mutation({
      query: (id) => ({ url: `/events/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Event', id },
        { type: 'Event', id: 'LIST' },
      ],
    }),
    respondToEvent: build.mutation({
      query: ({ id, status }) => ({
        url: `/events/${id}/rsvp`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Event', id },
        { type: 'Event', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetEventsByUserQuery,
  useGetUpcomingEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useRespondToEventMutation,
} = eventsApi;
