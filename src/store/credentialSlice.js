import { createSlice } from '@reduxjs/toolkit';

const credentialSlice = createSlice({
  name: 'credentials',
  initialState: {
    client_id: '',
    client_secret: '',
  },
  reducers: {
    receiveCredentials: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { receiveCredentials } = credentialSlice.actions;
export default credentialSlice.reducer;