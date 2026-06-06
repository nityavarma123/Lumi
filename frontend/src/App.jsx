import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar    from './components/Sidebar/Sidebar';
import ChatWidget from './components/ChatWidget/ChatWidget';
import Landing    from './pages/Landing/Landing';
import Dashboard  from './pages/Dashboard/Dashboard';
import Study      from './pages/Study/Study';
import Sleep      from './pages/Sleep/Sleep';
import Nutrition  from './pages/Nutrition/Nutrition';
import Activity   from './pages/Activity/Activity';
import Schedule   from './pages/Schedule/Schedule';
import Chat       from './pages/Chat/Chat';

// ─── Authenticated app shell ─────────────────────────────────────────────────
function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main
        className="app-main"
        style={{
          marginLeft: 220,
          flex: 1,
          background: 'var(--bg)',
          transition: 'background 0.3s',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
      <ChatWidget />
    </div>
  );
}

// ─── Route guard ─────────────────────────────────────────────────────────────
function Guard({ children }) {
  const { isLoggedIn, authLoading } = useApp();

  if (authLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          color: 'var(--text-3)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
        }}
      >
        loading…
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return <AppLayout>{children}</AppLayout>;
}

// ─── Routes ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* Mobile sidebar offset */}
        <style>{`
          @media (max-width: 768px) {
            .app-main { margin-left: 0 !important; padding-bottom: 68px; }
          }
        `}</style>

        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
          <Route path="/study"     element={<Guard><Study /></Guard>} />
          <Route path="/sleep"     element={<Guard><Sleep /></Guard>} />
          <Route path="/nutrition" element={<Guard><Nutrition /></Guard>} />
          <Route path="/activity"  element={<Guard><Activity /></Guard>} />
          <Route path="/schedule"  element={<Guard><Schedule /></Guard>} />
          <Route path="/chat"      element={<Guard><Chat /></Guard>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
