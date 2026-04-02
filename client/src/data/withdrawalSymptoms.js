// Comprehensive withdrawal symptoms data extracted from all addictions
export const withdrawalSymptoms = [
  // Physical Symptoms
  {
    id: 'headaches',
    category: 'Physical Symptoms',
    name: 'Headaches',
    emoji: '🤕',
    description: 'Caffeine withdrawal headaches, migraines, or tension headaches',
    whatToDo: [
      'Stay hydrated - drink plenty of water',
      'Rest in a dark, quiet room',
      'Try deep breathing exercises',
      'Apply a warm or cold compress to your head',
      'Over-the-counter pain relief if needed',
      'Regular sleep schedule helps reduce frequency'
    ],
    addictions: ['☕ Coffee', '🍺 Alcohol', '🚬 Nicotine'],
    timingWeek: 'Days 1-7',
    severity: 'Mild to Moderate'
  },
  {
    id: 'tremors',
    category: 'Physical Symptoms',
    name: 'Tremors & Shaking',
    emoji: '🫨',
    description: 'Involuntary shaking or trembling in hands and body',
    whatToDo: [
      'Take deep, slow breaths to calm your nervous system',
      'Avoid caffeine which can worsen tremors',
      'Stay warm - tremors often accompany chills',
      'Gentle stretching or yoga',
      'Limit sugar intake',
      'Seek medical attention if severe or prolonged'
    ],
    addictions: ['🍺 Alcohol', '💉 Hard Drugs'],
    timingWeek: 'Days 1-3 (peak)',
    severity: 'Moderate to Severe'
  },
  {
    id: 'sweating',
    category: 'Physical Symptoms',
    name: 'Excessive Sweating',
    emoji: '💦',
    description: 'Night sweats and excessive perspiration during the day',
    whatToDo: [
      'Wear breathable, moisture-wicking clothing',
      'Change bedding frequently',
      'Stay in cool environments',
      'Shower in cool water',
      'Electrolyte replacement drinks',
      'Keep a towel nearby for comfort'
    ],
    addictions: ['🍺 Alcohol', '💉 Hard Drugs', '🚬 Nicotine'],
    timingWeek: 'Days 1-3',
    severity: 'Moderate'
  },
  {
    id: 'fatigue',
    category: 'Physical Symptoms',
    name: 'Fatigue & Exhaustion',
    emoji: '😴',
    description: 'Extreme tiredness and lack of energy despite resting',
    whatToDo: [
      'Get 7-9 hours of quality sleep',
      'Gentle exercise like walking to boost energy',
      'Eat nutritious, regular meals',
      'Avoid excessive napping which can worsen sleep',
      'Stay hydrated',
      'Be patient - energy improves gradually'
    ],
    addictions: ['☕ Coffee', '🍬 Sugar', '💉 Hard Drugs'],
    timingWeek: 'Days 1-7, peaks on days 3-4',
    severity: 'Moderate'
  },
  {
    id: 'sleep-difficulties',
    category: 'Physical Symptoms',
    name: 'Sleep Difficulties & Insomnia',
    emoji: '😵',
    description: 'Trouble falling asleep, staying asleep, or restless sleep',
    whatToDo: [
      'Establish a consistent sleep schedule',
      'Avoid screens 1 hour before bed',
      'Create a cool, dark sleep environment',
      'Try meditation or guided sleep apps',
      'Avoid caffeine and sugar',
      'Gentle bedtime routine (reading, light stretching)',
      'Consider melatonin or other sleep aids (consult doctor)'
    ],
    addictions: ['🍺 Alcohol', '😌 Calm', '🎮 Video Games', '📱 Social Media'],
    timingWeek: 'Days 1-14',
    severity: 'Moderate'
  },
  {
    id: 'appetite-changes',
    category: 'Physical Symptoms',
    name: 'Appetite Changes',
    emoji: '🍽️',
    description: 'Loss of appetite, nausea, or changes in eating patterns',
    whatToDo: [
      'Eat small, frequent meals',
      'Choose easy-to-digest foods',
      'Stay hydrated with clear liquids',
      'Try ginger tea or peppermint for nausea',
      'Avoid greasy or spicy foods',
      'Listen to your body - appetite will return'
    ],
    addictions: ['🌿 Cannabis', '💉 Hard Drugs', '🍬 Sugar'],
    timingWeek: 'Days 1-7',
    severity: 'Mild to Moderate'
  },

  // Mental/Emotional Symptoms
  {
    id: 'anxiety',
    category: 'Mental & Emotional',
    name: 'Anxiety & Nervousness',
    emoji: '😰',
    description: 'Persistent worry, fear, or sense of impending doom',
    whatToDo: [
      'Practice deep breathing (4-7-8 technique)',
      'Meditation and mindfulness apps',
      'Regular exercise to release tension',
      'Limit caffeine intake',
      'Progressive muscle relaxation',
      'Talk to someone you trust',
      'Consider therapy or support groups'
    ],
    addictions: ['🍺 Alcohol', '🌿 Cannabis', '💉 Hard Drugs', '🚬 Nicotine', '📱 Social Media'],
    timingWeek: 'Days 1-3 (peak)',
    severity: 'Mild to Severe'
  },
  {
    id: 'irritability',
    category: 'Mental & Emotional',
    name: 'Irritability & Mood Swings',
    emoji: '😤',
    description: 'Short temper, quick to anger, or emotional instability',
    whatToDo: [
      'Take breaks and step away from triggers',
      'Practice stress-reduction techniques',
      'Physical activity (walk, run, exercise)',
      'Journal your feelings',
      'Communicate openly about your state',
      'Avoid confrontations when possible',
      'Use the Mood tracker to understand patterns'
    ],
    addictions: ['🍺 Alcohol', '🌿 Cannabis', '💉 Hard Drugs', '🚬 Nicotine', '🎮 Video Games'],
    timingWeek: 'Days 1-14',
    severity: 'Moderate'
  },
  {
    id: 'depression',
    category: 'Mental & Emotional',
    name: 'Depression & Low Mood',
    emoji: '😞',
    description: 'Persistent sadness, hopelessness, or loss of interest in things',
    whatToDo: [
      'Talk to a mental health professional',
      'Use the Diary feature to process feelings',
      'Gentle exercise daily',
      'Spend time in sunlight (20-30 mins)',
      'Connect with supportive people',
      'Avoid isolation',
      'Be patient - mood improves with time'
    ],
    addictions: ['🍺 Alcohol', '💉 Hard Drugs', '🔞 Pornography', '📰 Doomscrolling'],
    timingWeek: 'Days 1-14',
    severity: 'Moderate to Severe'
  },
  {
    id: 'brain-fog',
    category: 'Mental & Emotional',
    name: 'Brain Fog & Concentration Issues',
    emoji: '🌫️',
    description: 'Difficulty concentrating, memory problems, or mental cloudiness',
    whatToDo: [
      'Allow your brain time to heal',
      'Omega-3 foods (fish, nuts, seeds)',
      'Stay hydrated',
      'Regular sleep schedule',
      'Break tasks into smaller chunks',
      'Minimize distractions',
      'Give yourself grace - this improves gradually'
    ],
    addictions: ['🌿 Cannabis', '💉 Hard Drugs', '🔞 Pornography', '📱 Social Media'],
    timingWeek: 'Days 3-14',
    severity: 'Mild to Moderate'
  },
  {
    id: 'emotional-instability',
    category: 'Mental & Emotional',
    name: 'Emotional Instability',
    emoji: '🎢',
    description: 'Rapid mood changes, crying, or feeling out of control emotionally',
    whatToDo: [
      'Recognize emotions are temporary',
      'Use grounding techniques (5 senses)',
      'Journal to process feelings',
      'Reach out for support',
      'Practice self-compassion',
      'Avoid major life decisions during peak withdrawal',
      'Therapy can be very helpful'
    ],
    addictions: ['🍺 Alcohol', '💉 Hard Drugs', '🎰 Gambling'],
    timingWeek: 'Days 1-14',
    severity: 'Moderate'
  },
  {
    id: 'low-confidence',
    category: 'Mental & Emotional',
    name: 'Low Confidence & Self-Doubt',
    emoji: '😖',
    description: 'Loss of confidence, negative self-talk, or feeling inadequate',
    whatToDo: [
      'Challenge negative thoughts with evidence',
      'Use Achievements page to celebrate wins',
      'Practice positive affirmations',
      'Remember small progress is still progress',
      'Help others - service builds confidence',
      'Use motivational quotes daily',
      'Track your recovery - you\'re doing it!'
    ],
    addictions: ['🔞 Pornography', '🎰 Gambling', '💉 Hard Drugs'],
    timingWeek: 'Days 3-14',
    severity: 'Mild to Moderate'
  },

  // Cravings & Urges
  {
    id: 'intense-cravings',
    category: 'Cravings & Urges',
    name: 'Intense Cravings',
    emoji: '🔥',
    description: 'Strong desire or urge to use substance/engage in behavior',
    whatToDo: [
      'Remember: cravings peak in 15-20 minutes then fade',
      'Use the Craving Game for distraction',
      'Call a support person immediately',
      'Change your environment',
      'Use the meditation feature',
      'Exercise - burns off the urge',
      'Journal about what triggered the craving'
    ],
    addictions: ['🍺 Alcohol', '💉 Hard Drugs', '🌿 Cannabis', '🚬 Nicotine', '🎰 Gambling'],
    timingWeek: 'Days 1-7 (peak)',
    severity: 'Severe'
  },
  {
    id: 'restlessness',
    category: 'Cravings & Urges',
    name: 'Restlessness & Agitation',
    emoji: '⚡',
    description: 'Unable to relax, constant need for stimulation or movement',
    whatToDo: [
      'Channel energy into physical activity',
      'Try intense exercise (running, dancing)',
      'Take a walk or hike',
      'Use fidget tools or fidget spinners',
      'Cold shower to reset nervous system',
      'Try the Craving Game or meditation',
      'Structured activities combat restlessness'
    ],
    addictions: ['🌿 Cannabis', '📱 Social Media', '🎮 Video Games', '🚬 Nicotine'],
    timingWeek: 'Days 1-7',
    severity: 'Moderate'
  },
  {
    id: 'fomo',
    category: 'Cravings & Urges',
    name: 'FOMO (Fear of Missing Out)',
    emoji: '😟',
    description: 'Fear that everyone else is having fun or living better without you',
    whatToDo: [
      'Mute trigger accounts on social media',
      'Focus on what you\'re GAINING (health, clarity, money)',
      'Reach out to others in recovery',
      'Remember: social media is curated, not real life',
      'Use Achievements to track your real wins',
      'Limit social media exposure',
      'Build real connections with support people'
    ],
    addictions: ['📱 Social Media', '🎮 Video Games', '🎰 Gambling'],
    timingWeek: 'Days 1-7 (peak)',
    severity: 'Mild to Moderate'
  },
  {
    id: 'boredom',
    category: 'Cravings & Urges',
    name: 'Boredom & Restlessness',
    emoji: '😐',
    description: 'Inability to enjoy activities, everything feels boring or flat',
    whatToDo: [
      'Try new hobbies or revisit old interests',
      'Physical activity improves mood and engagement',
      'Volunteer or help others',
      'Read books or listen to podcasts',
      'Learn something new',
      'Social connection reduces boredom',
      'This is temporary as dopamine receptors heal'
    ],
    addictions: ['🎮 Video Games', '📱 Social Media', '🛍️ Shopping'],
    timingWeek: 'Days 1-3',
    severity: 'Mild'
  },

  // Energy & Focus Issues
  {
    id: 'difficulty-focusing',
    category: 'Energy & Focus',
    name: 'Difficulty Focusing',
    emoji: '🧠',
    description: 'Can\'t concentrate on tasks, mind wanders, can\'t stay organized',
    whatToDo: [
      'Use Pomodoro technique (25 min focus blocks)',
      'Eliminate distractions',
      'Important tasks in morning when focus is best',
      'Sufficient sleep is critical',
      'Nutritious food supports focus',
      'Write down distracting thoughts to address later',
      'Be patient - focus improves by day 14+'
    ],
    addictions: ['🌿 Cannabis', '🔞 Pornography', '📱 Social Media'],
    timingWeek: 'Days 1-14',
    severity: 'Mild to Moderate'
  },
  {
    id: 'energy-crashes',
    category: 'Energy & Focus',
    name: 'Energy Crashes',
    emoji: '📉',
    description: 'Sudden drops in energy despite resting, mid-day crashes',
    whatToDo: [
      'Eat balanced meals with protein and complex carbs',
      'Stay hydrated throughout the day',
      'Avoid excessive sugar which causes crashes',
      'Regular exercise improves baseline energy',
      'Short breaks every hour help maintain energy',
      'Exposure to natural light mid-day',
      'Consistent sleep schedule regulates energy'
    ],
    addictions: ['🍬 Sugar', '☕ Coffee', '⚡ Energetic'],
    timingWeek: 'Days 1-7',
    severity: 'Mild'
  },

  // Social & Behavioral
  {
    id: 'social-withdrawal',
    category: 'Social & Behavioral',
    name: 'Social Withdrawal',
    emoji: '🏠',
    description: 'Isolating from others, avoiding social situations, feeling detached',
    whatToDo: [
      'Schedule social time even if you don\'t feel like it',
      'Start small - coffee with one friend',
      'Support groups provide judgment-free connection',
      'Text friends to maintain connection',
      'Remember: others care about you',
      'Isolation worsens mood - push yourself gently',
      'Join community activities or hobbies'
    ],
    addictions: ['🍺 Alcohol', '💉 Hard Drugs', '😌 Calm'],
    timingWeek: 'Days 1-14',
    severity: 'Mild to Moderate'
  },
  {
    id: 'difficulty-making-decisions',
    category: 'Social & Behavioral',
    name: 'Difficulty Making Decisions',
    emoji: '🤔',
    description: 'Can\'t make even simple decisions, feeling overwhelmed by choices',
    whatToDo: [
      'Don\'t make major decisions in first week',
      'Use a list to organize thoughts',
      'Talk through options with someone you trust',
      'Start with small, low-stakes decisions',
      'Remember: you can change your mind',
      'Delay non-urgent decisions if possible',
      'This is temporary and improves daily'
    ],
    addictions: ['💉 Hard Drugs', '🎰 Gambling'],
    timingWeek: 'Days 1-7',
    severity: 'Mild to Moderate'
  },
];

// Group symptoms by category
export const symptomCategories = [
  'All Symptoms',
  'Physical Symptoms',
  'Mental & Emotional',
  'Cravings & Urges',
  'Energy & Focus',
  'Social & Behavioral'
];

// Get symptoms by category
export const getSymptomsByCategory = (category) => {
  if (category === 'All Symptoms') {
    return withdrawalSymptoms;
  }
  return withdrawalSymptoms.filter(symptom => symptom.category === category);
};
