import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  users: [],
  isLogin: false,
  status: 'idle', // 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  isAuthChecked: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLogin = Boolean(action.payload);
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
      state.isAuthChecked = true;
    },
    setUsers: (state, action) => {
      state.users = Array.isArray(action.payload) ? action.payload : [];
    },
    updateUserInUsersList: (state, action) => {
      const updatedUser = action.payload;
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
