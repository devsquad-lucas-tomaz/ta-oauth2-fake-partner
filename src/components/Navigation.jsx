import { useSelector } from 'react-redux';
import { Link } from 'react-router';

export default function Navigation() {
    const { authenticated } = useSelector((state) => state.credentials.implicit);
    return (
        <nav className="bg-secondary-400 p-4">
            <ul className="flex space-x-6 container mx-auto text-white">
                <li>
                    <Link to="/" className="hover:underline">Home</Link>
                </li>
                {authenticated && (
                    <>
                        <li>
                            <Link to="/worksheets" className="hover:underline">Worksheets</Link>
                        </li>
                    </>
                )}
            </ul>
      </nav>
    );
}