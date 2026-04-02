import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { usePreparation } from '../context/PreparationContext';
import { useAddiction } from '../context/AddictionContext';
import { useTheme } from '../context/DarkModeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PreparationPlanScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const { preparationPlan, loading, loadPreparationPlan, createPreparationPlan, updatePreparationField } = usePreparation();
  const { addictions } = useAddiction();
  
  const [expandedSection, setExpandedSection] = useState('motivation');
  const [responses, setResponses] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedAddictionId, setSelectedAddictionId] = useState(null);
  const saveTimers = useRef({});

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    section: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.cardBg,
    },
    sectionHeaderFeatured: {
      backgroundColor: colors.primary + '20',
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    sectionEmoji: {
      fontSize: 20,
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    toggleIcon: {
      fontSize: 20,
      color: colors.primary,
      fontWeight: 'bold',
    },
    sectionContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.cardBg,
      maxHeight: 0,
      overflow: 'hidden',
    },
    sectionContentExpanded: {
      maxHeight: 5000,
    },
    contentText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      marginBottom: 12,
    },
    boldText: {
      fontWeight: '600',
    },
    list: {
      marginLeft: 8,
      marginBottom: 12,
    },
    listItem: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 6,
      lineHeight: 20,
    },
    checklistItemGroup: {
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBg === colors.background ? colors.primary + '20' : colors.primary + '30',
    },
    checklistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.primary,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      flex: 1,
    },
    responseField: {
      backgroundColor: colors.cardBg === colors.background ? colors.primary + '10' : colors.background,
      borderWidth: 1,
      borderColor: colors.primary + '30',
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      fontSize: 14,
      marginTop: 8,
    },
    tipBox: {
      backgroundColor: colors.primary + '15',
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    tipText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '500',
    },
    triggerCategory: {
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary + '20',
    },
    triggerCategoryTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 6,
    },
    triggerCategoryDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    supportType: {
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary + '20',
    },
    supportTypeTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 8,
    },
    strategy: {
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary + '20',
    },
    strategyTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 6,
    },
    strategyDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    savingIndicator: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    savingText: {
      fontSize: 12,
      color: colors.primary,
      marginTop: 4,
    },
    addictionSelector: {
      marginBottom: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    addictionLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    addictionButton: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 2,
    },
    addictionButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    addictionButtonInactive: {
      backgroundColor: colors.background,
      borderColor: colors.primary + '50',
    },
    addictionButtonText: {
      fontSize: 12,
      fontWeight: '500',
    },
    addictionButtonTextActive: {
      color: 'white',
    },
    addictionButtonTextInactive: {
      color: colors.textSecondary,
    },
    motivationBox: {
      backgroundColor: colors.primary + '15',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    keyInsight: {
      fontSize: 13,
      color: colors.text,
      fontStyle: 'italic',
      fontWeight: '500',
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [selectedAddictionId])
  );

  const loadData = async () => {
    try {
      const plan = await loadPreparationPlan(selectedAddictionId);
      if (plan) {
        setResponses({
          assess_frequency: plan.assessFrequency || '',
          assess_money: plan.assessMoney || '',
          assess_time: plan.assessTime || '',
          assess_triggers: plan.assessTriggers || '',
          assess_impact: plan.assessImpact || '',
          assess_obstacles: plan.assessObstacles || '',
        });
      }
    } catch (error) {
      console.error('Error loading preparation data:', error);
    }
  };

  const handleResponseChange = (fieldId, text) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: text
    }));

    if (saveTimers.current[fieldId]) {
      clearTimeout(saveTimers.current[fieldId]);
    }

    setSaving(true);
    saveTimers.current[fieldId] = setTimeout(async () => {
      try {
        if (preparationPlan) {
          await updatePreparationField(preparationPlan.id, fieldId, text);
        }
      } catch (error) {
        console.error('Error saving field:', error);
      } finally {
        setSaving(false);
      }
    }, 500);
  };

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📋 Preparation Plan</Text>
          <Text style={styles.subtitle}>Get ready for success with these essential steps</Text>
        </View>

        {/* Addiction Selector */}
        {addictions && addictions.length > 0 && (
          <View style={styles.addictionSelector}>
            <Text style={styles.addictionLabel}>Select Addiction:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {addictions.map((addiction) => (
                <TouchableOpacity
                  key={addiction.id}
                  style={[
                    styles.addictionButton,
                    selectedAddictionId === addiction.id
                      ? styles.addictionButtonActive
                      : styles.addictionButtonInactive,
                  ]}
                  onPress={() => setSelectedAddictionId(addiction.id)}
                >
                  <Text
                    style={[
                      styles.addictionButtonText,
                      selectedAddictionId === addiction.id
                        ? styles.addictionButtonTextActive
                        : styles.addictionButtonTextInactive,
                    ]}
                  >
                    {addiction.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 1. Motivation Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.sectionHeader, styles.sectionHeaderFeatured]}
            onPress={() => toggleSection('motivation')}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionEmoji}>⭐</Text>
              <Text style={styles.sectionTitle}>Why Preparation Matters</Text>
            </View>
            <Text style={styles.toggleIcon}>{expandedSection === 'motivation' ? '−' : '+'}</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.sectionContent,
              expandedSection === 'motivation' && styles.sectionContentExpanded,
            ]}
          >
            <Text style={[styles.contentText, styles.boldText]}>
              A month of preparation sets you up for success.
            </Text>
            <Text style={styles.contentText}>
              Studies show that people who prepare for quitting are 3x more likely to succeed. Taking time now to plan will help you navigate challenges and stay committed.
            </Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• Identify your personal triggers</Text>
              <Text style={styles.listItem}>• Build your support network</Text>
              <Text style={styles.listItem}>• Develop coping strategies</Text>
              <Text style={styles.listItem}>• Remove temptations</Text>
              <Text style={styles.listItem}>• Plan for the first 48 hours</Text>
            </View>
            <View style={styles.motivationBox}>
              <Text style={styles.keyInsight}>
                "The best time to prepare for the climb is at the foot of the mountain." - Every
                step forward is progress.
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Assess Your Current Situation */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('assess')}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionEmoji}>🔍</Text>
              <Text style={styles.sectionTitle}>Assess Your Situation</Text>
            </View>
            <Text style={styles.toggleIcon}>{expandedSection === 'assess' ? '−' : '+'}</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.sectionContent,
              expandedSection === 'assess' && styles.sectionContentExpanded,
            ]}
          >
            <Text style={styles.contentText}>
              Understanding your current situation is crucial. Answer these questions honestly to create a personalized plan.
            </Text>

            {/* Frequency */}
            <View style={styles.checklistItemGroup}>
              <View style={styles.checklistItem}>
                <View style={styles.checkbox} />
                <Text style={styles.label}>How frequently do you use?</Text>
              </View>
              <TextInput
                style={styles.responseField}
                value={responses['assess_frequency'] || ''}
                onChangeText={(text) => handleResponseChange('assess_frequency', text)}
                placeholder="Daily, weekly, per occasion..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Money */}
            <View style={styles.checklistItemGroup}>
              <View style={styles.checklistItem}>
                <View style={styles.checkbox} />
                <Text style={styles.label}>How much money do you spend?</Text>
              </View>
              <TextInput
                style={styles.responseField}
                value={responses['assess_money'] || ''}
                onChangeText={(text) => handleResponseChange('assess_money', text)}
                placeholder="Weekly, monthly, or daily amount..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Time */}
            <View style={styles.checklistItemGroup}>
              <View style={styles.checklistItem}>
                <View style={styles.checkbox} />
                <Text style={styles.label}>How much time does it consume?</Text>
              </View>
              <TextInput
                style={styles.responseField}
                value={responses['assess_time'] || ''}
                onChangeText={(text) => handleResponseChange('assess_time', text)}
                placeholder="Hours per day, impact on work/relationships..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Triggers */}
            <View style={styles.checklistItemGroup}>
              <View style={styles.checklistItem}>
                <View style={styles.checkbox} />
                <Text style={styles.label}>What are your main triggers?</Text>
              </View>
              <TextInput
                style={styles.responseField}
                value={responses['assess_triggers'] || ''}
                onChangeText={(text) => handleResponseChange('assess_triggers', text)}
                placeholder="Stress, social situations, emotions..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Impact */}
            <View style={styles.checklistItemGroup}>
              <View style={styles.checklistItem}>
                <View style={styles.checkbox} />
                <Text style={styles.label}>What negative impact has it had?</Text>
              </View>
              <TextInput
                style={styles.responseField}
                value={responses['assess_impact'] || ''}
                onChangeText={(text) => handleResponseChange('assess_impact', text)}
                placeholder="Health, relationships, finances, career..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Obstacles */}
            <View style={styles.checklistItemGroup}>
              <View style={styles.checklistItem}>
                <View style={styles.checkbox} />
                <Text style={styles.label}>What obstacles do you expect?</Text>
              </View>
              <TextInput
                style={styles.responseField}
                value={responses['assess_obstacles'] || ''}
                onChangeText={(text) => handleResponseChange('assess_obstacles', text)}
                placeholder="Withdrawal symptoms, social pressure, environment..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                💡 Tip: Your responses are auto-saved. Be honest and detailed for a better recovery plan.
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Identify Your Triggers */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('triggers')}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionEmoji}>🎯</Text>
              <Text style={styles.sectionTitle}>Identify Triggers</Text>
            </View>
            <Text style={styles.toggleIcon}>{expandedSection === 'triggers' ? '−' : '+'}</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.sectionContent,
              expandedSection === 'triggers' && styles.sectionContentExpanded,
            ]}
          >
            <Text style={[styles.contentText, styles.boldText]}>
              Triggers are situations, emotions, or people that make you want to use.
            </Text>

            <View style={styles.triggerCategory}>
              <Text style={styles.triggerCategoryTitle}>Emotional Triggers</Text>
              <Text style={styles.triggerCategoryDescription}>
                Stress, anxiety, depression, boredom, or loneliness that make you seek relief through use.
              </Text>
            </View>

            <View style={styles.triggerCategory}>
              <Text style={styles.triggerCategoryTitle}>Social Triggers</Text>
              <Text style={styles.triggerCategoryDescription}>
                Friends, family members, or social situations where substance use is common.
              </Text>
            </View>

            <View style={styles.triggerCategory}>
              <Text style={styles.triggerCategoryTitle}>Environmental Triggers</Text>
              <Text style={styles.triggerCategoryDescription}>
                Specific places, times of day, or settings associated with your use patterns.
              </Text>
            </View>

            <View style={styles.triggerCategory}>
              <Text style={styles.triggerCategoryTitle}>Habitual Triggers</Text>
              <Text style={styles.triggerCategoryDescription}>
                Routines or habitual behaviors that automatically lead to use without conscious thought.
              </Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                Action: List your top 5 triggers from each category. Write them in the section above.
              </Text>
            </View>
          </View>
        </View>

        {/* 4. Build Your Support Network */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.sectionHeader, styles.sectionHeaderFeatured]}
            onPress={() => toggleSection('support')}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionEmoji}>🫂</Text>
              <Text style={styles.sectionTitle}>Support Network</Text>
            </View>
            <Text style={styles.toggleIcon}>{expandedSection === 'support' ? '−' : '+'}</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.sectionContent,
              expandedSection === 'support' && styles.sectionContentExpanded,
            ]}
          >
            <Text style={[styles.contentText, styles.boldText]}>
              You don't have to do this alone. Build your support network now.
            </Text>

            <View style={styles.supportType}>
              <Text style={styles.supportTypeTitle}>People Who Support You</Text>
              <Text style={styles.listItem}>• Supportive friends or family members</Text>
              <Text style={styles.listItem}>• Spouse or trusted partner</Text>
              <Text style={styles.listItem}>• Mentor or accountability buddy</Text>
            </View>

            <View style={styles.supportType}>
              <Text style={styles.supportTypeTitle}>Professional Resources</Text>
              <Text style={styles.listItem}>• Therapist or counselor</Text>
              <Text style={styles.listItem}>• Doctor or medical professional</Text>
              <Text style={styles.listItem}>• Addiction specialist</Text>
            </View>

            <View style={styles.supportType}>
              <Text style={styles.supportTypeTitle}>Support Groups</Text>
              <Text style={styles.listItem}>• AA, NA, or similar 12-step programs</Text>
              <Text style={styles.listItem}>• Online support communities</Text>
              <Text style={styles.listItem}>• Local recovery meetings</Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                Action: Contact at least one support resource this week and explain your goals.
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Plan Your Coping Strategies */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('coping')}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionEmoji}>🛠️</Text>
              <Text style={styles.sectionTitle}>Coping Strategies</Text>
            </View>
            <Text style={styles.toggleIcon}>{expandedSection === 'coping' ? '−' : '+'}</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.sectionContent,
              expandedSection === 'coping' && styles.sectionContentExpanded,
            ]}
          >
            <Text style={[styles.contentText, styles.boldText]}>
              Have healthy alternatives ready for when cravings strike.
            </Text>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Meditation & Mindfulness</Text>
              <Text style={styles.strategyDescription}>
                Use breathing exercises, meditation apps, or guided body scans to calm urges.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Physical Activity</Text>
              <Text style={styles.strategyDescription}>
                Exercise releases endorphins. Go for a walk, do yoga, or play sports.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Distraction Techniques</Text>
              <Text style={styles.strategyDescription}>
                Engage hobbies, call a friend, watch a movie, or take a cold shower.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Journaling</Text>
              <Text style={styles.strategyDescription}>
                Write about your feelings, triggers, and motivation to quit.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Emotional Processing</Text>
              <Text style={styles.strategyDescription}>
                Talk to someone, cry, or allow yourself to feel emotions without judgment.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Connection</Text>
              <Text style={styles.strategyDescription}>
                Spend quality time with loved ones who support your recovery.
              </Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                Action: Choose 2-3 coping strategies you'll use this week. Practice them today!
              </Text>
            </View>
          </View>
        </View>

        {/* 6. Remove Temptations */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('remove')}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionEmoji}>🗑️</Text>
              <Text style={styles.sectionTitle}>Remove Temptations</Text>
            </View>
            <Text style={styles.toggleIcon}>{expandedSection === 'remove' ? '−' : '+'}</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.sectionContent,
              expandedSection === 'remove' && styles.sectionContentExpanded,
            ]}
          >
            <Text style={[styles.contentText, styles.boldText]}>
              Clean your environment to remove access and reduce temptation.
            </Text>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>✓ Clean Your Space</Text>
              <Text style={styles.strategyDescription}>
                Remove all substances, paraphernalia, and reminders of your use from your home.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>✓ Delete Contacts</Text>
              <Text style={styles.strategyDescription}>
                Remove phone numbers of dealers, suppliers, or enablers. Consider blocking them.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>✓ Limit Money</Text>
              <Text style={styles.strategyDescription}>
                Have someone manage your finances or set strict spending limits initially.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>✓ Avoid Risky Places</Text>
              <Text style={styles.strategyDescription}>
                Steer clear of restaurants, bars, or venues associated with your use.
              </Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>✓ Create Distance</Text>
              <Text style={styles.strategyDescription}>
                Distance yourself from people who enable or encourage your use patterns.
              </Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                Action: Spend this weekend cleaning your space and setting up your environment for success.
              </Text>
            </View>
          </View>
        </View>

        {/* 7. First 48 Hours */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.sectionHeader, styles.sectionHeaderFeatured]}
            onPress={() => toggleSection('48hours')}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionEmoji}>⏰</Text>
              <Text style={styles.sectionTitle}>Plan Your First 48 Hours</Text>
            </View>
            <Text style={styles.toggleIcon}>{expandedSection === '48hours' ? '−' : '+'}</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.sectionContent,
              expandedSection === '48hours' && styles.sectionContentExpanded,
            ]}
          >
            <Text style={[styles.contentText, styles.boldText]}>
              The first 48 hours are critical. Plan them hour-by-hour if needed.
            </Text>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>24 Hours Before Quit Date</Text>
              <Text style={styles.listItem}>• Tell your support network you're starting tomorrow</Text>
              <Text style={styles.listItem}>• Get a good night's sleep</Text>
              <Text style={styles.listItem}>• Stock up on healthy snacks</Text>
              <Text style={styles.listItem}>• Plan tomorrow's activities</Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>First 24 Hours</Text>
              <Text style={styles.listItem}>• Wake up and remind yourself: "I'm choosing freedom"</Text>
              <Text style={styles.listItem}>• Exercise for 30+ minutes</Text>
              <Text style={styles.listItem}>• Call a support person morning and evening</Text>
              <Text style={styles.listItem}>• Stay busy with planned activities</Text>
              <Text style={styles.listItem}>• Use coping strategies when cravings hit</Text>
            </View>

            <View style={styles.strategy}>
              <Text style={styles.strategyTitle}>Second 24 Hours</Text>
              <Text style={styles.listItem}>• Celebrate making it through day one!</Text>
              <Text style={styles.listItem}>• Continue support network connection</Text>
              <Text style={styles.listItem}>• Practice new healthy habits</Text>
              <Text style={styles.listItem}>• Reflect and journal about your progress</Text>
            </View>

            <View style={styles.motivationBox}>
              <Text style={styles.keyInsight}>
                "Just for today, I choose myself. Tomorrow, I'll choose myself again."
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Saving Indicator */}
      {saving && (
        <View style={styles.savingIndicator}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={styles.savingText}>Saving...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PreparationPlanScreen;
