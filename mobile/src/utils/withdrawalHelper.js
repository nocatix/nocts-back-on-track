// Withdrawal timelines for different addictions (in days)
const WITHDRAWAL_TIMELINES = {
  nicotine: {
    severe: 3,
    moderate: 7,
    mild: 14,
    recovery: 30,
  },
  alcohol: {
    severe: 7,
    moderate: 14,
    mild: 30,
    recovery: 90,
  },
  cannabis: {
    severe: 2,
    moderate: 7,
    mild: 21,
    recovery: 60,
  },
  hardDrugs: {
    severe: 10,
    moderate: 21,
    mild: 45,
    recovery: 180,
  },
  coffee: {
    severe: 1,
    moderate: 3,
    mild: 7,
    recovery: 14,
  },
  sugar: {
    severe: 3,
    moderate: 7,
    mild: 14,
    recovery: 30,
  },
  socialMedia: {
    severe: 2,
    moderate: 7,
    mild: 14,
    recovery: 30,
  },
  videoGames: {
    severe: 3,
    moderate: 10,
    mild: 21,
    recovery: 45,
  },
  gambling: {
    severe: 7,
    moderate: 14,
    mild: 30,
    recovery: 90,
  },
  pornography: {
    severe: 5,
    moderate: 14,
    mild: 30,
    recovery: 90,
  },
  shopping: {
    severe: 3,
    moderate: 7,
    mild: 14,
    recovery: 30,
  },
  overeating: {
    severe: 3,
    moderate: 14,
    mild: 30,
    recovery: 60,
  },
  doomscrolling: {
    severe: 2,
    moderate: 7,
    mild: 14,  recovery: 28,
  },
};

// Common withdrawal symptoms by addiction type
const WITHDRAWAL_SYMPTOMS = {
  nicotine: [
    'Irritability',
    'Anxiety',
    'Difficulty concentrating',
    'Increased appetite',
    'Insomnia',
  ],
  alcohol: [
    'Tremors',
    'Sweating',
    'Anxiety',
    'Insomnia',
    'Headaches',
  ],
  cannabis: [
    'Irritability',
    'Anxiety',
    'Sleep problems',
    'Decreased appetite',
    'Restlessness',
  ],
  coffee: [
    'Headaches',
    'Fatigue',
    'Difficulty concentrating',
    'Anxiety',
    'Irritability',
  ],
  sugar: [
    'Fatigue',
    'Mood swings',
    'Headaches',
    'Cravings',
    'Anxiety',
  ],
};

export const withdrawalHelper = {
  getTimeline(addictionType) {
    return WITHDRAWAL_TIMELINES[addictionType] || null;
  },

  getSymptoms(addictionType) {
    return WITHDRAWAL_SYMPTOMS[addictionType] || [];
  },

  calculateDaysSinceStart(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  getPhaseByDays(addictionType, days) {
    const timeline = WITHDRAWAL_TIMELINES[addictionType];
    if (!timeline) return 'unknown';

    if (days <= timeline.severe) return 'severe';
    if (days <= timeline.moderate) return 'moderate';
    if (days <= timeline.mild) return 'mild';
    if (days <= timeline.recovery) return 'recovery';
    return 'recovered';
  },

  getPhaseDescription(phase) {
    const descriptions = {
      severe: 'Critical withdrawal phase - most intense symptoms',
      moderate: 'Moderate withdrawal - symptoms improving',
      mild: 'Mild withdrawal - light symptoms',
      recovery: 'Recovery phase - significant improvement',
      recovered: 'Recovered - congratulations!',
      unknown: 'Unknown phase',
    };
    return descriptions[phase] || descriptions.unknown;
  },

  calculatePercentageComplete(addictionType, startDate) {
    const timeline = WITHDRAWAL_TIMELINES[addictionType];
    if (!timeline) return 0;

    const days = this.calculateDaysSinceStart(startDate);
    const totalDays = timeline.recovery;
    const percentage = Math.min((days / totalDays) * 100, 100);
    return Math.round(percentage);
  },

  getMotivationalMessage(phase, days) {
    const messages = {
      severe: 'Stay strong! The first few days are the hardest. You\'ve got this!',
      moderate:
        'Great progress! You\'re through the worst of it. Keep going!',
      mild: 'You\'re doing amazing! Just a little bit more to go.',
      recovery: 'Incredible! You\'ve made it through withdrawal. Stay vigilant!',
      recovered:
        'Congratulations! You\'ve completed withdrawal. Now maintain your recovery!',
    };
    return messages[phase] || 'Keep pushing forward!';
  },
};

export default withdrawalHelper;
