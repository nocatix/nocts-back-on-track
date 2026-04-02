import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useMode } from '../context/ModeContext';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';
import addictionService from '../api/addictionService';
import AddictionCard from '../components/AddictionCard';
import StatCard from '../components/StatCard';
import Button from '../components/Button';

export default function MainMenuScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useContext(AuthContext);
  const { mode } = useMode();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const [addictions, setAddictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchAddictions();
    }, [])
  );

  const fetchAddictions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await addictionService.getAddictions();
      setAddictions(data);
    } catch (err) {
      setError(err.message || 'Failed to load addictions');
      console.error('Error fetching addictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }
      ]}
    >
      <View style={styles.statsContainer}>
        <StatCard
          label="Total Addictions"
          value={addictions.length.toString()}
          color={theme.colors.primary}
        />
        <StatCard
          label="Active Trackers"
          value={addictions.filter((a) => a.status === 'active').length.toString()}
          color={theme.colors.success}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Addictions</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity>
              <Text style={[styles.addButton, { color: theme.colors.primary }]}>+ Add New</Text>
            </TouchableOpacity>
            {mode === 'connected' && (
              <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 20 }} />
        ) : error ? (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.error, opacity: 0.1 }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
            <Button title="Retry" onPress={fetchAddictions} />
          </View>
        ) : addictions.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: theme.colors.surfaceBackground, borderColor: theme.colors.border }]}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>No addictions tracked yet.</Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Start your recovery journey!</Text>
            <Button
              title="Add Your First Addiction"
              onPress={() => navigation.navigate('AddNewAddiction')}
              style={{ marginTop: 16 }}
            />
          </View>
        ) : (
          <View>
            {addictions.map((addiction) => (
              <AddictionCard
                key={addiction._id}
                addiction={addiction}
                onPress={() =>
                  navigation.navigate('AddictionDetail', { id: addiction._id })
                }
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  addButton: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 0,
  },
  logoutText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#991b1b',
    marginBottom: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 16,
  },
  spacing: {
    height: 20,
  },
});
