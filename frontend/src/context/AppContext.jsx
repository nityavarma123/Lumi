import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user,         setUser]        = useState(null);
  const [isLoggedIn,   setIsLoggedIn]  = useState(false);
  const [hasSeenIntro, setHasSeenIntro]= useState(false);
  const [theme,        setTheme]       = useState(() => localStorage.getItem('lumi_theme') || 'light');
  const [authLoading,  setAuthLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lumi_theme', theme);
  }, [theme]);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('lumi_token');
    if (token) {
      authApi.me()
        .then(u => { setUser(u); setIsLoggedIn(true); })
        .catch(() => { localStorage.removeItem('lumi_token'); localStorage.removeItem('lumi_user'); })
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
    if (localStorage.getItem('lumi_intro_seen')) setHasSeenIntro(true);
  }, []);

  const login = async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('lumi_token', res.token);
    setUser(res.user); setIsLoggedIn(true);
    return res;
  };

  const register = async ({ name, email, password }) => {
    const res = await authApi.register({ name, email, password });
    localStorage.setItem('lumi_token', res.token);
    setUser(res.user); setIsLoggedIn(true);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('lumi_token');
    setUser(null); setIsLoggedIn(false);
  };

  const markIntroSeen = () => {
    localStorage.setItem('lumi_intro_seen', '1');
    setHasSeenIntro(true);
  };

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{
      user, isLoggedIn, hasSeenIntro, theme, authLoading,
      login, register, logout, markIntroSeen, toggleTheme, setUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
