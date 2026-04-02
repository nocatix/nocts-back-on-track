import React, { useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';
import { useAchievement } from '../context/AchievementContext';

export default function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const { achievements, trophies, loading, loadAchievements, loadTrophies } = useAchievement();

  useFocusEffect(
    useCallback(() => {
      loadAchievements();
      loadTrophies();
    }, [loadAchievements, loadTrophies])
  );

  const unlockedAchievements = achievements.filter(a => a.isUnlocked === 1 || a.unlockedDate);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked || a.unlockedDate === null);

  const renderAchievementItem = ({ item }) => {
    const isUnlocked = item.isUnlocked === 1 || item.unlockedDate;
    const unlockedDate = item.unlockedDate ? new Date(item.unlockedDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: new Date(item.unlockedDate).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    }) : null;

    return (
      <View style={[
        styles.achievementItem,
        { 
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.border,
          opacity: isUnlocked ? 1 : 0.6
        }
      ]}>
        <View style={[
          styles.achievementIcon,
          { backgroundColor: isUnlocked ? theme.colors.primary : theme.colors.border }
        ]}>
          <MaterialCommunityIcons
            name={isUnlocked ? "star" : "star-outline"}
            size={24}
            color={isUnlocked ? "white" : theme.colors.textTertiary}
          />
        </View>
        <View style={styles.achievementContent}>
          <Text style={[
            styles.achievementTitle,
            { color: theme.colors.text }
          ]}>
            {item.title}
          </Text>
          <Text style={[
            styles.achievementDescription,
            { color: theme.colors.textSecondary }
          ]}>
            {item.description}
          </Text>
          {unlockedDate && (
            <Text style={[
              styles.unlockedDate,
              { color: theme.colors.primary }
            ]}>
              Unlocked: {unlockedDate}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderTrophyItem = ({ item }) => {
    const earnedDate = item.earnedDate ? new Date(item.earnedDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: new Date(item.earnedDate).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    }) : null;

    return (
      <View style={[
        styles.trophyItem,
        { 
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.border
        }
      ]}>
        <View style={[
          styles.trophyIcon,
          { backgroundColor: theme.colors.warning }
        ]}>
          <MaterialCommunityIcons
            name="trophy"
            size={28}
            color="white"
          />
        </View>
        <View style={styles.trophyContent}>
          <Text style={[
            styles.trophyTitle,
            { color: theme.colors.text }
          ]}>
            {item.title}
          </Text>
          <Text style={[
            styles.trophyDescription,
            { color: theme.colors.textSecondary }
          ]}>
            {item.description}
          </Text>
          {earnedDate && (
            <Text style={[
              styles.earnedDate,
              { color: theme.colors.warning }
            ]}>
              Earned: {earnedDate}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (loading && achievements.length === 0 && trophies.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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
      {/* Progress Stats */}
      {achievements.length > 0 && (
        <View style={[styles.progressCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <View style={styles.progressStat}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Unlocked</Text>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {unlockedAchievements.length}
            </Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressStat}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {achievements.length}
            </Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressStat}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Progress</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {Math.round((unlockedAchievements.length / Math.max(achievements.length, 1)) * 100)}%
            </Text>
          </View>
        </View>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <View>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Achievements</Text>
          
          {unlockedAchievements.length > 0 && (
            <View>
              <Text style={[styles.subsectionTitle, { color: theme.colors.primary }]}>Unlocked</Text>
              <FlatList
                data={unlockedAchievements}
                renderItem={renderAchievementItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
              />
            </View>
          )}

          {lockedAchievements.length > 0 && (
            <View>
              <Text style={[styles.subsectionTitle, { color: theme.colors.textSecondary }]}>Locked</Text>
              <FlatList
                data={lockedAchievements}
                renderItem={renderAchievementItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
              />
            </View>
          )}
        </View>
      )}

      {/* Trophies Section */}
      {trophies.length > 0 && (
        <View>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trophies ({trophies.length})</Text>
          <FlatList
            data={trophies}
            renderItem={renderTrophyItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}

      {/* Empty State */}
      {achievements.length === 0 && trophies.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="trophy" size={64} color={theme.colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Achievements Yet</Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            Keep tracking your progress to unlock achievements and earn trophies!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  progressStat: {
    alignItems: 'center',
    flex: 1,
  },
  progressDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ccc',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  achievementDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  unlockedDate: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  trophyItem: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  trophyIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trophyContent: {
    flex: 1,
  },
  trophyTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  trophyDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  earnedDate: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
