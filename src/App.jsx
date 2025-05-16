import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import OAuthCallback from './pages/OAuthCallback';
import Worksheets from './pages/Worksheets';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
        <Navigation />
      
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/worksheets" element={<Worksheets />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App;