import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelfAssessment } from '../context/SelfAssessmentContext';
import { useAddiction } from '../context/AddictionContext';
import { useTheme } from '../context/DarkModeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ASSESSMENT_QUESTIONS = [
  {
    id: 'frequency',
    text: 'How often do you use?',
    options: [
      { label: 'Never', score: 0 },
      { label: 'Rarely (few times a year)', score: 1 },
      { label: 'Sometimes (few times a month)', score: 2 },
      { label: 'Often (few times a week)', score: 3 },
      { label: 'Very often (daily or multiple times daily)', score: 4 },
    ],
  },
  {
    id: 'control',
    text: 'Can you control your use?',
    options: [
      { label: 'Complete control - can stop anytime', score: 0 },
      { label: 'Mostly in control - occasional lapses', score: 1 },
      { label: 'Some control - frequent loss of control', score: 2 },
      { label: 'Little control - often unable to stop', score: 3 },
      { label: 'No control - cannot stop even when trying', score: 4 },
    ],
  },
  {
    id: 'impact',
    text: 'How much has it impacted your life?',
    options: [
      { label: 'No impact', score: 0 },
      { label: 'Minimal impact - some minor issues', score: 1 },
      { label: 'Moderate impact - noticeable problems', score: 2 },
      { label: 'Significant impact - major disruptions', score: 3 },
      { label: 'Severe impact - devastating consequences', score: 4 },
    ],
  },
  {
    id: 'health',
    text: 'What is your physical health status?',
    options: [
      { label: 'Excellent - no health issues', score: 0 },
      { label: 'Good - minor health concerns', score: 1 },
      { label: 'Fair - noticeable health problems', score: 2 },
      { label: 'Poor - significant health complications', score: 3 },
      { label: 'Critical - severe/life-threatening issues', score: 4 },
    ],
  },
  {
    id: 'tolerance',
    text: 'Do you need more of the substance to feel the same effect?',
    options: [
      { label: 'No tolerance build-up', score: 0 },
      { label: 'Slight tolerance - small increase needed', score: 1 },
      { label: 'Moderate tolerance - noticeable increase needed', score: 2 },
      { label: 'High tolerance - significant increase needed', score: 3 },
      { label: 'Extreme tolerance - must use large amounts', score: 4 },
    ],
  },
  {
    id: 'withdrawal',
    text: 'Do you experience withdrawal symptoms when not using?',
    options: [
      { label: 'None - no symptoms at all', score: 0 },
      { label: 'Mild - minor discomfort', score: 1 },
      { label: 'Moderate - noticeable symptoms', score: 2 },
      { label: 'Severe - significant distress', score: 3 },
      { label: 'Extreme - unbearable symptoms', score: 4 },
    ],
  },
  {
    id: 'relationships',
    text: 'How has this affected your relationships?',
    options: [
      { label: 'No impact on relationships', score: 0 },
      { label: 'Minor strain - occasional tension', score: 1 },
      { label: 'Moderate damage - some relationships strained', score: 2 },
      { label: 'Significant damage - important relationships affected', score: 3 },
      { label: 'Severe - relationships destroyed or at breaking point', score: 4 },
    ],
  },
  {
    id: 'financial',
    text: 'What is the financial impact?',
    options: [
      { label: 'No financial impact', score: 0 },
      { label: 'Minimal - less than 5% of income', score: 1 },
      { label: 'Moderate - 5-15% of income', score: 2 },
      { label: 'Significant - 15-30% of income', score: 3 },
      { label: 'Severe - more than 30% of income or in debt', score: 4 },
    ],
  },
  {
    id: 'motivation',
    text: 'How motivated are you to change?',
    options: [
      { label: 'Very motivated - ready to make changes', score: 4 },
      { label: 'Somewhat motivated - considering change', score: 3 },
      { label: 'Neutral - unsure about change', score: 2 },
      { label: 'Low motivation - resistant to change', score: 1 },
      { label: 'No motivation - not interested in change', score: 0 },
    ],
  },
];

const SEVERITY_LEVELS = {
  minimal: { min: 0, max: 8, label: 'Minimal Risk', color: '#22c55e', description: 'Low severity - consider preventive measures' },
  mild: { min: 9, max: 16, label: 'Mild', color: '#84cc16', description: 'Mild severity - intervention recommended' },
  moderate: { min: 17, max: 24, label: 'Moderate', color: '#f59e0b', description: 'Moderate severity - professional help advised' },
  substantial: { min: 25, max: 32, label: 'Substantial', color: '#ef4444', description: 'Substantial severity - urgent intervention needed' },
  severe: { min: 33, max: 36, label: 'Severe', color: '#dc2626', description: 'Severe addiction - seek professional help immediately' },
};

const SelfAssessmentScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const { assessments, currentAssessment, loading, loadAssessments, createAssessment, getLatestAssessment } = useSelfAssessment();
  const { addictions } = useAddiction();

  const [selectedAddictionId, setSelectedAddictionId] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

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
    progressContainer: {
      marginBottom: 24,
      paddingHorizontal: 16,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.primary + '20',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },
    progressText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    questionCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    questionNumber: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '600',
      marginBottom: 8,
    },
    questionText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      lineHeight: 22,
    },
    optionButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: colors.primary + '30',
      backgroundColor: colors.background,
    },
    optionButtonSelected: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    optionText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonPrimary: {
      backgroundColor: colors.primary,
    },
    buttonSecondary: {
      backgroundColor: colors.cardBg,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      color: 'white',
    },
    buttonTextSecondary: {
      color: colors.primary,
    },
    resultsContainer: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    severityBadge: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      marginBottom: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    severityLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: 'white',
    },
    scoreDisplay: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    scoreMax: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
    },
    description: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      marginBottom: 12,
      textAlign: 'center',
    },
    recommendation: {
      backgroundColor: colors.primary + '15',
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      marginTop: 12,
    },
    recommendationText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '500',
      lineHeight: 18,
    },
    historySection: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 16,
      marginTop: 20,
    },
    historyTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    historyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary + '20',
    },
    historyDate: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    historyScore: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.primary,
    },
    restartButton: {
      marginTop: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.primary + '20',
      borderRadius: 8,
      alignItems: 'center',
    },
    restartButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      if (selectedAddictionId) {
        loadData();
      }
    }, [selectedAddictionId])
  );

  const loadData = async () => {
    try {
      await getLatestAssessment(selectedAddictionId);
    } catch (error) {
      console.error('Error loading assessment data:', error);
    }
  };

  const handleAnswerSelect = (score) => {
    setResponses({
      ...responses,
      [ASSESSMENT_QUESTIONS[currentQuestionIndex].id]: score,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(responses).length !== ASSESSMENT_QUESTIONS.length) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting');
      return;
    }

    const score = Object.values(responses).reduce((sum, val) => sum + val, 0);
    setTotalScore(score);
    setShowResults(true);

    // Save assessment
    try {
      setSubmitting(true);
      await createAssessment(selectedAddictionId, responses, score);
    } catch (error) {
      console.error('Error saving assessment:', error);
      Alert.alert('Error', 'Failed to save assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setResponses({});
    setShowResults(false);
    setTotalScore(0);
  };

  const getSeverityLevel = (score) => {
    for (const [key, level] of Object.entries(SEVERITY_LEVELS)) {
      if (score >= level.min && score <= level.max) {
        return level;
      }
    }
    return SEVERITY_LEVELS.severe;
  };

  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const selectedResponse = responses[currentQuestion.id];
  const progress = (Object.keys(responses).length / ASSESSMENT_QUESTIONS.length) * 100;

  if (!selectedAddictionId) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>📋 Self-Assessment</Text>
            <Text style={styles.subtitle}>Evaluate your relationship with your addiction</Text>
          </View>

          <View style={styles.addictionSelector}>
            <Text style={styles.addictionLabel}>Select Addiction:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {addictions && addictions.map((addiction) => (
                <TouchableOpacity
                  key={addiction.id}
                  style={[
                    styles.addictionButton,
                    styles.addictionButtonInactive,
                  ]}
                  onPress={() => setSelectedAddictionId(addiction.id)}
                >
                  <Text
                    style={[
                      styles.addictionButtonText,
                      styles.addictionButtonTextInactive,
                    ]}
                  >
                    {addiction.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (showResults) {
    const severity = getSeverityLevel(totalScore);
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Assessment Results</Text>
          </View>

          <View style={styles.resultsContainer}>
            <View style={[styles.severityBadge, { backgroundColor: severity.color }]}>
              <Text style={styles.severityLabel}>{severity.label}</Text>
            </View>

            <Text style={styles.scoreDisplay}>{totalScore}</Text>
            <Text style={styles.scoreMax}>out of 36 points</Text>
            <Text style={styles.description}>{severity.description}</Text>

            <View style={styles.recommendation}>
              <Text style={styles.recommendationText}>
                {severity.label === 'Minimal Risk' && '✓ Keep up good habits and avoid escalation.'}
                {severity.label === 'Mild' && '⚠ Consider making proactive changes to prevent escalation.'}
                {severity.label === 'Moderate' && '⚠ Professional intervention is recommended to prevent worsening.'}
                {severity.label === 'Substantial' && '🔴 Seek professional help immediately. Your situation requires expert support.'}
                {severity.label === 'Severe' && '🆘 URGENT: Please contact a healthcare provider or addiction specialist immediately.'}
              </Text>
            </View>
          </View>

          {currentAssessment && (
            <View style={styles.historySection}>
              <Text style={styles.historyTitle}>Previous Assessments</Text>
              {assessments && assessments.slice(0, 5).map((assessment) => (
                <View key={assessment.id} style={styles.historyItem}>
                  <Text style={styles.historyDate}>
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyScore}>
                    {assessment.score} points - {getSeverityLevel(assessment.score).label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>Take Assessment Again</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Self-Assessment</Text>
          <Text style={styles.subtitle}>Honest answers help provide accurate results</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}
          </Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            Question {currentQuestionIndex + 1}
          </Text>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>

          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedResponse === option.score && styles.optionButtonSelected,
              ]}
              onPress={() => handleAnswerSelect(option.score)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedResponse === option.score && { color: colors.primary, fontWeight: '700' },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>← Back</Text>
          </TouchableOpacity>

          {currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1 ? (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleSubmit}
              disabled={submitting || Object.keys(responses).length !== ASSESSMENT_QUESTIONS.length}
            >
              {submitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleNext}
              disabled={!selectedResponse}
            >
              <Text style={styles.buttonText}>Next →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelfAssessmentScreen;
