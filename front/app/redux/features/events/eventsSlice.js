import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const processEventDate = (event) => {
  if (event?.repeatYearly) {
    const originalDate = dayjs(event.date);
    const currentYearDate = originalDate.year(dayjs().year());
    return { ...event, date: currentYearDate.toDate() };
  }
  return event;
};

const initialState = {
  events: [],
  upcomingEvents: [],
  loading: false,
  isCreating: false,
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      const raw = Array.isArray(action.payload) ? action.payload : [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setIsCreating: (state, action) => {
      state.isCreating = action.payload;
    },
    checkUpcomingEventsAction: (state) => {
      const today = dayjs();
      const upcoming = [];
      state.events.forEach((event) => {
        const eventDate = dayjs(event.date);
        const diff = eventDate.diff(today, 'day');
        if (diff === 1) {
          upcoming.push(event);
        }
      });
      state.upcomingEvents = upcoming;
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
  checkUpcomingEventsAction,
} = eventsSlice.actions;

export default eventsSlice.reducer;
