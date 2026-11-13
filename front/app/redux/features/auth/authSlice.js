import { createSlice } from '@reduxjs/toolkit';

const withoutTokens = (user) => {
  if (!user || typeof user !== 'object') return user;
  const safeUser = { ...user };
  delete safeUser.token;
  delete safeUser.accessToken;
  delete safeUser.refreshToken;
  return safeUser;
};

const initialState = {
  user: null,
  isLogin: false,
  status: 'initializing',
  isAuthChecked: false,
  isLoading: false,
  sessionVersion: 0,
};

const applyUser = (state, user) => {
  const safeUser = withoutTokens(user);
  state.user = safeUser;
  state.isLogin = Boolean(safeUser);
  state.status = safeUser ? 'authenticated' : 'unauthenticated';
  state.isAuthChecked = true;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      applyUser(state, action.payload);
    },
    setAuthSession: (state, action) => {
      applyUser(state, action.payload);
      state.sessionVersion += 1;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
    },
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
      state.status = action.payload
        ? (state.user ? 'authenticated' : 'unauthenticated')
        : 'initializing';
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAuthStatus: (state, action) => {
      state.status = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isLogin = false;
      state.status = 'unauthenticated';
      state.isAuthChecked = true;
      state.sessionVersion += 1;
    },
  },
});

export const {
  setUser,
  setAuthSession,
  setIsLogin,
  setIsAuthChecked,
  setIsLoading,
  setAuthStatus,
  logoutSuccess,
} = authSlice.actions;

export default authSlice.reducer;
