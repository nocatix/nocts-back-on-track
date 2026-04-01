import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({
  onPress,
  title,
  loading = false,
  style,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
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
