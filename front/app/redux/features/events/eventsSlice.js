import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { getEventDay, getEventOccurrencesInRange } from '@/app/utils/eventDate';

const initialState = {
  events: [],
  upcomingEvents: [],
  loading: false,
  isCreating: false,
  isMutating: false,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = Array.isArray(action.payload) ? action.payload : [];
    },
    addEventToState: (state, action) => {
      const newEvent = action.payload;
      if (!newEvent?._id) return;

      const index = state.events.findIndex((event) => event?._id === newEvent._id);
      if (index === -1) {
        state.events.push(newEvent);
      } else {
        state.events[index] = newEvent;
      }
    },
    updateEventInState: (state, action) => {
      const updatedEvent = action.payload;
      const index = state.events.findIndex((event) => event?._id === updatedEvent?._id);
      if (index !== -1) state.events[index] = updatedEvent;
    },
    removeEventFromState: (state, action) => {
      const eventId = action.payload?.toString();
      state.events = state.events.filter((event) => event?._id?.toString() !== eventId);
      state.upcomingEvents = state.upcomingEvents.filter((event) => event?._id?.toString() !== eventId);
    },
    setUpcomingEvents: (state, action) => {
      state.upcomingEvents = Array.isArray(action.payload) ? action.payload : [];
    },
    setLoading: (state, action) => {
      state.loading = Boolean(action.payload);
    },
    setIsCreating: (state, action) => {
      state.isCreating = Boolean(action.payload);
    },
    setIsMutating: (state, action) => {
      state.isMutating = Boolean(action.payload);
    },
    checkUpcomingEventsAction: (state) => {
      const now = dayjs();
      const today = now.startOf('day');
      const end = today.add(7, 'day');
      state.upcomingEvents = state.events
        .flatMap((event) => getEventOccurrencesInRange(event, today, end))
        .filter((event) => {
          const eventDate = getEventDay(event.date);
          const [hours, minutes] = (event.startTime || '00:00').split(':').map(Number);
          const eventDateTime = eventDate.hour(hours).minute(minutes);
          return eventDateTime.isAfter(now);
        })
        .sort((a, b) => getEventDay(a.date).valueOf() - getEventDay(b.date).valueOf());
    },
  },
});

export const {
  setEvents,
  addEventToState,
  updateEventInState,
  removeEventFromState,
  setUpcomingEvents,
  setLoading,
  setIsCreating,
  setIsMutating,
  checkUpcomingEventsAction,
} = eventsSlice.actions;

export default eventsSlice.reducer;
