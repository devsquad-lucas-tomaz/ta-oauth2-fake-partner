import { createSlice } from '@reduxjs/toolkit';

const credentialSlice = createSlice({
  name: 'credentials',
  initialState: {
    client_id: '',
    client_secret: '',
    server: '',
  },
  reducers: {
    setClientId(state, action) {
      state.client_id = action.payload;
    },
    setClientSecret(state, action) {
      state.client_secret = action.payload;
    },
    setServer(state, action) {
      console.log(state, action)
      state.server = action.payload;
    },
  },
});

export const { setClientId, setClientSecret, setServer } = credentialSlice.actions;
export default credentialSlice.reducer;