// Withdrawal timelines for different addictions
const withdrawalTimelines = {
  nicotine: [
    { day: 1, symptom: 'Intense cravings, irritability, anxiety', difficulty: 'Extreme' },
    { day: 3, symptom: 'Peak cravings reduced, still very irritable', difficulty: 'Very High' },
    { day: 5, symptom: 'Cravings becoming more manageable', difficulty: 'High' },
    { day: 7, symptom: 'Sleep issues, mood swings', difficulty: 'High' },
    { day: 14, symptom: 'Cravings reduced by 50-70%, some anxiety remains', difficulty: 'Medium' },
    { day: 30, symptom: 'Significant improvement, occasional triggers', difficulty: 'Low-Medium' },
    { day: 60, symptom: 'Most symptoms gone, occasional cravings', difficulty: 'Low' },
    { day: 90, symptom: 'Psychological dependence fading', difficulty: 'Very Low' },
    { day: 365, symptom: 'Typically free from withdrawal symptoms', difficulty: 'Minimal' }
  ],
  alcohol: [
    { day: 1, symptom: 'Autonomic hyperactivity, confusion, tremors', difficulty: 'Extreme' },
    { day: 3, symptom: 'Severe anxiety, sleep disruption, sweating', difficulty: 'Extreme' },
    { day: 7, symptom: 'Withdrawal peak passes, lingering symptoms', difficulty: 'Very High' },
    { day: 14, symptom: 'Anxiety and sleep issues persist', difficulty: 'High' },
    { day: 30, symptom: 'Major improvement, occasional cravings', difficulty: 'Medium' },
    { day: 90, symptom: 'Mostly symptom-free, psychological work ongoing', difficulty: 'Low' },
    { day: 180, symptom: 'Significant emotional and physical recovery', difficulty: 'Very Low' },
    { day: 365, symptom: 'Full recovery possible with support and habits', difficulty: 'Minimal' }
  ],
  cannabis: [
    { day: 1, symptom: 'Irritability, anxiety, sleep issues', difficulty: 'High' },
    { day: 3, symptom: 'Intense cravings, mood swings, insomnia', difficulty: 'Very High' },
    { day: 7, symptom: 'Peak symptoms, emotional intensity', difficulty: 'Very High' },
    { day: 14, symptom: 'Gradual improvement, but cravings linger', difficulty: 'High' },
    { day: 30, symptom: 'Major symptom improvement, occasional cravings', difficulty: 'Medium' },
    { day: 60, symptom: 'Mostly symptom-free, psychological work continues', difficulty: 'Low' },
    { day: 90, symptom: 'Strong recovery progress', difficulty: 'Low' },
    { day: 180, symptom: 'Significant psychological and physical recovery', difficulty: 'Minimal' }
  ],
  other: [
    { day: 1, symptom: 'Initial cravings and withdrawal symptoms', difficulty: 'High' },
    { day: 7, symptom: 'Symptoms peak, requires strong support', difficulty: 'Very High' },
    { day: 30, symptom: 'Significant improvement as brain chemistry rebalances', difficulty: 'Medium' },
    { day: 90, symptom: 'Major progress, emotional balance returning', difficulty: 'Low' },
    { day: 180, symptom: 'Strong recovery evident', difficulty: 'Minimal' },
    { day: 365, symptom: 'Sustained recovery and new habits established', difficulty: 'Minimal' }
  ]
};

const tips = {
  nicotine: [
    '💪 Exercise for 10-15 minutes when cravings hit - it relieves stress naturally',
    '🥤 Drink water and chew gum to keep your mouth occupied',
    '🧘 Practice deep breathing - 4 seconds in, hold for 4, out for 4',
    '🚶 Take a walk or change your environment to break the pattern',
    '☕ Find a nicotine-free substitute ritual (tea, coffee, gum)',
    '📱 Call a friend or text your support network'
  ],
  alcohol: [
    '🍎 Eat regular meals to keep blood sugar stable',
    '💧 Stay hydrated - dehydration increases cravings',
    '🏃 Exercise releases endorphins that reduce cravings naturally',
    '🛏️ Prioritize 8 hours of sleep - fatigue triggers cravings',
    '👥 Avoid people/places associated with drinking',
    '🎯 Replace drinking time with a new hobby or activity'
  ],
  cannabis: [
    '🎮 Keep yourself busy with hobbies and activities',
    '💪 Regular exercise helps reset your dopamine system',
    '🧘 Meditation helps manage anxiety and cravings',
    '🚫 Remove triggers from your environment (paraphernalia, etc)',
    '👨‍👩‍👧 Spend time with supportive friends who won\'t use',
    '📚 Learn about cannabis and its effects to stay motivated'
  ],
  other: [
    '💪 Stay active - exercise is a powerful natural antidote',
    '🧘 Practice mindfulness to manage urges',
    '👥 Reach out to your support network immediately',
    '🎵 Use music or activities you enjoy to distract',
    '📝 Journal about your feelings and triggers',
    '💤 Get quality sleep to support your recovery'
  ]
};

export const calculateDailyPredictions = (addictions) => {
  if (!addictions || addictions.length === 0) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return addictions.map(addiction => {
    const stopDate = new Date(addiction.stopDate);
    stopDate.setHours(0, 0, 0, 0);
    
    const daysSoFar = Math.floor((today - stopDate) / (1000 * 60 * 60 * 24));
    const addictionType = addiction.name.toLowerCase();
    const timeline = withdrawalTimelines[addictionType] || withdrawalTimelines.other;
    const addictionTips = tips[addictionType] || tips.other;

    // Find the current withdrawal stage
    let currentStage = timeline[timeline.length - 1];
    for (let stage of timeline) {
      if (daysSoFar <= stage.day) {
        currentStage = stage;
        break;
      }
    }

    // Get random tip for today
    const randomTip = addictionTips[Math.floor(Math.random() * addictionTips.length)];

    return {
      name: addiction.name,
      daysSoFar,
      stage: currentStage,
      tip: randomTip,
      moneySpent: addiction.moneySpentPerDay,
      frequencyPerDay: addiction.frequencyPerDay
    };
  });
};

export const formatDayCount = (days) => {
  if (days < 1) return 'Less than 1 day';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days === 7) return '1 week';
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  if (days === 30) return '1 month';
  if (days < 365) return `${Math.floor(days / 30)} months`;
  return `${Math.floor(days / 365)} years`;
};
