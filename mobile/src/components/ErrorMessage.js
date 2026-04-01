import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    padding: 12,
    marginBottom: 15,
    borderRadius: 4,
  },
  text: {
    color: '#991b1b',
    fontSize: 14,
  },
});
