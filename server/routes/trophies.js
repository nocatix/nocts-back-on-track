const express = require('express');
const auth = require('../middleware/auth');
const Trophy = require('../models/Trophy');
const User = require('../models/User');
const Addiction = require('../models/Addiction');

const router = express.Router();

// Async error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Trophy definitions
const DAILY_TROPHIES = [
  { name: '⭐ Day 1 Bold', description: 'Your first day - you got this!' },
  { name: '✨ Day 2 Brave', description: 'Two days down!' },
  { name: '💪 Day 3 Strong', description: 'Three days strong!' },
  { name: '🔥 Day 4 Fire', description: 'Four days on fire!' },
  { name: '⚡ Day 5 Lightning', description: 'Five days of lightning speed!' },
  { name: '🌟 Day 6 Star', description: 'Six days - you\'re a star!' }
];

const WEEKLY_TROPHIES = [
  { name: '🎖️ Week 1 Warrior', description: 'One week - warrior strength!' },
  { name: '🛡️ Week 2 Shield', description: 'Two weeks - you\'re shielded!' },
  { name: '🏅 Week 3 Champion', description: 'Three weeks - you\'re a champion!' }
];

const MONTHLY_TROPHIES = [
  { name: '🏅 1 Month Champion', description: 'Lasted your first month!' },
  { name: '🥈 2 Month Warrior', description: 'Two months of dedication!' },
  { name: '🥉 3 Month Veteran', description: 'Three months strong!' },
  { name: '⭐ 4 Month Star', description: 'Four months shining bright!' },
  { name: '💎 5 Month Gem', description: 'Five months of brilliance!' },
  { name: '👑 6 Month Royal', description: 'Six months of royalty!' },
  { name: '🔥 7 Month Inferno', description: 'Seven months ablaze!' },
  { name: '🌟 8 Month SuperStar', description: 'Eight months of stardom!' },
  { name: '⚡ 9 Month Lightning', description: 'Nine months of lightning speed!' },
  { name: '🚀 10 Month Rocket', description: 'Ten months rocketing forward!' },
  { name: '💫 11 Month Meteor', description: 'Eleven months meteoric rise!' }
];

const YEARLY_TROPHIES = {
  1: { name: '🏆 1 Year Legend', icon: '🏆', description: 'ONE YEAR! You are a legend!' },
  2: { name: '👑 2 Year King/Queen', icon: '👑', description: 'TWO YEARS! Royalty status!' },
  3: { name: '🔱 3 Year Ruler', icon: '🔱', description: 'THREE YEARS! You rule!' },
  4: { name: '⚜️ 4 Year Sovereign', icon: '⚜️', description: 'FOUR YEARS! Sovereign of sobriety!' },
  5: { name: '💪 5 Year Titan', icon: '💪', description: 'FIVE YEARS! A titan among titans!' },
  10: { name: '🌟 10 Year Eternal', icon: '🌟', description: 'TEN YEARS! Eternally strong!' }
};

// Get current trophy and progress towards next
router.get('/progress', auth, asyncHandler(async (req, res) => {
  // Check if user has any addictions
  const addictions = await Addiction.find({ userId: req.user.userId });
  
  // Only return progress if user has addictions
  if (addictions.length === 0) {
    return res.json({
      currentTrophy: null,
      nextTrophy: null,
      progress: 0,
      progressDescription: 'Log an addiction to start earning trophies!'
    });
  }

  const user = await User.findById(req.user.userId);
  const accountCreatedDate = new Date(user.createdAt);
  const currentDate = new Date();
  
  // Calculate time differences (with decimal values for progress)
  const totalDaysDifference = (currentDate - accountCreatedDate) / (1000 * 60 * 60 * 24);
  const daysDifference = Math.floor(totalDaysDifference);
  const weeksDifference = Math.floor(daysDifference / 7);
  
  let monthsDifference = 0;
  let tempDate = new Date(accountCreatedDate);
  while (tempDate < currentDate) {
    tempDate.setMonth(tempDate.getMonth() + 1);
    monthsDifference++;
  }
  const yearsDifference = Math.floor(monthsDifference / 12);

  let currentTrophy = null;
  let nextTrophy = null;
  let progress = 0;
  let progressDescription = '';
  let timeRemaining = 0; // in milliseconds

  // Helper function to format time remaining
  const formatTimeRemaining = (days) => {
    if (days < 1) {
      const hours = Math.ceil(days * 24);
      return `${hours}h remaining`;
    } else if (days < 7) {
      const wholeHours = Math.floor(days * 24);
      return `${Math.floor(days)}d ${wholeHours % 24}h remaining`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks}w ${Math.floor(days % 7)}d remaining`;
    } else {
      const months = Math.floor(days / 30);
      return `${months}mo remaining`;
    }
  };

  // Daily trophies (days 1-6, daysDifference 0-5)
  if (daysDifference < 6) {
    if (daysDifference === 0) {
      // Day 1: haven't earned any trophy yet
      currentTrophy = null;
      nextTrophy = DAILY_TROPHIES[0];
      progress = (totalDaysDifference * 100);
      progressDescription = `${Math.round(progress)}% towards Day 1 trophy`;
      timeRemaining = (1 - totalDaysDifference) * 24 * 60 * 60 * 1000; // ms until 1 day
    } else {
      // Days 2-6: show the earned trophy and next one
      currentTrophy = DAILY_TROPHIES[daysDifference - 1];
      nextTrophy = DAILY_TROPHIES[daysDifference];
      progress = (totalDaysDifference % 1) * 100;
      const nextDay = daysDifference + 1;
      progressDescription = `Day ${daysDifference + 1}/6 - ${Math.round(progress)}% towards ${nextTrophy.name}`;
      timeRemaining = (nextDay - totalDaysDifference) * 24 * 60 * 60 * 1000;
    }
  }
  // Transition from Day 6 to Week 1 (day 7, daysDifference 6)
  else if (daysDifference === 6) {
    currentTrophy = DAILY_TROPHIES[5]; // Day 6
    nextTrophy = WEEKLY_TROPHIES[0]; // Week 1
    progress = ((daysDifference - 6 + (totalDaysDifference % 1)) / 7) * 100;
    progressDescription = `Day 7 - ${Math.round(progress)}% towards ${nextTrophy.name}`;
    timeRemaining = (7 - totalDaysDifference) * 24 * 60 * 60 * 1000;
  }
  // Weekly trophies (weeks 1-3)
  else if (weeksDifference >= 1 && weeksDifference <= 3) {
    if (weeksDifference === 1) {
      // Week 1: current is Week 1, next is Week 2
      currentTrophy = WEEKLY_TROPHIES[0];
      nextTrophy = weeksDifference < 3 ? WEEKLY_TROPHIES[1] : MONTHLY_TROPHIES[0];
    } else {
      // Weeks 2-3
      currentTrophy = WEEKLY_TROPHIES[weeksDifference - 1];
      nextTrophy = weeksDifference < 3 ? WEEKLY_TROPHIES[weeksDifference] : MONTHLY_TROPHIES[0];
    }
    const daysInWeek = totalDaysDifference % 7;
    progress = (daysInWeek / 7) * 100;
    progressDescription = `Week ${weeksDifference}, Day ${Math.floor(daysInWeek) + 1}/7 - ${Math.round(progress)}% towards ${nextTrophy.name}`;
    const daysUntilNextWeek = 7 - daysInWeek;
    timeRemaining = daysUntilNextWeek * 24 * 60 * 60 * 1000;
  }
  // Monthly trophies (months 1-11)
  else if (monthsDifference >= 1 && monthsDifference <= 11) {
    currentTrophy = MONTHLY_TROPHIES[monthsDifference - 1];
    nextTrophy = monthsDifference < 11 ? MONTHLY_TROPHIES[monthsDifference] : YEARLY_TROPHIES[1];
    
    // Calculate progress in current month
    const nextMonthDate = new Date(accountCreatedDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + monthsDifference + 1);
    const daysIntoMonth = Math.floor((currentDate - tempDate) / (1000 * 60 * 60 * 24));
    const daysInMonth = Math.ceil((nextMonthDate - tempDate) / (1000 * 60 * 60 * 24));
    progress = (daysIntoMonth / daysInMonth) * 100;
    progressDescription = `Month ${monthsDifference}/11 - ${Math.round(progress)}% towards ${nextTrophy.name}`;
    const daysRemaining = daysInMonth - daysIntoMonth;
    timeRemaining = daysRemaining * 24 * 60 * 60 * 1000;
  }
  // Yearly trophies
  else {
    currentTrophy = YEARLY_TROPHIES[yearsDifference] || YEARLY_TROPHIES[10];
    const nextYearMilestone = Object.keys(YEARLY_TROPHIES).find(y => parseInt(y) > yearsDifference);
    nextTrophy = nextYearMilestone ? YEARLY_TROPHIES[nextYearMilestone] : null;
    
    if (nextTrophy) {
      // Calculate progress towards next milestone
      const monthsInPeriod = nextYearMilestone * 12 - (yearsDifference * 12);
      const currentMonthInPeriod = monthsDifference - (yearsDifference * 12);
      progress = (currentMonthInPeriod / monthsInPeriod) * 100;
      progressDescription = `Year ${yearsDifference}/${nextYearMilestone} - ${Math.round(progress)}% towards ${nextTrophy.name}`;
      const monthsRemaining = monthsInPeriod - currentMonthInPeriod;
      timeRemaining = monthsRemaining * 30 * 24 * 60 * 60 * 1000; // approximate
    } else {
      progress = 100;
      progressDescription = `🎉 You've reached the ultimate milestone!`;
      timeRemaining = 0;
    }
  }

  const timeRemainingFormatted = timeRemaining > 0 ? formatTimeRemaining(timeRemaining / (1000 * 60 * 60 * 24)) : '';

  res.json({
    currentTrophy,
    nextTrophy,
    progress: Math.min(progress, 100),
    progressDescription,
    timeRemaining,
    timeRemainingFormatted,
    daysDifference,
    weeksDifference,
    monthsDifference,
    yearsDifference
  });
}));

// Get all user trophies
router.get('/', auth, asyncHandler(async (req, res) => {
  // Check if user has any addictions
  const addictions = await Addiction.find({ userId: req.user.userId });
  
  // Only return trophies if user has addictions
  if (addictions.length === 0) {
    return res.json([]);
  }
  
  const trophies = await Trophy.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json(trophies);
}));

// Get unread trophies
router.get('/unread', auth, asyncHandler(async (req, res) => {
  const trophies = await Trophy.find({ userId: req.user.userId, readAt: null }).sort({ createdAt: -1 });
  res.json(trophies);
}));

// Check and award trophies based on user account age
router.post('/check', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if user has any addictions
  const addictions = await Addiction.find({ userId: req.user.userId });
  if (addictions.length === 0) {
    return res.json({ 
      trophies: [],
      message: 'No trophies awarded - user has no addictions' 
    });
  }

  const accountCreatedDate = new Date(user.createdAt);
  const currentDate = new Date();
  
  // Calculate time differences
  const daysDifference = Math.floor((currentDate - accountCreatedDate) / (1000 * 60 * 60 * 24));
  const weeksDifference = Math.floor(daysDifference / 7);
  
  let monthsDifference = 0;
  let tempDate = new Date(accountCreatedDate);
  while (tempDate < currentDate) {
    tempDate.setMonth(tempDate.getMonth() + 1);
    monthsDifference++;
  }

  const yearsDifference = Math.floor(monthsDifference / 12);
  const newTrophies = [];

  // Award daily trophies (first 6 days)
  if (daysDifference > 0 && daysDifference <= 6) {
    const dayIndex = daysDifference - 1;
    const dayTrophy = DAILY_TROPHIES[dayIndex];

    const existingTrophy = await Trophy.findOne({
      userId: req.user.userId,
      type: 'daily',
      day: daysDifference
    });

    if (!existingTrophy && dayTrophy) {
      const trophy = await Trophy.create({
        userId: req.user.userId,
        type: 'daily',
        day: daysDifference,
        week: 0,
        month: 0,
        year: 1,
        name: dayTrophy.name,
        description: dayTrophy.description,
        icon: dayTrophy.name.split(' ')[0]
      });
      newTrophies.push(trophy);
    }
  }

  // Award weekly trophies (first 3 weeks, after day 6)
  if (daysDifference > 6 && weeksDifference > 0 && weeksDifference <= 3) {
    const weekTrophy = WEEKLY_TROPHIES[weeksDifference - 1];

    const existingTrophy = await Trophy.findOne({
      userId: req.user.userId,
      type: 'weekly',
      week: weeksDifference
    });

    if (!existingTrophy && weekTrophy) {
      const trophy = await Trophy.create({
        userId: req.user.userId,
        type: 'weekly',
        day: 0,
        week: weeksDifference,
        month: 0,
        year: 1,
        name: weekTrophy.name,
        description: weekTrophy.description,
        icon: weekTrophy.name.split(' ')[0]
      });
      newTrophies.push(trophy);
    }
  }

  // Award monthly trophies (first 11 months, after week 3)
  if (daysDifference > 21 && monthsDifference > 0 && monthsDifference <= 11) {
    const monthIndex = monthsDifference - 1;
    const monthTrophy = MONTHLY_TROPHIES[monthIndex];

    const existingTrophy = await Trophy.findOne({
      userId: req.user.userId,
      type: 'monthly',
      month: monthsDifference
    });

    if (!existingTrophy && monthTrophy) {
      const trophy = await Trophy.create({
        userId: req.user.userId,
        type: 'monthly',
        day: 0,
        week: 0,
        month: monthsDifference,
        year: 1,
        name: monthTrophy.name,
        description: monthTrophy.description,
        icon: monthTrophy.name.split(' ')[0]
      });
      newTrophies.push(trophy);
    }
  }

  // Award yearly trophies (after 12 months)
  if (yearsDifference > 0) {
    const yearlyTrophy = YEARLY_TROPHIES[yearsDifference];
    if (yearlyTrophy) {
      const existingTrophy = await Trophy.findOne({
        userId: req.user.userId,
        type: 'yearly',
        year: yearsDifference
      });

      if (!existingTrophy) {
        const trophy = await Trophy.create({
          userId: req.user.userId,
          type: 'yearly',
          day: 0,
          week: 0,
          month: 0,
          year: yearsDifference,
          name: yearlyTrophy.name,
          description: yearlyTrophy.description,
          icon: yearlyTrophy.icon
        });
        newTrophies.push(trophy);
      }
    }
  }

  res.json({ 
    trophies: newTrophies, 
    accountAgeDays: daysDifference,
    accountAgeWeeks: weeksDifference,
    accountAgeMonths: monthsDifference, 
    accountAgeYears: yearsDifference 
  });
}));

// Mark trophy as read
router.put('/:id/read', auth, asyncHandler(async (req, res) => {
  const trophy = await Trophy.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { readAt: Date.now() },
    { new: true }
  );
  if (!trophy) {
    return res.status(404).json({ message: 'Trophy not found' });
  }
  res.json(trophy);
}));

module.exports = router;
