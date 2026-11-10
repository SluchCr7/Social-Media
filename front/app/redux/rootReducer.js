import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authReducer from './features/auth/authSlice';
import userReducer from './features/user/userSlice';
import postsReducer from './features/posts/postsSlice';
import commentsReducer from './features/comments/commentsSlice';
import messagesReducer from './features/messages/messagesSlice';
import notificationsReducer from './features/notifications/notificationsSlice';
import storiesReducer from './features/stories/storiesSlice';
import highlightsReducer from './features/highlights/highlightsSlice';
import communitiesReducer from './features/communities/communitiesSlice';
import reelsReducer from './features/reels/reelsSlice';
import musicReducer from './features/music/musicSlice';
import musicPlayerReducer from './features/musicPlayer/musicPlayerSlice';
import eventsReducer from './features/events/eventsSlice';
import newsReducer from './features/news/newsSlice';
import reportsReducer from './features/reports/reportsSlice';
import searchReducer from './features/search/searchSlice';
import exploreReducer from './features/explore/exploreSlice';
import themeReducer from './features/theme/themeSlice';
import translateReducer from './features/translate/translateSlice';
import asideReducer from './features/aside/asideSlice';
import adminReducer from './features/admin/adminSlice';
import verifyReducer from './features/verify/verifySlice';
import feedbackReducer from './features/feedback/feedbackSlice';
import socketReducer from './features/socket/socketSlice';

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  user: userReducer,
  posts: postsReducer,
  comments: commentsReducer,
  messages: messagesReducer,
  notifications: notificationsReducer,
  stories: storiesReducer,
  highlights: highlightsReducer,
  communities: communitiesReducer,
  reels: reelsReducer,
  music: musicReducer,
  musicPlayer: musicPlayerReducer,
  events: eventsReducer,
  news: newsReducer,
  reports: reportsReducer,
  search: searchReducer,
  explore: exploreReducer,
  theme: themeReducer,
  translate: translateReducer,
  aside: asideReducer,
  admin: adminReducer,
  verify: verifyReducer,
  feedback: feedbackReducer,
  socket: socketReducer,
});

export default rootReducer;
