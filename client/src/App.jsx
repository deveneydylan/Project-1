import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ClientDashboard from './pages/ClientDashboard';
import InternalDashboard from './pages/InternalDashboard';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">NIL Lending</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Internal Dashboard
              </Link>
              <Link
                to="/client/1"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.startsWith('/client')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
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
