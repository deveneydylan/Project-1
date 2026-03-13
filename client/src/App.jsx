import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ClientDashboard from './pages/ClientDashboard';
import InternalDashboard from './pages/InternalDashboard';
import LandingPage from './pages/LandingPage';

function GTLogo() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#EAAA00' }}
      >
        <span
          className="font-bold text-sm leading-none"
          style={{ color: '#003057', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1rem' }}
        >
          GT
        </span>
      </div>
      <span
        className="text-white font-medium tracking-wide text-sm hidden sm:block"
        style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '0.02em' }}
      >
        Georgia Tech PIP Co
      </span>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isInternal = location.pathname === '/dashboard';
  const isClient = location.pathname.startsWith('/client');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#010d1a' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: '#003057' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <Link to="/">
              <GTLogo />
            </Link>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`metal-tab${isHome ? ' metal-tab-active' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className={`metal-tab${isInternal ? ' metal-tab-active' : ''}`}
              >
                Internal
              </Link>
              <Link
                to="/client/1"
                className={`metal-tab${isClient ? ' metal-tab-active' : ''}`}
              >
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<InternalDashboard />} />
          <Route path="/client/:companyId" element={<ClientDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
