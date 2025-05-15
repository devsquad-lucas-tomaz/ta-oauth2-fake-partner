import { Link } from 'react-router';

export default function Navigation() {
    return (
        <nav className="bg-secondary-400 p-4">
            <ul className="flex space-x-6 container mx-auto text-white">
                <li>
                    <Link to="/" className="hover:underline">Home</Link>
                </li>
                <li>
                    <Link to="/about" className="hover:underline">About</Link>
                </li>
                <li>
                    <Link to="/oauth/callback" className="hover:underline">OAuth Callback</Link>
                </li>
            </ul>
      </nav>
    );
}