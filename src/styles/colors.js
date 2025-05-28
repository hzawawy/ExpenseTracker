// src/styles/colors.js - Simple color system for dark/light mode
import { Appearance } from 'react-native';
import { useState, useEffect } from 'react';

// Define colors for both modes
const Colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F2F2F7',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    primary: '#007AFF',
    border: '#E0E0E0',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
  },
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    card: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',
    primary: '#0A84FF',
    border: '#38383A',
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
  },
};

// Hook to use colors
export const useColors = () => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme() || 'light');
  
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme || 'light');
    });
    
    return () => subscription?.remove();
  }, []);
  
  return Colors[colorScheme];
};
