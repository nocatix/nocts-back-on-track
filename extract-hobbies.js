#!/usr/bin/env node
/**
 * Extract hobbies from Hobbies.js and save to JSON
 */

const fs = require('fs');
const path = require('path');

// Read the Hobbies.js file
const hobbiesFile = '/var/home/marcel/Repo/nocts-back-on-track/client/src/pages/Hobbies.js';
let content = fs.readFileSync(hobbiesFile, 'utf-8');

// Extract just the hobbies array
const arrayStart = content.indexOf('const hobbies = [');
const arrayEnd = content.indexOf('];', arrayStart) + 1;
const hobbiesArrayStr = content.substring(arrayStart + 'const hobbies = '.length, arrayEnd);

// Make it valid CommonJS by using module.exports
const evaluatedCode = `module.exports = ${hobbiesArrayStr}`;

// Write to temp file
const tempFile = '/tmp/hobbies-temp.js';
fs.writeFileSync(tempFile, evaluatedCode);

// Load and parse
const hobbies = require(tempFile);

console.log(`Extracted ${hobbies.length} hobbies`);

// Create translations object
const hobbiesTranslations = {
  pageTitle: "Discover New Hobbies",
  subtitle: "Building recovery through engaging activities that bring joy, purpose, and connection",
  whyHobbiesTitle: "Why Hobbies Matter in Recovery",
  benefits: [
    {
      emoji: "⏰",
      title: "Fill Your Time",
      description: "Hobbies occupy the time you'd normally spend using. Boredom is dangerous—engagement is safety."
    },
    {
      emoji: "😊",
      title: "Release Dopamine",
      description: "Hobbies give your brain the pleasure it was seeking from addiction—naturally and healthily."
    },
    {
      emoji: "🎯",
      title: "Build Purpose",
      description: "Working toward mastery or goals gives life meaning beyond just \"not using.\""
    },
    {
      emoji: "🤝",
      title: "Create Community",
      description: "Social hobbies connect you to others who share your interests, building healthy relationships."
    },
    {
      emoji: "💪",
      title: "Build Confidence",
      description: "Learning and improving at something creates real achievement and self-respect."
    },
    {
      emoji: "🧠",
      title: "Healthy Escape",
      description: "Hobbies provide mental escape without harmful consequences—pure enjoyment."
    }
  ],
  filterTitle: "Filter Hobbies",
  filterOptions: [
    { value: "all", label: "All Hobbies" },
    { value: "solo", label: "😊 Solo", subtext: "(do alone)" },
    { value: "social", label: "👥 Social", subtext: "(with others)" },
    { value: "outdoor", label: "🌳 Outdoor" },
    { value: "indoor", label: "🏠 Indoor" },
    { value: "free", label: "💰 Free" },
    { value: "paid", label: "💵 Paid" }
  ],
  categoryLabels: {
    solo: "😊 Solo",
    social: "👥 Social",
    outdoor: "🌳 Outdoor",
    indoor: "🏠 Indoor",
    free: "💰 Free",
    paid: "💵 Paid"
  },
  recoveryBenefitsTitle: "✨ Recovery Benefits",
  getStartedTitle: "🚀 Get Started",
  finalTitle: "Start Exploring",
  finalMessages: [
    "Pick ONE hobby that genuinely sounds interesting to you. Don't overthink it. Just one.",
    "Try it this week. Give it a real chance. You don't have to be good at it—you just have to do it.",
    "The goal isn't perfection. The goal is engagement, joy, and a life worth living sober."
  ],
  hobbies: hobbies
};

// Update all language files
const localesPath = '/var/home/marcel/Repo/nocts-back-on-track/client/public/locales';
const languages = ['en', 'en-simple', 'de', 'es', 'fr', 'ru', 'zh', 'ja', 'ar'];

languages.forEach(lang => {
  const langFile = path.join(localesPath, lang, 'common.json');
  const data = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
  data.hobbies = hobbiesTranslations;
  fs.writeFileSync(langFile, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✓ Updated ${lang}/common.json with hobbies section (${hobbies.length} hobbies)`);
});

console.log('\nAll language files updated with hobbies translations!');

// Clean up
fs.unlinkSync(tempFile);
