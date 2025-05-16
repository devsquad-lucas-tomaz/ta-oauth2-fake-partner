import { useNavigate } from 'react-router';
import Button from '../components/Button';

function NotFound() {
  const navigate = useNavigate();

  return (
    <section>
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
                <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-secondary-400">404</h1>
                <p className="mb-4 text-3xl tracking-tight font-bold text-neutral-900 md:text-4xl">Something's missing. 😔</p>
                <p className="mb-4 text-lg font-light text-neutral-500">Sorry, we can't find that page.  </p>
                <Button onClick={navigate('/')} className="my-4 mx-auto w-52">Back to Home</Button>
                <img src="/404.gif" alt="404" className="rounded-3xl mx-auto w-3xs mt-10" />
            </div>   
        </div>
    </section>
  );
}

export default NotFound;