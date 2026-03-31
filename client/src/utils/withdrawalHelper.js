import { addictionDatabase } from '../data/addictions/index';

// Convert database for legacy compatibility
const createWithdrawalTimelines = () => {
  const timelines = {};
  Object.entries(addictionDatabase).forEach(([key, addiction]) => {
    const lowerKey = key.toLowerCase();
    timelines[lowerKey] = Object.entries(addiction.withdrawalTimeline).map(([dayKey, data]) => ({
      day: parseInt(dayKey.replace('day', '')),
      symptom: data.symptom,
      tip: data.tip,
      difficulty: 'Medium'
    }));
  });
  return timelines;
};

// Create tips from addiction database
const createTips = () => {
  const tipsMap = {};
  Object.entries(addictionDatabase).forEach(([key, addiction]) => {
    const lowerKey = key.toLowerCase();
    const tips = [];
    Object.values(addiction.withdrawalTimeline).forEach(data => {
      tips.push(data.tip);
    });
    tipsMap[lowerKey] = tips.length > 0 ? tips : ['Stay strong and focused on your recovery.'];
  });
  return tipsMap;
};

const withdrawalTimelines = createWithdrawalTimelines();
const tips = createTips();

// Legacy support - keeping old structure reference
const _oldWithdrawalTimelines = {
  '🍺 alcohol': [
    { day: 1, symptom: 'Autonomic hyperactivity, confusion, tremors', difficulty: 'Extreme' },
    { day: 3, symptom: 'Severe anxiety, sleep disruption, sweating', difficulty: 'Extreme' },
    { day: 7, symptom: 'Withdrawal peak passes, lingering symptoms', difficulty: 'Very High' },
    { day: 14, symptom: 'Anxiety and sleep issues persist', difficulty: 'High' },
    { day: 30, symptom: 'Major improvement, occasional cravings', difficulty: 'Medium' },
    { day: 90, symptom: 'Mostly symptom-free, psychological work ongoing', difficulty: 'Low' },
    { day: 180, symptom: 'Significant emotional and physical recovery', difficulty: 'Very Low' },
    { day: 365, symptom: 'Full recovery possible with support and habits', difficulty: 'Minimal' }
  ],
  '🌿 cannabis': [
    { day: 1, symptom: 'Irritability, anxiety, sleep issues', difficulty: 'High' },
    { day: 3, symptom: 'Intense cravings, mood swings, insomnia', difficulty: 'Very High' },
    { day: 7, symptom: 'Peak symptoms, emotional intensity', difficulty: 'Very High' },
    { day: 14, symptom: 'Gradual improvement, but cravings linger', difficulty: 'High' },
    { day: 30, symptom: 'Major symptom improvement, occasional cravings', difficulty: 'Medium' },
    { day: 60, symptom: 'Mostly symptom-free, psychological work continues', difficulty: 'Low' },
    { day: 90, symptom: 'Strong recovery progress', difficulty: 'Low' },
    { day: 180, symptom: 'Significant psychological and physical recovery', difficulty: 'Minimal' }
  ],
  '💉 hard drugs': [
    { day: 1, symptom: 'Intense cravings, depression, anxiety, physical symptoms', difficulty: 'Extreme' },
    { day: 3, symptom: 'Peak withdrawal: severe anhedonia, mood crash, pain possible', difficulty: 'Extreme' },
    { day: 5, symptom: 'Withdrawal severe, psychological despair, fatigue intense', difficulty: 'Extreme' },
    { day: 7, symptom: 'Symptoms still very strong, support critical', difficulty: 'Very High' },
    { day: 14, symptom: 'Physical symptoms improving, psychological work ongoing', difficulty: 'Very High' },
    { day: 30, symptom: 'Acute symptoms pass, brain chemistry rebalancing', difficulty: 'High' },
    { day: 90, symptom: 'Major progress, dopamine receptors healing', difficulty: 'Medium' },
    { day: 180, symptom: 'Strong recovery, emotional stability improving', difficulty: 'Low' },
    { day: 365, symptom: 'Full recovery possible with sustained professional support', difficulty: 'Minimal' }
  ],
  '🚬 nicotine': [
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
  '🎰 gambling': [
    { day: 1, symptom: 'Intense urges, anxiety, restlessness', difficulty: 'High' },
    { day: 3, symptom: 'Peak cravings, irritability, boredom intolerance', difficulty: 'Very High' },
    { day: 7, symptom: 'Cravings very strong, financial anxiety', difficulty: 'Very High' },
    { day: 14, symptom: 'Urges persist but feeling more control', difficulty: 'High' },
    { day: 30, symptom: 'Major improvements in impulse control', difficulty: 'Medium' },
    { day: 90, symptom: 'Cravings rare, new coping strategies solid', difficulty: 'Low' },
    { day: 180, symptom: 'Strong recovery, rebuilding financially', difficulty: 'Very Low' },
    { day: 365, symptom: 'Full recovery, new healthy habits established', difficulty: 'Minimal' }
  ],
  '📱 social media': [
    { day: 1, symptom: 'Anxiety, boredom, phantom buzzes', difficulty: 'High' },
    { day: 3, symptom: 'Intense urges, FOMO, restlessness', difficulty: 'Very High' },
    { day: 7, symptom: 'Peak cravings, difficulty focusing', difficulty: 'Very High' },
    { day: 14, symptom: 'Urges reducing, attention span improving', difficulty: 'Medium' },
    { day: 30, symptom: 'Cravings mostly gone, better focus', difficulty: 'Medium' },
    { day: 90, symptom: 'Strong habit formation without apps', difficulty: 'Low' },
    { day: 180, symptom: 'Relationships and attention span significantly better', difficulty: 'Minimal' },
    { day: 365, symptom: 'Sustained recovery, mindful technology use', difficulty: 'Minimal' }
  ],
  '📰 doomscrolling': [
    { day: 1, symptom: 'Anxiety reduction, FOMO, restlessness', difficulty: 'Medium' },
    { day: 3, symptom: 'Urges to check news, anxiety cycling', difficulty: 'High' },
    { day: 7, symptom: 'Peak cravings for consuming content', difficulty: 'High' },
    { day: 14, symptom: 'Reduced anxiety patterns, better sleep', difficulty: 'Medium' },
    { day: 30, symptom: 'Significant anxiety reduction overall', difficulty: 'Low-Medium' },
    { day: 90, symptom: 'Mental clarity improving, mood more stable', difficulty: 'Low' },
    { day: 180, symptom: 'News avoidance becoming easier, peace returning', difficulty: 'Very Low' },
    { day: 365, symptom: 'Balanced news consumption, mental health strong', difficulty: 'Minimal' }
  ],
  '🎮 video games': [
    { day: 1, symptom: 'Boredom, restlessness, urges to play', difficulty: 'High' },
    { day: 3, symptom: 'Intense cravings, difficulty without gaming', difficulty: 'Very High' },
    { day: 7, symptom: 'Peak withdrawal, social anxiety, boredom intolerance', difficulty: 'Very High' },
    { day: 14, symptom: 'Cravings persist, new activities help', difficulty: 'High' },
    { day: 30, symptom: 'Significant improvement, new hobbies developing', difficulty: 'Medium' },
    { day: 90, symptom: 'Strong progress, social connections rebuilding', difficulty: 'Low' },
    { day: 180, symptom: 'Recovery solid, real-world activities rewarding', difficulty: 'Very Low' },
    { day: 365, symptom: 'Healthy balance maintained, life satisfaction high', difficulty: 'Minimal' }
  ],
  '🔞 pornography': [
    { day: 1, symptom: 'Urges extremely intense, anxiety', difficulty: 'Extreme' },
    { day: 3, symptom: 'Peak cravings, mood swings, shame cycles', difficulty: 'Very High' },
    { day: 7, symptom: 'Cravings very strong, flatline beginning', difficulty: 'Very High' },
    { day: 14, symptom: 'Withdrawal serious, brain chemistry adjusting', difficulty: 'High' },
    { day: 30, symptom: 'Significant progress, some urges remain', difficulty: 'Medium' },
    { day: 90, symptom: 'Strong recovery, dopamine receptors healing', difficulty: 'Low' },
    { day: 180, symptom: 'Major improvement in mood and relationships', difficulty: 'Very Low' },
    { day: 365, symptom: 'Full recovery, healthy sexual expression restored', difficulty: 'Minimal' }
  ],
  '🛍️ shopping': [
    { day: 1, symptom: 'Urges to shop, mild anxiety', difficulty: 'Medium' },
    { day: 3, symptom: 'Intense shopping urges, boredom', difficulty: 'High' },
    { day: 7, symptom: 'Peak cravings, financial anxiety reducing', difficulty: 'High' },
    { day: 14, symptom: 'Urges reduce, new spending habits forming', difficulty: 'Medium' },
    { day: 30, symptom: 'Significant progress, temptation less intense', difficulty: 'Low-Medium' },
    { day: 90, symptom: 'New purchasing habits solidifying', difficulty: 'Low' },
    { day: 180, symptom: 'Financial stability returning, peace with money', difficulty: 'Very Low' },
    { day: 365, symptom: 'Healthy gratification patterns established', difficulty: 'Minimal' }
  ],
  '🍬 sugar': [
    { day: 1, symptom: 'Cravings intense, irritability, headaches possible', difficulty: 'High' },
    { day: 3, symptom: 'Peak withdrawal: fatigue, mood swings, strong cravings', difficulty: 'High' },
    { day: 7, symptom: 'Cravings easing, energy levels stabilizing', difficulty: 'Medium' },
    { day: 14, symptom: 'Energy improving, mood more stable', difficulty: 'Medium' },
    { day: 30, symptom: 'Major improvements in energy and mood', difficulty: 'Low-Medium' },
    { day: 90, symptom: 'New habits solid, cravings rare', difficulty: 'Low' },
    { day: 180, symptom: 'Health improvements evident, taste buds changing', difficulty: 'Minimal' },
    { day: 365, symptom: 'Sustained health improvements, balanced diet normal', difficulty: 'Minimal' }
  ],
  '☕ coffee': [
    { day: 1, symptom: 'Mild headache, fatigue, irritability', difficulty: 'Low' },
    { day: 3, symptom: 'Headache peak, fatigue, brain fog', difficulty: 'Medium' },
    { day: 5, symptom: 'Severe headache possible, energy very low', difficulty: 'Medium' },
    { day: 7, symptom: 'Headaches subside, energy returning slowly', difficulty: 'Low-Medium' },
    { day: 14, symptom: 'Most withdrawal passed, energy normalized', difficulty: 'Low' },
    { day: 30, symptom: 'Full energy levels without caffeine', difficulty: 'Very Low' },
    { day: 90, symptom: 'Sleep quality likely improved', difficulty: 'Minimal' },
    { day: 365, symptom: 'Sustained without caffeine, better sleep', difficulty: 'Minimal' }
  ],
  '🍽️ overeating': [
    { day: 1, symptom: 'Urges to eat emotionally, habit disrupted', difficulty: 'High' },
    { day: 3, symptom: 'Intense food cravings, emotional eating urges', difficulty: 'Very High' },
    { day: 7, symptom: 'Peak cravings, emotional regulation challenging', difficulty: 'High' },
    { day: 14, symptom: 'Appetite normalizing, better hunger cues', difficulty: 'Medium' },
    { day: 30, symptom: 'Significant improvement, healthier eating patterns', difficulty: 'Medium' },
    { day: 90, symptom: 'New habits solid, weight stabilizing', difficulty: 'Low' },
    { day: 180, symptom: 'Health markers improving, energy up', difficulty: 'Very Low' },
    { day: 365, symptom: 'Sustained healthy relationship with food', difficulty: 'Minimal' }
  ],
  '❓ other': [
    { day: 1, symptom: 'Initial cravings and withdrawal symptoms', difficulty: 'High' },
    { day: 7, symptom: 'Symptoms peak, requires strong support', difficulty: 'Very High' },
    { day: 30, symptom: 'Significant improvement as brain chemistry rebalances', difficulty: 'Medium' },
    { day: 90, symptom: 'Major progress, emotional balance returning', difficulty: 'Low' },
    { day: 180, symptom: 'Strong recovery evident', difficulty: 'Minimal' },
    { day: 365, symptom: 'Sustained recovery and new habits established', difficulty: 'Minimal' }
  ]
};

/**
 * Legacy hardcoded data kept for reference - data now loaded from modular addiction files
 */
// Old tips data has been removed - now loaded from modular addiction files in /data/addictions/

export const calculateDailyPredictions = (addictions) => {
  if (!addictions || addictions.length === 0) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return addictions.map(addiction => {
    const stopDate = new Date(addiction.stopDate);
    stopDate.setHours(0, 0, 0, 0);
    
    const daysSoFar = Math.floor((today - stopDate) / (1000 * 60 * 60 * 24)) - 1;
    const addictionType = addiction.name.toLowerCase();
    const timeline = withdrawalTimelines[addictionType] || withdrawalTimelines['❓ other'];
    const addictionTips = tips[addictionType] || tips['❓ other'];

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

export const getFrequencyLabel = (addictionName) => {
  const addiction = addictionDatabase[addictionName];
  return addiction ? addiction.frequencyLabel : 'times per day';
};

export const getCostLabel = (addictionName) => {
  const addiction = addictionDatabase[addictionName];
  return addiction ? addiction.costLabel : '$ per use';
};
