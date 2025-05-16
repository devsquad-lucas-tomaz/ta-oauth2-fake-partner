import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import Input from '../components/Input';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { setClientSecret, setClientId, setServer, authenticatedImplicit, unauthenticatedImplicit } from '../store/credentialSlice';
import { toast } from 'react-toastify';
import api from '../services/api';
import handleAuthorize from '../services/authorizationCode';

function Home() {
    const { client_id, client_secret, server, implicit } = useSelector((state) => state.credentials);
    const [loading, setLoading] = useState(false);
    const [errorResponse, setErrorResponse] = useState(false);

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post('oauth/token', {
                client_id,
                client_secret,
                grant_type: 'client_credentials',
            });
            dispatch(authenticatedImplicit(data));
            setErrorResponse(false);
            toast.success('Credentials saved successfully!');
        } catch (e){
            if(e?.response){
                const { response: { data } } = e;
                data && setErrorResponse(JSON.stringify(data, null, 4));
            }
            toast.error('Failure to connect. Please check your credentials and server.');
            dispatch(unauthenticatedImplicit());
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 space-y-6 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-secondary-500 mb-2">Hello, dear Partner 👋</h1>
                <p className="text-neutral-600 mb-6">Welcome! Please enter your <strong>Client ID</strong> and <strong>Client Secret</strong> to begin.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="server"
                        label="Server URL"
                        type="text"
                        defaultValue={server}
                        onChange={(e) => dispatch(setServer(e.target.value))}
                        placeholder="https://therapistaid.com"
                    />

                    <Input
                        label="Client ID"
                        name="clientId"
                        type="text"
                        defaultValue={client_id}
                        onChange={(e) => dispatch(setClientId(e.target.value))}
                        placeholder="Your client ID"
                    />

                    <Input
                        label="Client Secret"
                        name="clientSecret"
                        type="text"
                        defaultValue={client_secret}
                        onChange={(e) => dispatch(setClientSecret(e.target.value))}
                        placeholder="Your client secret"
                    />

                    <Button loading={loading} type="submit" state="fill" className="w-full">
                        Continue
                    </Button>
                </form>
            </div>

            {!implicit.authenticated && (
                <div className="shadow-lg rounded-2xl px-3 py-5 bg-primary-30 max-w-md w-full">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <InformationCircleIcon className="w-6 h-6 text-primary-500" />
                        </div>
                        <div className="ml-3 text-sm text-neutral-900 not-prose">
                            <p className="break-all">
                                When creating the token, use &nbsp;
                                    <span className="font-medium underline">{window.location.origin}/oauth/callback</span>
                                &nbsp;as callback URI.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {implicit.authenticated && (
                <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center w-full">
                    <span class="text-base text-neutral-900">Generate the authorize URL</span>
                    <Button className="w-full mt-2" onClick={handleAuthorize}>Go to Authorize URL</Button>
                </div>
            )}
            {errorResponse && (
                <pre className="sm:mx-auto w-full sm:w-auto max-w-md rounded-md p-3 bg-neutral-900 text-neutral-50 overflow-y-auto my-6">{errorResponse}</pre>
            )}
        </div>
  );
}

export default Home;