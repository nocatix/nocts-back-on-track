/**
 * Withdrawal Helper Utilities
 * Provides addiction-specific frequency labels, cost labels, and recovery tips
 * Data is imported from modular addiction files for better maintainability
 */

import { addictionDatabase } from '../data/addictions/index';

/**
 * Generate withdrawal timelines from the addiction database
 * Uses the withdrawalTimeline from each individual addiction file
 * @returns {Object} Map of addiction names to timeline objects
 */
const createWithdrawalTimelines = () => {
  const timelines = {};
  Object.entries(addictionDatabase).forEach(([adictionName, addiction]) => {
    // Store the withdrawal timeline directly from the addiction file
    timelines[adictionName.toLowerCase()] = addiction.withdrawalTimeline;
  });
  return timelines;
};

/**
 * Extract recovery tips from the addiction database
 * Compiles all tips for each addiction into a unified array
 * @returns {Object} Map of addiction names to tip arrays
 */
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

// Pre-compute the timelines and tips for better performance
const withdrawalTimelines = createWithdrawalTimelines();
const tips = createTips();

/**
 * Maps each addiction to its specific frequency measurement unit
 * Used to display the correct label when users log their addiction amount
 * @type {Object}
 */
const frequencyLabels = {
  '🍺 alcohol': 'standard drinks per day',
  '🌿 cannabis': 'grams per day',
  '💉 hard drugs': 'doses per day',
  '🚬 nicotine': 'cigarettes per day',
  '🎰 gambling': 'sessions per day',
  '📱 social media': 'hours per day',
  '📰 doomscrolling': 'hours per day',
  '🎮 video games': 'hours per day',
  '🔞 pornography': 'sessions per day',
  '🛍️ shopping': 'items per day',
  '🍬 sugar': 'grams per day',
  '☕ coffee': 'cups per day',
  '🍽️ overeating': 'meals per day',
  '❓ other': 'units per day'
};

/**
 * Maps each addiction to its specific cost measurement unit
 * Used to display the correct label for money spent tracking
 * @type {Object}
 */
const costLabels = {
  '🍺 alcohol': '$ per drink',
  '🌿 cannabis': '$ per gram',
  '💉 hard drugs': '$ per dose',
  '🚬 nicotine': '$ per cigarette',
  '🎰 gambling': '$ per session',
  '📱 social media': 'N/A (free)',
  '📰 doomscrolling': 'N/A (free)',
  '🎮 video games': '$ per hour',
  '🔞 pornography': 'N/A (free)',
  '🛍️ shopping': '$ per item',
  '🍬 sugar': '$ per item',
  '☕ coffee': '$ per cup',
  '🍽️ overeating': '$ per meal',
  '❓ other': '$ per unit'
};

/**
 * Get the frequency measurement label for a specific addiction
 * @param {string} addictionName - The addiction name (with or without emoji)
 * @returns {string} The frequency label for the addiction
 */
export const getFrequencyLabel = (addictionName) => {
  // Try direct lookup first
  if (frequencyLabels[addictionName]) {
    return frequencyLabels[addictionName];
  }
  
  // If not found, search for a key containing the addiction name (case-insensitive)
  const searchTerm = addictionName.toLowerCase();
  for (const key in frequencyLabels) {
    if (key.toLowerCase().includes(searchTerm)) {
      return frequencyLabels[key];
    }
  }
  
  return 'units per day';
};

/**
 * Get the cost measurement label for a specific addiction
 * @param {string} addictionName - The addiction name (with or without emoji)
 * @returns {string} The cost label for the addiction
 */
export const getCostLabel = (addictionName) => {
  // Try direct lookup first
  if (costLabels[addictionName]) {
    return costLabels[addictionName];
  }
  
  // If not found, search for a key containing the addiction name (case-insensitive)
  const searchTerm = addictionName.toLowerCase();
  for (const key in costLabels) {
    if (key.toLowerCase().includes(searchTerm)) {
      return costLabels[key];
    }
  }
  
  return '$ per unit';
};

/**
 * Get the current withdrawal stage based on days stopped
 * @param {number} daysStopped - Number of days since stopping the addiction
 * @returns {string} The current withdrawal stage (e.g., "Day 3", "Week 2", "Month 1", "Year 1")
 */
export const getWithdrawalStage = (daysStopped) => {
  if (daysStopped <= 6) {
    return `Day ${daysStopped}`;
  } else if (daysStopped <= 27) {
    const weeks = Math.floor((daysStopped - 6) / 7) + 1;
    return `Week ${weeks}`;
  } else if (daysStopped <= 365) {
    const months = Math.floor((daysStopped - 27) / 30) + 1;
    return `Month ${months}`;
  } else {
    const years = Math.floor(daysStopped / 365);
    return `Year ${years}`;
  }
};

/**
 * Get withdrawal timeline for an addiction
 * @param {string} addictionName - The addiction name (will be converted to lowercase)
 * @returns {Array} Array of withdrawal events with symptoms and tips
 */
export const getWithdrawalTimeline = (addictionName) => {
  const key = addictionName.toLowerCase();
  return withdrawalTimelines[key] || [];
};

/**
 * Get recovery tips for an addiction
 * @param {string} addictionName - The addiction name (will be converted to lowercase)
 * @returns {Array} Array of recovery tips
 */
export const getRecoveryTips = (addictionName) => {
  const key = addictionName.toLowerCase();
  return tips[key] || ['Take it one day at a time.', 'Reach out for support when needed.'];
};

const withdrawalHelper = {
  getFrequencyLabel,
  getCostLabel,
  getWithdrawalTimeline,
  getRecoveryTips,
  withdrawalTimelines,
  tips
};

export default withdrawalHelper;

/**
 * Calculate daily predictions and recovery tips for user's addictions
 * @param {Array} addictions - Array of addiction objects
 * @returns {Array} Array of daily prediction objects with tips
 */
export const calculateDailyPredictions = (addictions) => {
  if (!addictions || addictions.length === 0) {
    return [];
  }

  const now = new Date();
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  return addictions.map(addiction => {
    const stopDate = new Date(addiction.stopDate);
    
    // Calculate days since addiction was stopped with exact time precision
    const diffMs = now - stopDate;
    const totalDaysElapsed = diffMs / (1000 * 60 * 60 * 24);
    const daysSoFar = Math.floor(totalDaysElapsed);
    
    // Calculate daily savings since midnight (time from midnight to now)
    const msSinceMidnight = now - midnight;
    const daysSinceMidnight = msSinceMidnight / (1000 * 60 * 60 * 24);
    const dailySavingsSinceMidnight = daysSinceMidnight * (addiction.moneySpentPerDay || 0);
    
    // Get the withdrawal timeline for this addiction
    const addictionData = addictionDatabase[addiction.name];
    const timeline = addictionData?.withdrawalTimeline || {};
    
    // Find the appropriate tip, symptom, and difficulty based on days
    let tip = 'Stay strong and focused on your recovery.';
    let symptom = 'Keep pushing forward';
    let dayDifficulty = addictionData?.difficulty || 'Medium';
    const dayKeys = Object.keys(timeline);
    
    for (let i = dayKeys.length - 1; i >= 0; i--) {
      const key = dayKeys[i];
      const dayNum = parseInt(key.replace('day', ''));
      if (daysSoFar >= dayNum) {
        tip = timeline[key].tip;
        symptom = timeline[key].symptom;
        dayDifficulty = timeline[key].difficulty || addictionData?.difficulty || 'Medium';
        break;
      }
    }

    // Calculate money saved: (elapsed days) × (money spent per day)
    const totalMoneySaved = totalDaysElapsed * (addiction.moneySpentPerDay || 0);
    
    // Cap today's savings to not exceed total saved (can happen on first day if stopped recently)
    const cappedDailySavings = Math.min(dailySavingsSinceMidnight, totalMoneySaved);
    
    console.log(`${addiction.name}: elapsed=${totalDaysElapsed.toFixed(4)} days, moneyPerDay=${addiction.moneySpentPerDay}, totalSaved=${totalMoneySaved.toFixed(2)}, dailySinceMidnight=${dailySavingsSinceMidnight.toFixed(2)}, cappedDaily=${cappedDailySavings.toFixed(2)}`);

    return {
      _id: addiction._id,
      name: addiction.name,
      daysSoFar,
      stage: {
        name: getWithdrawalStage(daysSoFar),
        difficulty: dayDifficulty,
        symptom: symptom
      },
      tip: tip,
      moneySpent: addiction.moneySpentPerDay,
      frequencyPerDay: addiction.frequencyPerDay,
      totalMoneySaved: totalMoneySaved,
      dailySavingsSinceMidnight: cappedDailySavings
    };
  });
};

/**
 * Format a number of days into a human-readable string
 * Examples: "3 days", "2 weeks", "1 month", "6 months"
 * @param {number} days - Number of days to format
 * @returns {string} Formatted day count
 */
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
