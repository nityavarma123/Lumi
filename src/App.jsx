import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';

// 1. Keep these commented until the files exist
/*
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
*/

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ONLY keep the routes that have active imports */}
        <Route path="/" element={<Landing />} />

        {/* 2. Comment out these routes so they don't break the app */}
        {/* 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        */}

        {/* Catch-all: Redirect unknown routes back to Landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}