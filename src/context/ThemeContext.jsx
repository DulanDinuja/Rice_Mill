import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize dark mode BEFORE first render to prevent flash
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, default to dark mode
    const savedTheme = localStorage.getItem('theme');
    const initialIsDark = savedTheme ? savedTheme === 'dark' : true;

    // Set dark class immediately
    if (typeof document !== 'undefined') {
      if (initialIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return initialIsDark;
  });

  useEffect(() => {
    // Toggle dark mode class and save to localStorage when theme changes
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};