import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';

const HOTLINES = [
  { id: 'national-suicide', region: 'United States', name: 'National Suicide Prevention Lifeline', number: '988', description: 'Suicide prevention & crisis support' },
  { id: 'samhsa', region: 'United States', name: 'SAMHSA National Helpline', number: '1-800-662-4357', description: 'Substance abuse & mental health' },
  { id: 'aa', region: 'Worldwide', name: 'Alcoholics Anonymous', number: 'Visit aa.org', description: 'Peer support for alcohol addiction' },
  { id: 'na', region: 'Worldwide', name: 'Narcotics Anonymous', number: 'Visit na.org', description: 'Peer support for drug addiction' },
  { id: 'crisis-text', region: 'United States', name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Text-based crisis support' },
  { id: 'befrienders', region: 'United Kingdom', name: 'Befrienders', number: '044 7 394 2323', description: 'Emotional distress support' },
  { id: 'lifeline', region: 'Australia', name: 'Lifeline Australia', number: '13 11 14', description: 'Crisis support & suicide prevention' },
  { id: 'mindline', region: 'United Kingdom', name: 'MIND', number: '0300 123 3393', description: 'Mental health information & support' },
  { id: 'addiction-canada', region: 'Canada', name: 'Addiction & Mental Health', number: '1-855-562-2262', description: 'Addiction & mental health helpline' },
  { id: 'beyond-blue', region: 'Australia', name: 'Beyond Blue', number: '1300 22 4636', description: 'Mental health & substance abuse support' },
];

export default function CrisisHotlinesScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const [searchText, setSearchText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = ['All', ...new Set(HOTLINES.map(h => h.region))];

  const filteredHotlines = useMemo(() => {
    return HOTLINES.filter(hotline => {
      const matchesSearch = hotline.name.toLowerCase().includes(searchText.toLowerCase()) ||
                           hotline.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || hotline.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchText, selectedRegion]);

  const handleCall = (number) => {
    if (number.startsWith('Text') || number.includes('Visit')) {
      Alert.alert('Manual Dial Required', number);
      return;
    }
    const cleanNumber = number.replace(/[^0-9+\-]/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert('Error', 'Cannot make calls on this device');
    });
  };

  const renderHotlineItem = ({ item, index }) => (
    <View
      key={item.id}
      style={[
        styles.hotlineItem,
        { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border },
        index % 2 === 0 && { borderLeftWidth: 4, borderLeftColor: theme.colors.primary }
      ]}
    >
      <View style={styles.hotlineHeader}>
        <View style={styles.hotlineContent}>
          <Text style={[styles.hotlineName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.hotlineRegion, { color: theme.colors.textSecondary }]}>
            {item.region}
          </Text>
          <Text style={[styles.hotlineDesc, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
      </View>

      <View style={styles.hotlineFooter}>
        <Text style={[styles.hotlineNumber, { color: theme.colors.primary }]}>
          {item.number}
        </Text>
        <TouchableOpacity
          style={[styles.callButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleCall(item.number)}
        >
          <MaterialCommunityIcons name="phone" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Crisis Support Hotlines</Text>
      
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Available 24/7 • All calls are confidential
      </Text>

      {/* Search */}
      <View style={[styles.searchBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search hotlines..."
          placeholderTextColor={theme.colors.textTertiary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <MaterialCommunityIcons name="close" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Region Filter */}
      <FlatList
        horizontal
        data={regions}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.regionChip,
              {
                backgroundColor: selectedRegion === item ? theme.colors.primary : theme.colors.cardBg,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedRegion(item)}
          >
            <Text style={[
              styles.regionChipText,
              { color: selectedRegion === item ? 'white' : theme.colors.text }
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        scrollEnabled
        contentContainerStyle={styles.regionsContainer}
        showsHorizontalScrollIndicator={false}
      />

      {/* Hotlines List */}
      {filteredHotlines.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="phone-off" size={48} color={theme.colors.textTertiary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No hotlines found
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {filteredHotlines.map((item, index) => renderHotlineItem({ item, index }))}
        </View>
      )}

      {/* Info Box */}
      <View style={[styles.infoBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.primary }]}>
        <MaterialCommunityIcons name="information" size={20} color={theme.colors.primary} />
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          If you're in immediate danger, call emergency services or go to the nearest hospital.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  regionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  regionChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  regionChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  hotlineItem: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  hotlineHeader: {
    marginBottom: 12,
  },
  hotlineContent: {
    gap: 4,
  },
  hotlineName: {
    fontSize: 14,
    fontWeight: '600',
  },
  hotlineRegion: {
    fontSize: 11,
  },
  hotlineDesc: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  hotlineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotlineNumber: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 24,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    borderLeftWidth: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
