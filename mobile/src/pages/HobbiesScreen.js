import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';
import { HOBBIES } from '../data/hobbiesData';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'solo', label: '😊 Solo' },
  { value: 'social', label: '👥 Social' },
  { value: 'outdoor', label: '🌳 Outdoor' },
  { value: 'indoor', label: '🏠 Indoor' },
  { value: 'free', label: '💰 Free' },
];

export default function HobbiesScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter hobbies based on category and search
  const filteredHobbies = useMemo(() => {
    let filtered = HOBBIES;

    // Filter by category
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(hobby => 
        hobby.category && hobby.category.includes(selectedFilter)
      );
    }

    // Filter by search text
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(hobby =>
        hobby.name.toLowerCase().includes(search) ||
        hobby.description.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [searchText, selectedFilter]);

  const renderHobbyItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={[styles.hobbyCard, { backgroundColor: theme.colors.cardBg, borderBottomColor: theme.colors.border }]}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.hobbyHeader}>
          <Text style={styles.hobbyEmoji}>{item.emoji}</Text>
          <View style={styles.headerContent}>
            <Text style={[styles.hobbyName, { color: theme.colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.duration, { color: theme.colors.textSecondary }]}>
              ⏱ {item.duration}
            </Text>
          </View>
          <MaterialCommunityIcons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={theme.colors.primary}
          />
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {item.description}
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recovery Benefits:
            </Text>
            {item.recovery_benefits.map((benefit, idx) => (
              <View key={idx} style={styles.benefitItem}>
                <MaterialCommunityIcons name="check-circle" size={14} color={theme.colors.primary} />
                <Text style={[styles.benefitText, { color: theme.colors.text }]}>
                  {benefit}
                </Text>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { color: theme.colors.text }, { marginTop: 12 }]}>
              How to Get Started:
            </Text>
            <Text style={[styles.getStartedText, { color: theme.colors.textSecondary }]}>
              {item.get_started}
            </Text>

            <View style={[styles.categoriesContainer, { backgroundColor: theme.colors.background }]}>
              {item.category && item.category.map((cat, idx) => (
                <View key={idx} style={[styles.categoryTag, { backgroundColor: theme.colors.primary + '30' }]}>
                  <Text style={[styles.categoryTagText, { color: theme.colors.primary }]}>
                    {cat}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Discover Hobbies</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Find activities that bring purpose and fill your time
        </Text>
      </View>

      {/* Search Box */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.primary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search hobbies..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <MaterialCommunityIcons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Buttons */}
      <FlatList
        horizontal
        data={filterOptions}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedFilter === item.value ? theme.colors.primary : theme.colors.cardBg,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedFilter(item.value)}
          >
            <Text style={[
              styles.filterText,
              { color: selectedFilter === item.value ? 'white' : theme.colors.text }
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.value}
        scrollEnabled
        contentContainerStyle={styles.filterContainer}
        showsHorizontalScrollIndicator={false}
      />

      {/* Results Count */}
      <Text style={[styles.resultsCount, { color: theme.colors.textSecondary }]}>
        {filteredHobbies.length} {filteredHobbies.length === 1 ? 'hobby' : 'hobbies'} found
      </Text>

      {/* Hobbies List */}
      {filteredHobbies.length > 0 ? (
        <FlatList
          data={filteredHobbies}
          renderItem={renderHobbyItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateIcon]}>🔍</Text>
          <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
            No hobbies found
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>
            Try adjusting your search or filters
          </Text>
        </View>
      )}

      {/* Inspiration Box */}
      <View style={[styles.inspirationBox, { backgroundColor: theme.colors.primary + '20' }]}>
        <Text style={styles.inspirationEmoji}>✨</Text>
        <View style={styles.inspirationContent}>
          <Text style={[styles.inspirationTitle, { color: theme.colors.text }]}>
            Quick Tip
          </Text>
          <Text style={[styles.inspirationText, { color: theme.colors.textSecondary }]}>
            Pick hobbies that excite you. The best recovery hobby is one you'll actually do.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  searchContainer: {
    marginHorizontal: 15,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterContainer: {
    paddingHorizontal: 12,
    marginBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  resultsCount: {
    paddingHorizontal: 20,
    fontSize: 12,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 15,
  },
  hobbyCard: {
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderBottomWidth: 1,
  },
  hobbyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hobbyEmoji: {
    fontSize: 28,
  },
  headerContent: {
    flex: 1,
  },
  hobbyName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 12,
    lineHeight: 18,
  },
  getStartedText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 13,
  },
  inspirationBox: {
    marginHorizontal: 15,
    marginTop: 24,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  inspirationEmoji: {
    fontSize: 24,
  },
  inspirationContent: {
    flex: 1,
  },
  inspirationTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  inspirationText: {
    fontSize: 12,
    lineHeight: 18,
  },
});

