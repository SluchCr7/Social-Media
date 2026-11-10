import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { baseApi } from './api/baseApi';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'music/setMusic',
          'music/addMusicToState',
          'music/updateMusicInState',
          'events/setEvents',
          'events/addEventToState',
          'events/updateEventInState',
        ],
        ignoredPaths: ['events.events', 'music.music', 'musicPlayer.songs'],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
