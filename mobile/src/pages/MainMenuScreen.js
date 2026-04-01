import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import addictionService from '../api/addictionService';
import AddictionCard from '../components/AddictionCard';
import StatCard from '../components/StatCard';
import Button from '../components/Button';

export default function MainMenuScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.userName}>{user?.nameOnPhone || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          label="Total Addictions"
          value={addictions.length.toString()}
          color="#6366f1"
        />
        <StatCard
          label="Active Trackers"
          value={addictions.filter((a) => a.status === 'active').length.toString()}
          color="#22c55e"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Addictions</Text>
          <TouchableOpacity>
            <Text style={styles.addButton}>+ Add New</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6366f1" style={{ marginVertical: 20 }} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={fetchAddictions} />
          </View>
        ) : addictions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No addictions tracked yet.</Text>
            <Text style={styles.emptySubtext}>Start your recovery journey!</Text>
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
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logoutText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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
