import { createSlice } from '@reduxjs/toolkit';

const credentialSlice = createSlice({
  name: 'credentials',
  initialState: {
    client_id: '',
    client_secret: '',
    server: '',
    implicit: {
      authenticated: false,
      access_token: ''
    },
    explicit: {
      user: {},
      authenticated: false,
      access_token: ''
    },
  },
  reducers: {
    setClientId(state, action) {
      state.client_id = action.payload;
    },
    setClientSecret(state, action) {
      state.client_secret = action.payload;
    },
    setServer(state, action) {
      state.server = action.payload;
    },
    authenticated(state, action) {
      state.implicit.authenticated = true;
      state.implicit.access_token = action.payload.access_token;
    },
  },
});

export const { setClientId, setClientSecret, setServer, authenticated } = credentialSlice.actions;
export default credentialSlice.reducer;