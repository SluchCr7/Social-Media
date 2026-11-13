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
  users: [],
  isLogin: false,
  status: 'initializing',
  isAuthChecked: false,
  isLoading: false,
  sessionVersion: 0,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const safeUser = withoutTokens(action.payload);
      state.user = safeUser;
      state.isLogin = Boolean(safeUser);
      state.status = safeUser ? 'authenticated' : 'unauthenticated';
      state.isAuthChecked = true;
      state.sessionVersion += 1;
    },
    setUsers: (state, action) => {
      state.users = Array.isArray(action.payload) ? action.payload.map(withoutTokens) : [];
    },
    updateUserInUsersList: (state, action) => {
      const updatedUser = withoutTokens(action.payload);
      if (!updatedUser?._id) return;
      state.users = state.users.map((u) => (u._id === updatedUser._id ? { ...u, ...updatedUser } : u));
      if (state.user && state.user._id === updatedUser._id) {
        state.user = { ...state.user, ...updatedUser };
      }
    },
    removeUserFromList: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter((u) => u._id !== userId);
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
      state.users = [];
      state.isLogin = false;
      state.status = 'unauthenticated';
      state.isAuthChecked = true;
      state.sessionVersion += 1;
    },
  },
});

export const {
  setUser,
  setUsers,
  updateUserInUsersList,
  removeUserFromList,
  setIsLogin,
  setIsAuthChecked,
  setIsLoading,
  setAuthStatus,
  logoutSuccess,
} = authSlice.actions;

export default authSlice.reducer;
