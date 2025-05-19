import axios from 'axios';
import { store } from '../store/store';
import {
  authenticatedImplicit,
  refreshTokenExplicit,
  unauthenticatedImplicit,
  unauthenticatedExplicit,
} from '../store/credentialSlice';
import { toast } from 'react-toastify';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const refreshExplicitToken = async () => {
  const { explicit } = store.getState().credentials;
  const { server, client_id, client_secret } = store.getState().credentials;

  if (!explicit.refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${server}/oauth/token`, {
      client_id,
      client_secret,
      refresh_token: explicit.refresh_token,
      grant_type: 'refresh_token',
    });
    const { access_token, refresh_token } = response.data;
    store.dispatch(refreshTokenExplicit({ access_token, refresh_token }));
    return access_token;
  } catch (error) {
    console.error('Explicit token refresh failed:', error);
    store.dispatch(unauthenticatedExplicit());
    throw error;
  }
};

const reissueClientCredentialsToken = async () => {
  const { client_id, client_secret, server } = store.getState().credentials;

  try {
    const { data } = await axios.post(`${server}/oauth/token`, {
      client_id,
      client_secret,
      grant_type: 'client_credentials',
    });
    const { access_token } = data;
    store.dispatch(authenticatedImplicit(data));
    return access_token;
  } catch (error) {
    console.error('Client credentials token re-issue failed:', error);
    store.dispatch(unauthenticatedImplicit());
    throw error;
  }
};

// Request interceptor to set Authorization header based on flow
api.interceptors.request.use(
  (config) => {
    const { implicit, explicit, server } = store.getState().credentials;
    const { flow = 'implicit' } = config;

    config.baseURL = server;

    if (flow === 'implicit' && implicit.authenticated) {
      config.headers.Authorization = `Bearer ${implicit.access_token}`;
    }

    if (flow === 'explicit' && explicit.authenticated) {
      config.headers.Authorization = `Bearer ${explicit.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { implicit, explicit } = store.getState().credentials;

    if (error.response && error.response.status === 401) {
      const flow = originalRequest.flow || 'implicit';

      if (flow === 'implicit' && implicit.authenticated && error.response.data?.error === 'access_denied' && !originalRequest._retry) {
        store.dispatch(unauthenticatedImplicit());
        originalRequest._retry = true;

        try {
          const newAccessToken = await reissueClientCredentialsToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          toast.success('Token re-issued successfully!');

          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(unauthenticatedExplicit());
          toast.error('Failed to re-issue the token. Back to Home.');

          return Promise.reject(refreshError);
        }
      }

      if (flow === 'explicit' && explicit.authenticated && error.response.data?.message === 'Unauthorized' && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshExplicitToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          toast.success('Token refreshed successfully!');

          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(unauthenticatedExplicit());
          toast.error('Failed to refresh the token. Back to Home.');

          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;