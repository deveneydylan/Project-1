import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ClientDashboard from './pages/ClientDashboard';
import InternalDashboard from './pages/InternalDashboard';

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
  const isInternal = location.pathname === '/';
  const isClient = location.pathname.startsWith('/client');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f1f5f9' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: '#003057' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <GTLogo />
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium transition-all duration-150 relative"
                style={{
                  color: isInternal ? '#EAAA00' : 'rgba(255,255,255,0.65)',
                  borderBottom: isInternal ? '2px solid #EAAA00' : '2px solid transparent',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                }}
              >
                Internal
              </Link>
              <Link
                to="/client/1"
                className="px-4 py-2 text-sm font-medium transition-all duration-150"
                style={{
                  color: isClient ? '#EAAA00' : 'rgba(255,255,255,0.65)',
                  borderBottom: isClient ? '2px solid #EAAA00' : '2px solid transparent',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                }}
              >
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<InternalDashboard />} />
          <Route path="/client/:companyId" element={<ClientDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
