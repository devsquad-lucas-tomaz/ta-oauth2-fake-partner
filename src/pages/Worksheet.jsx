import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import handleAuthorize from '../services/authorizationCode';

function Worksheet() {
  const [worksheet, setWorksheet] = useState(null);
  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const { slug } = useParams();
  const { server, explicit: { authenticated, user } } = useSelector((state) => state.credentials);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorksheet = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/v1/digitized-worksheets/${slug}`);
        setWorksheet(data);
      } catch (e) {
        navigate('/');
        e.message && toast.error(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorksheet();
  }, [slug]);

  const handleLaunchDigitalWorksheet = async () => {
    setIsLaunching(true);

    try {
      const { data: { url } } = await api.post(`/api/v1/digitized-worksheets/${slug}`, { option }, { flow: 'explicit' });
      window.open(url, '_blank');
    } catch (e) {
      e.message && toast.error(e.message);
    }

    setIsLaunching(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 animate-pulse">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-8 min-h-screen">
          <div className="h-12 bg-neutral-100 rounded w-3/4 mb-4" />
          <div className="h-6 bg-neutral-100 rounded w-1/2 mb-10" />
          <div className="h-64 bg-neutral-100 rounded-lg mb-6" />
          <div className="h-screen bg-neutral-100 rounded mb-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-8">
        <div className="border-b border-neutral-200 pb-4 mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">{worksheet.title}</h1>
          {worksheet.subtitle && (
            <h2 className="text-xl md:text-2xl text-neutral-600">{worksheet.subtitle}</h2>
          )}
        </div>

        <div className="mb-8">
          <div className="bg-neutral-100/80 rounded-lg mb-6">
            <img
              src={worksheet.thumbnail}
              alt={`${worksheet.title} thumbnail`}
              className="max-h-60 md:h-80 mx-auto object-cover"
            />
          </div>
          <ShadowContent worksheet={worksheet} server={server} />
        </div>

        {authenticated && user?.hasPremiumAccess ? (
          <div className="mb-8 p-4 bg-primary-30 rounded-lg flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold text-primary-800 mb-2">Digital Worksheet</h3>
            <p className="text-neutral-600 mb-2">
              Access the interactive digital version of this worksheet.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
                {worksheet.options.map((opt, index) => (
                  <button
                    key={index}
                    className={`inline-block text-xs font-medium text-[#3E318F] px-3 py-1 rounded-full capitalize disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                      option === opt.option ? 'hover:bg-[#a699f0] bg-[#bbb1f4]' : 'bg-[#CEC6FC] hover:bg-[#bbb1f4]'
                    }`}
                    onClick={() => setOption(opt.option)}
                    disabled={!authenticated}
                  >
                    {opt.option.replace('standard-', '')}
                  </button>
                ))}
            </div>
            <Button
              onClick={handleLaunchDigitalWorksheet}
              disabled={!authenticated || !option}
              loading={isLaunching}
              className="bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Launch Digital Worksheet
            </Button>
          </div>
        ) : (
          authenticated && !user?.hasPremiumAccess ? (
            <div className="mb-8 p-4 bg-neutral-100 rounded-lg flex flex-col items-center justify-center gap-2">
              <LockClosedIcon className="w-6 h-6 text-neutral-500" />
              <p className="text-neutral-600 text-center">
                This feature is reserved for professional members.
                <br />
              </p>
              <Button size="sm" onClick={() => window.open(`${server}/plans`)}>Unlock All Features</Button>
            </div>
          ) :
            <div className="mb-8 p-4 bg-neutral-100 rounded-lg flex flex-col items-center justify-center gap-2">
              <LockClosedIcon className="w-6 h-6 text-neutral-500" />
              <p className="text-neutral-600 text-center">
                This feature is only available to authenticated users.
                <br />
              </p>
              <Button size="sm" className="w-28" onClick={handleAuthorize}>Authorize</Button>
            </div>
        )}

        {worksheet.url && (
          <div className="mb-8">
            <Button onClick={() => window.open(worksheet.url, '_blank')}>
              View Original Worksheet
            </Button>
          </div>
        )}

        {worksheet.references?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg md:text-xl font-semibold text-neutral-800 mb-3">References</h3>
            <ul className="list-disc list-inside text-neutral-700 space-y-1">
              {worksheet.references.map((ref, index) => (
                <li key={index}>{ref}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const ShadowContent = ({ worksheet, server }) => {
  const wrapper = useRef(null);

  const createStyle = (stylePath) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${server}${stylePath}`;
    link.type = 'text/css';
    return link;
  };

  const injectContent = () => {
    if (!worksheet?.body || !wrapper.current) return;

    const el = wrapper.current;

    const shadow = el.shadowRoot || el.attachShadow({ mode: 'open' });

    while (shadow.firstChild) shadow.removeChild(shadow.firstChild);

    const body = document.createElement('div');
    body.id = 'content-body';
    body.className = 'article';
    body.innerHTML = worksheet.body
      .replaceAll('href="/', `href="${server}/`)
      .replaceAll('src="/', `src="${server}/`);

    shadow.appendChild(createStyle('/css/content-body.css'));
    shadow.appendChild(createStyle('/css/front.css'));
    shadow.appendChild(body);
  };

  useEffect(() => injectContent(), [worksheet?.body, server]);

  return <div ref={wrapper} />;
};

export default Worksheet;