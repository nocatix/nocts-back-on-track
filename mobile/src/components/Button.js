import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';

export default function Button({
  onPress,
  title,
  loading = false,
  style,
  disabled = false,
}) {
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.colors.primary }, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      <Text style={styles.text}>{loading ? 'Loading...' : title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});
