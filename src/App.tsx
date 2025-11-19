import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Apply or remove dark class on document root
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist login state to localStorage
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-background">
      {!isLoggedIn ? (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} isDarkMode={isDarkMode} />
      ) : (
        <Dashboard 
          onLogout={() => setIsLoggedIn(false)} 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      )}
      <Toaster />
    </div>
  );
}
