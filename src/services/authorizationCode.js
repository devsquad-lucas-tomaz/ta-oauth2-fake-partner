import { store } from '../store/store';

const authorizationCode = () => {
  const { client_id, server } = store.getState().credentials;

    const route = new URL(`${server}/oauth/authorize`);

    route.searchParams.append('client_id', client_id);
    route.searchParams.append('prompt', 'consent');
    route.searchParams.append('response_type', 'code');
    route.searchParams.append('state', window.location.href);

    window.location.href = route.href;
};

export default authorizationCode;