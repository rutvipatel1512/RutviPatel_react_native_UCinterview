import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');

      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.log('Could not load theme');
    }
  };

  const changeTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);

    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Could not save theme');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}