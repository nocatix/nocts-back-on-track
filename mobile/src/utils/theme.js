export const lightTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surfaceBackground: '#f9fafb',
    text: '#1f2937',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    cardBg: '#ffffff',
    inputBg: '#f3f4f6',
    inputBorder: '#d1d5db',
  },
};

export const darkTheme = {
  colors: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    background: '#111827',
    surfaceBackground: '#1f2937',
    text: '#f3f4f6',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    border: '#374151',
    borderLight: '#4b5563',
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    cardBg: '#1f2937',
    inputBg: '#374151',
    inputBorder: '#4b5563',
  },
};

export const getTheme = (isDarkMode) => {
  return isDarkMode ? darkTheme : lightTheme;
};
