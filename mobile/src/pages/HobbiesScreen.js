import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';

const HOBBIES = [
  {
    id: 'reading',
    name: 'Reading',
    icon: 'book',
    category: 'Mental',
    description: 'Escape into stories and learn new things',
    tips: ['Fantasy and mystery help with escapism', 'Join a book club for community', 'Audio books for variety'],
  },
  {
    id: 'art',
    name: 'Art & Drawing',
    icon: 'palette',
    category: 'Creative',
    description: 'Express yourself through visual creation',
    tips: ['No experience needed', 'Try different mediums', 'Share online for motivation'],
  },
  {
    id: 'music',
    name: 'Music & Instruments',
    icon: 'guitar-acoustic',
    category: 'Creative',
    description: 'Create or listen to music for mood boost',
    tips: ['Watch online tutorials', 'Join jam sessions', 'Playlist for different moods'],
  },
  {
    id: 'writing',
    name: 'Writing & Journaling',
    icon: 'pencil',
    category: 'Expressive',
    description: 'Process emotions through written word',
    tips: ['No rules or judgment', 'Poetry or prose', 'Use this app for journaling'],
  },
  {
    id: 'cooking',
    name: 'Cooking & Baking',
    icon: 'chef-hat',
    category: 'Productive',
    description: 'Create tasty foods while staying busy',
    tips: ['Try new recipes', 'Cook for others', 'Health-conscious options'],
  },
  {
    id: 'gaming',
    name: 'Video Games',
    icon: 'gamepad-variant',
    category: 'Entertainment',
    description: 'Immersive gaming experiences',
    tips: ['Set time limits', 'Multiplayer for social connection', 'Problem-solving games'],
  },
  {
    id: 'gardening',
    name: 'Gardening',
    icon: 'flower',
    category: 'Nature',
    description: 'Grow plants and connect with nature',
    tips: ['Start with easy plants', 'Outdoor and indoor options', 'Stress relief guaranteed'],
  },
  {
    id: 'sports',
    name: 'Sports & Teams',
    icon: 'basketball',
    category: 'Social',
    description: 'Team activities for motivation and connection',
    tips: ['Join local leagues', 'Various skill levels', 'Built-in community support'],
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: 'camera',
    category: 'Creative',
    description: 'Capture and share your perspective',
    tips: ['Phone camera is enough', 'Nature or street photography', 'Share on social media'],
  },
  {
    id: 'volunteering',
    name: 'Volunteering',
    icon: 'hand-heart',
    category: 'Social',
    description: 'Help others and find purpose',
    tips: ['Animal shelters', 'Food banks', 'Community centers'],
  },
  {
    id: 'crafts',
    name: 'DIY & Crafts',
    icon: 'hammer-screwdriver',
    category: 'Creative',
    description: 'Create handmade items and gifts',
    tips: ['Start simple', 'YouTube tutorials', 'Great gift ideas'],
  },
  {
    id: 'meditation',
    name: 'Meditation & Mindfulness',
    icon: 'meditation',
    category: 'Mental',
    description: 'Find inner peace and calm',
    tips: ['Apps like Headspace', 'Start with 5 minutes', 'Anytime, anywhere'],
  },
];

export default function HobbiesScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const [expandedId, setExpandedId] = useState(null);

  const categories = ['All', ...new Set(HOBBIES.map(h => h.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = selectedCategory === 'All' 
    ? HOBBIES 
    : HOBBIES.filter(h => h.category === selectedCategory);

  const renderHobbyItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={[styles.hobbyCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        <View style={styles.hobbyHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name={item.icon} size={24} color="white" />
          </View>
          <View style={styles.headerContent}>
            <Text style={[styles.hobbyName, { color: theme.colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.category, { color: theme.colors.textSecondary }]}>
              {item.category}
            </Text>
          </View>
          <MaterialCommunityIcons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={theme.colors.textSecondary}
          />
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {item.description}
            </Text>
            <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
              Getting Started:
            </Text>
            {item.tips.map((tip, idx) => (
              <View key={idx} style={styles.tipItem}>
                <MaterialCommunityIcons name="lightbulb" size={14} color={theme.colors.primary} />
                <Text style={[styles.tipText, { color: theme.colors.text }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
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
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Hobby Ideas</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Find activities that bring you joy and keep you busy
      </Text>

      {/* Category Filter */}
      <FlatList
        horizontal
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === item ? theme.colors.primary : theme.colors.cardBg,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[
              styles.categoryText,
              { color: selectedCategory === item ? 'white' : theme.colors.text }
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        scrollEnabled
        contentContainerStyle={styles.categoryContainer}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={filtered}
        renderItem={renderHobbyItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />

      <View style={[styles.encouragementBox, { backgroundColor: theme.colors.primary }]}>
        <MaterialCommunityIcons name="star-circle" size={32} color="white" />
        <Text style={styles.encouragementText}>
          Pick a hobby that excites you. Hobbies fill the time and give your mind something to focus on besides cravings.
        </Text>
      </View>

      <View style={{ height: 24 }} />
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
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  hobbyCard: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  hobbyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerContent: {
    flex: 1,
  },
  hobbyName: {
    fontSize: 14,
    fontWeight: '600',
  },
  category: {
    fontSize: 11,
    marginTop: 2,
  },
  expandedContent: {
    marginTop: 12,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  tipText: {
    fontSize: 12,
    flex: 1,
  },
  encouragementBox: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  encouragementText: {
    color: 'white',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
    fontWeight: '500',
  },
});
