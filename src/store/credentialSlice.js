import { createSlice } from '@reduxjs/toolkit';

const credentialSlice = createSlice({
  name: 'credentials',
  initialState: {
    client_id: '',
    client_secret: '',
    server: '',
    implicit: {
      authenticated: false,
      access_token: '',
    },
    explicit: {
      user: {},
      authenticated: false,
      access_token: '',
      refresh_token: '',
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
    authenticatedImplicit(state, action) {
      state.implicit.authenticated = true;
      state.implicit.access_token = action.payload.access_token;
    },
    unauthenticatedImplicit(state) {
      state.implicit.authenticated = false;
      state.implicit.access_token = '';
    },
    authenticatedExplicit(state, action) {
      state.explicit.authenticated = true;
      state.explicit.access_token = action.payload.access_token;
      state.explicit.refresh_token = action.payload.refresh_token || '';
      state.explicit.user = action.payload.user || {};
    },
    unauthenticatedExplicit(state) {
      state.explicit.authenticated = false;
      state.explicit.access_token = '';
      state.explicit.refresh_token = '';
      state.explicit.user = {};
    },
    refreshTokenExplicit(state, action) {
      state.explicit.access_token = action.payload.access_token;
      state.explicit.refresh_token = action.payload.refresh_token || state.explicit.refresh_token;
    },
  },
});

export const {
  setClientId,
  setClientSecret,
  setServer,
  authenticatedImplicit,
  unauthenticatedImplicit,
  authenticatedExplicit,
  unauthenticatedExplicit,
  refreshTokenExplicit,
} = credentialSlice.actions;
export default credentialSlice.reducer;