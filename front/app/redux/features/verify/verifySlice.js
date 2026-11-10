import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  verifyStatus: false,
};

export const verifySlice = createSlice({
  name: 'verify',
  initialState,
  reducers: {
    setVerifyStatus: (state, action) => {
      state.verifyStatus = action.payload;
    },
  },
});

export const { setVerifyStatus } = verifySlice.actions;

export default verifySlice.reducer;
