import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { authenticatedExplicit, unauthenticatedExplicit } from '../store/credentialSlice';
import api from '../services/api';
import { toast } from 'react-toastify';

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client_id, client_secret } = useSelector((state) => state.credentials);

  useEffect(() => {
    const exchangeAuthorizationCode = async () => {
      try {
        if(searchParams.get('error')){
          toast.error(searchParams.get('message'))
          navigate('/');
          return;
        }

        const { data } = await api.post('oauth/token', {
          client_id,
          client_secret,
          grant_type: 'authorization_code',
          code: searchParams.get('code'),
        });

        dispatch(authenticatedExplicit(data));
        const { data: user } = await api.get('api/v1/subscriber', { flow: 'explicit' });
        dispatch(authenticatedExplicit({ ...data, user }));
        toast.success(`Successfully exchanged the token! Welcome, ${user.name} 🚀`);

        navigate(searchParams.get('state').replace(window.location.origin, ''));
      } catch (e) {
        e?.message && toast.error(e.message)
        dispatch(unauthenticatedExplicit());
      }
    };

    exchangeAuthorizationCode();
  }, []);

  return (<></>);
}

export default OAuthCallback;