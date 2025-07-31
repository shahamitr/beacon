
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Register from './Register';
import Websites from './Websites';
import Dashboard from './Dashboard';
import Compare from './Compare';


function AuthGate() {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [view, setView] = useState('dashboard');
  const [selectedWebsite, setSelectedWebsite] = useState(null);

  if (!user) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onSwitch={() => setShowRegister(true)} />
    );
  }

  return (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-100 border-b mb-4">
        <button
          className={`px-3 py-1 rounded ${view === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
          onClick={() => setView('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`px-3 py-1 rounded ${view === 'websites' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
          onClick={() => setView('websites')}
        >
          Websites
        </button>
        <button
          className={`px-3 py-1 rounded ${view === 'compare' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
          onClick={() => setView('compare')}
          disabled={!selectedWebsite}
        >
          Compare
        </button>
      </nav>
      {view === 'dashboard' && <Dashboard />}
      {view === 'websites' && <Websites onSelectWebsite={setSelectedWebsite} />}
      {view === 'compare' && selectedWebsite && <Compare websiteId={selectedWebsite} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

export default App;
