import React, { useState } from 'react';
import './Hobbies.css';

const Hobbies = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const hobbies = [
    // SOLO - OUTDOOR - FREE
    {
      id: 1,
      name: 'Walking',
      emoji: '🚶',
      category: ['solo', 'outdoor', 'free'],
      duration: '30 mins - 2 hours',
      description: 'A simple, free way to move your body and clear your mind. Walking reduces cravings and improves mood.',
      recovery_benefits: ['Physical activity', 'Fresh air', 'Mental clarity', 'Stress relief'],
      get_started: 'Start with a 20-minute daily walk in your neighborhood or a local park. Use the time to notice your surroundings.'
    },
    {
      id: 2,
      name: 'Running/Jogging',
      emoji: '🏃',
      category: ['solo', 'outdoor', 'free'],
      duration: '20-60 mins',
      description: 'A more intense workout that releases endorphins and burns off nervous energy.',
      recovery_benefits: ['Endorphin release', 'Intense exercise', 'Craving suppression', 'Confidence boost'],
      get_started: 'If new to running, start with run-walk intervals. Couch to 5K apps can guide you.'
    },
    {
      id: 3,
      name: 'Hiking',
      emoji: '⛰️',
      category: ['solo', 'outdoor', 'free'],
      duration: '1-4 hours',
      description: 'Combine nature exposure, physical activity, and goal-setting in one rewarding hobby.',
      recovery_benefits: ['Nature connection', 'Achievement', 'Exercise', 'Mental reset'],
      get_started: 'Find a local hiking trail. Start with beginner routes and gradually increase difficulty.'
    },
    {
      id: 4,
      name: 'Gardening',
      emoji: '🌱',
      category: ['solo', 'outdoor', 'free'],
      duration: '30 mins - 2 hours',
      description: 'Growing things provides purpose, patience, and the satisfaction of nurturing life.',
      recovery_benefits: ['Sense of purpose', 'Connection to nature', 'Patience building', 'Achievement'],
      get_started: 'Start with easy plants from seeds or seedlings. Even a small window garden counts.'
    },
    {
      id: 5,
      name: 'Exploring Your City',
      emoji: '🗺️',
      category: ['solo', 'outdoor', 'free'],
      duration: '1-3 hours',
      description: 'Rediscover your area, find new parks, cafes, or neighborhoods you\'ve never noticed.',
      recovery_benefits: ['Curiosity', 'Movement', 'New perspectives', 'Breaking routine'],
      get_started: 'Pick a neighborhood or area you don\'t know well. Spend time exploring without a destination.'
    },

    // SOLO - OUTDOOR - PAID
    {
      id: 6,
      name: 'Cycling',
      emoji: '🚴',
      category: ['solo', 'outdoor', 'paid'],
      duration: '30 mins - 2 hours',
      description: 'A fun, fast way to cover distance and experience freedom.',
      recovery_benefits: ['Speed and freedom', 'Cardiovascular health', 'Exploration', 'Endorphins'],
      get_started: 'Start with a used bike from a local shop or online. Invest in a helmet and lock.'
    },
    {
      id: 7,
      name: 'Rock Climbing',
      emoji: '🧗',
      category: ['solo', 'outdoor', 'paid'],
      duration: '1-3 hours',
      description: 'An intense physical and mental challenge that builds confidence and focus.',
      recovery_benefits: ['Problem-solving', 'Confidence', 'Full-body strength', 'Intense focus'],
      get_started: 'Start at a local climbing gym. Instructors will teach you proper technique and safety.'
    },
    {
      id: 8,
      name: 'Photography',
      emoji: '📸',
      category: ['solo', 'outdoor', 'paid'],
      duration: '1-4 hours',
      description: 'Capture beauty, develop an artistic eye, and have a creative outlet while exploring.',
      recovery_benefits: ['Creativity', 'Mindfulness', 'Exploration', 'Accomplishment'],
      get_started: 'Start with your phone camera. Learn composition and lighting through free online tutorials.'
    },
    {
      id: 9,
      name: 'Water Sports',
      emoji: '🏄',
      category: ['solo', 'outdoor', 'paid'],
      duration: '1-3 hours',
      description: 'Surfing, kayaking, or paddleboarding connect you to water and provide exhilaration.',
      recovery_benefits: ['Connection to nature', 'Adrenaline', 'Full-body workout', 'Presence'],
      get_started: 'Take beginner lessons at a local beach or lake. Start with calm waters.'
    },

    // SOLO - INDOOR - FREE
    {
      id: 10,
      name: 'Reading',
      emoji: '📖',
      category: ['solo', 'indoor', 'free'],
      duration: '30 mins - 2 hours',
      description: 'Escape into stories, learn new things, and give your mind a healthy challenge.',
      recovery_benefits: ['Mental escape', 'Vocabulary growth', 'Relaxation', 'Knowledge'],
      get_started: 'Visit your local library. Borrow books for free. Start with genres you naturally enjoy.'
    },
    {
      id: 11,
      name: 'Writing/Journaling',
      emoji: '✍️',
      category: ['solo', 'indoor', 'free'],
      duration: '20-60 mins',
      description: 'Process emotions, track your journey, and discover insights about yourself.',
      recovery_benefits: ['Emotional processing', 'Self-discovery', 'Stress relief', 'Progress tracking'],
      get_started: 'Start with free journaling. No rules—just put pen to paper and write what\'s true.'
    },
    {
      id: 12,
      name: 'Drawing/Sketching',
      emoji: '🎨',
      category: ['solo', 'indoor', 'free'],
      duration: '30 mins - 2 hours',
      description: 'Express creativity without needing to be "good." Focus on the process, not perfection.',
      recovery_benefits: ['Creative expression', 'Relaxation', 'Mindfulness', 'No judgment zone'],
      get_started: 'Grab some paper and a pencil. Draw what you see or feel. Skill doesn\'t matter.'
    },
    {
      id: 13,
      name: 'YouTube Learning',
      emoji: '📽️',
      category: ['solo', 'indoor', 'free'],
      duration: '20 mins - 2 hours',
      description: 'Learn practically anything: skills, hobbies, interesting topics, history.',
      recovery_benefits: ['Self-improvement', 'Knowledge', 'Focus', 'Low-pressure learning'],
      get_started: 'Search for topics that interest you. Subscribe to educational channels.'
    },
    {
      id: 14,
      name: 'Yoga',
      emoji: '🧘',
      category: ['solo', 'indoor', 'free'],
      duration: '20-60 mins',
      description: 'Free YouTube videos teach yoga that calms the nervous system and builds body awareness.',
      recovery_benefits: ['Flexibility', 'Mind-body connection', 'Stress relief', 'Relaxation'],
      get_started: 'Search "beginner yoga" on YouTube. Start with 15-20 minute sessions.'
    },
    {
      id: 15,
      name: 'Painting',
      emoji: '🖼️',
      category: ['solo', 'indoor', 'free'],
      duration: '1-3 hours',
      description: 'Watercolor or acrylics provide creative flow and a sense of accomplishment.',
      recovery_benefits: ['Creativity', 'Flow state', 'Sense of control', 'Self-expression'],
      get_started: 'Thrift stores have cheap paint and canvas. Tutorials on YouTube are free.'
    },
    {
      id: 16,
      name: 'Meditation',
      emoji: '🧠',
      category: ['solo', 'indoor', 'free'],
      duration: '5-30 mins',
      description: 'Free meditation apps and YouTube guides teach this foundational recovery tool.',
      recovery_benefits: ['Mental clarity', 'Craving management', 'Anxiety reduction', 'Inner peace'],
      get_started: 'Use the Meditation feature in this app or try free apps like Insight Timer.'
    },

    // SOLO - INDOOR - PAID
    {
      id: 17,
      name: 'Learning an Instrument',
      emoji: '🎸',
      category: ['solo', 'indoor', 'paid'],
      duration: '30 mins - 2 hours',
      description: 'Guitar, piano, ukulele—mastering an instrument is deeply rewarding and absorbs focus.',
      recovery_benefits: ['Sense of achievement', 'Discipline', 'Creative expression', 'Intense focus'],
      get_started: 'Start with a ukulele (cheapest) or used guitar. Free online tutorials abound.'
    },
    {
      id: 18,
      name: 'Online Courses',
      emoji: '🎓',
      category: ['solo', 'indoor', 'paid'],
      duration: '30 mins - 2 hours',
      description: 'Udemy, Coursera, or Skillshare courses let you learn new skills from home.',
      recovery_benefits: ['Self-improvement', 'Goal setting', 'Achievement', 'Career skills'],
      get_started: 'Browse Udemy courses (often on sale for $10-15). Pick something that excites you.'
    },
    {
      id: 19,
      name: 'Video Games',
      emoji: '🎮',
      category: ['solo', 'indoor', 'paid'],
      duration: '1-4 hours',
      description: 'Certain games provide engaging challenges, stress relief, and skill development.',
      recovery_benefits: ['Problem-solving', 'Stress release', 'Achievement', 'Immersion'],
      get_started: 'Start with story-driven games that engage you. Avoid multiplayer if it triggers you.'
    },
    {
      id: 20,
      name: 'Podcasts',
      emoji: '🎧',
      category: ['solo', 'indoor', 'paid'],
      duration: '30 mins - 2 hours',
      description: 'Educational, entertaining, or inspirational podcasts during walks or chores.',
      recovery_benefits: ['Passive learning', 'Inspiration', 'Entertainment', 'Mental stimulation'],
      get_started: 'Download a podcast app. Search for topics that interest or inspire you.'
    },
    {
      id: 21,
      name: 'Crafting',
      emoji: '🧶',
      category: ['solo', 'indoor', 'paid'],
      duration: '1-3 hours',
      description: 'Knitting, woodworking, or DIY projects create something tangible you can be proud of.',
      recovery_benefits: ['Sense of accomplishment', 'Focus', 'Pride of ownership', 'Meditation'],
      get_started: 'Start with beginner-friendly crafts. YouTube has free tutorials for any craft.'
    },
    {
      id: 22,
      name: 'Cooking/Baking',
      emoji: '👨‍🍳',
      category: ['solo', 'indoor', 'paid'],
      duration: '1-3 hours',
      description: 'Create something delicious and nourishing. Both creative and self-care.',
      recovery_benefits: ['Self-care', 'Creativity', 'Sensory engagement', 'Pride in creation'],
      get_started: 'Start with simple recipes you enjoy. Follow YouTube cooking channels.'
    },

    // SOCIAL - OUTDOOR - FREE
    {
      id: 23,
      name: 'Group Hiking',
      emoji: '👥⛰️',
      category: ['social', 'outdoor', 'free'],
      duration: '2-4 hours',
      description: 'Many communities have free hiking groups. Exercise + connection + nature.',
      recovery_benefits: ['Social connection', 'Exercise', 'Nature', 'Community belonging'],
      get_started: 'Search Meetup.com for free hiking groups in your area.'
    },
    {
      id: 24,
      name: 'Basketball/Sports at Park',
      emoji: '🏀',
      category: ['social', 'outdoor', 'free'],
      duration: '1-2 hours',
      description: 'Many parks have free basketball courts or open fields for pickup games.',
      recovery_benefits: ['Teamwork', 'Exercise', 'Fun', 'Community'],
      get_started: 'Find a local park with courts. Show up early morning or evening for pickups.'
    },
    {
      id: 25,
      name: 'Beach/Lake Days',
      emoji: '🏖️',
      category: ['social', 'outdoor', 'free'],
      duration: '2-4 hours',
      description: 'Invite a friend for a free day at the beach or lake. Swimming + connection.',
      recovery_benefits: ['Friendship', 'Nature', 'Swimming', 'Relaxation'],
      get_started: 'Text a friend and suggest a beach day. Pack snacks and enjoy being together.'
    },
    {
      id: 26,
      name: 'Community Events',
      emoji: '🎭',
      category: ['social', 'outdoor', 'free'],
      duration: '1-3 hours',
      description: 'Free concerts, festivals, farmers markets, or community gatherings.',
      recovery_benefits: ['Community connection', 'Culture', 'Entertainment', 'Human connection'],
      get_started: 'Check your city\'s website or Meetup for free community events.'
    },

    // SOCIAL - OUTDOOR - PAID
    {
      id: 27,
      name: 'Group Classes (Fitness)',
      emoji: '💪',
      category: ['social', 'outdoor', 'paid'],
      duration: '1 hour',
      description: 'Outdoor group fitness classes, dance, bootcamps—exercise with others.',
      recovery_benefits: ['Accountability', 'Community', 'Exercise', 'Motivation'],
      get_started: 'Search for "outdoor fitness classes" in your area. Many offer free first class.'
    },
    {
      id: 28,
      name: 'Sports Leagues',
      emoji: '⚽',
      category: ['social', 'outdoor', 'paid'],
      duration: '2-3 hours/week',
      description: 'Join a recreational volleyball, soccer, or softball league.',
      recovery_benefits: ['Teamwork', 'Competition', 'Regular commitment', 'Social bonds'],
      get_started: 'Search for recreational sports leagues in your area. Most are affordable.'
    },

    // SOCIAL - INDOOR - FREE
    {
      id: 29,
      name: 'Board Games',
      emoji: '🎲',
      category: ['social', 'indoor', 'free'],
      duration: '1-3 hours',
      description: 'Invite friends over for board games—fun, free, and strengthens bonds.',
      recovery_benefits: ['Social connection', 'Fun', 'Strategic thinking', 'Laughter'],
      get_started: 'Host a game night with friends. Many people have games at home.'
    },
    {
      id: 30,
      name: 'Support Groups',
      emoji: '🤝',
      category: ['social', 'indoor', 'free'],
      duration: '1-2 hours',
      description: 'AA, NA, or other recovery-specific groups provide community + mutual support.',
      recovery_benefits: ['Shared experience', 'Accountability', 'Community', 'Hope'],
      get_started: 'Search for meetings online. Attend one. Introduce yourself as new.'
    },
    {
      id: 31,
      name: 'Group Cooking',
      emoji: '👨‍🍳👩‍🍳',
      category: ['social', 'indoor', 'free'],
      duration: '2-3 hours',
      description: 'Cook with friends or family. Enjoy food, connection, and teamwork.',
      recovery_benefits: ['Social bonding', 'Creativity', 'Shared accomplishment', 'Nourishment'],
      get_started: 'Invite friends over for a potluck or cooking night. Make it fun and casual.'
    },
    {
      id: 32,
      name: 'Movie/Watch Party',
      emoji: '🎬',
      category: ['social', 'indoor', 'free'],
      duration: '2-3 hours',
      description: 'Host friends for a movie night. Popcorn, couch, good company.',
      recovery_benefits: ['Friendship', 'Entertainment', 'Low-pressure hanging', 'Relaxation'],
      get_started: 'Pick a movie, invite friends, make snacks. That\'s it.'
    },

    // SOCIAL - INDOOR - PAID
    {
      id: 33,
      name: 'Classes (Art, Dance, etc)',
      emoji: '🎨💃',
      category: ['social', 'indoor', 'paid'],
      duration: '1-2 hours',
      description: 'Art classes, dance, pottery, martial arts—learn while meeting people.',
      recovery_benefits: ['New skills', 'Social connection', 'Community', 'Achievement'],
      get_started: 'Check local community centers. Many offer affordable classes.'
    },
    {
      id: 34,
      name: 'Gym Membership',
      emoji: '🏋️',
      category: ['social', 'indoor', 'paid'],
      duration: '1-2 hours',
      description: 'Join a gym for fitness and the community atmosphere.',
      recovery_benefits: ['Structure', 'Exercise', 'Community', 'Accountability'],
      get_started: 'Many gyms offer free trial weeks. Tour different gyms before committing.'
    },
    {
      id: 35,
      name: 'Volunteering',
      emoji: '❤️',
      category: ['social', 'indoor', 'paid'],
      duration: '2-4 hours',
      description: 'Help others through food banks, shelters, or nonprofits. Gives purpose.',
      recovery_benefits: ['Purpose', 'Social connection', 'Giving back', 'Community', 'Self-worth'],
      get_started: 'Search VolunteerMatch.org or call local nonprofits to ask about opportunities.'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Hobbies' },
    { value: 'solo', label: '😊 Solo', subtext: '(do alone)' },
    { value: 'social', label: '👥 Social', subtext: '(with others)' },
    { value: 'outdoor', label: '🌳 Outdoor' },
    { value: 'indoor', label: '🏠 Indoor' },
    { value: 'free', label: '💰 Free' },
    { value: 'paid', label: '💵 Paid' }
  ];

  const filteredHobbies = activeFilter === 'all' 
    ? hobbies 
    : hobbies.filter(hobby => hobby.category.includes(activeFilter));

  return (
    <div className="hobbies-container">
      {/* Header */}
      <header className="hobbies-header">
        <h1>Discover New Hobbies</h1>
        <p>Building recovery through engaging activities that bring joy, purpose, and connection</p>
      </header>

      {/* Why Hobbies Matter */}
      <section className="why-hobbies">
        <h2>Why Hobbies Matter in Recovery</h2>
        <div className="benefits-grid">
          <div className="benefit">
            <span className="benefit-emoji">⏰</span>
            <h3>Fill Your Time</h3>
            <p>Hobbies occupy the time you'd normally spend using. Boredom is dangerous—engagement is safety.</p>
          </div>
          <div className="benefit">
            <span className="benefit-emoji">😊</span>
            <h3>Release Dopamine</h3>
            <p>Hobbies give your brain the pleasure it was seeking from addiction—naturally and healthily.</p>
          </div>
          <div className="benefit">
            <span className="benefit-emoji">🎯</span>
            <h3>Build Purpose</h3>
            <p>Working toward mastery or goals gives life meaning beyond just "not using."</p>
          </div>
          <div className="benefit">
            <span className="benefit-emoji">🤝</span>
            <h3>Create Community</h3>
            <p>Social hobbies connect you to others who share your interests, building healthy relationships.</p>
          </div>
          <div className="benefit">
            <span className="benefit-emoji">💪</span>
            <h3>Build Confidence</h3>
            <p>Learning and improving at something creates real achievement and self-respect.</p>
          </div>
          <div className="benefit">
            <span className="benefit-emoji">🧠</span>
            <h3>Healthy Escape</h3>
            <p>Hobbies provide mental escape without harmful consequences—pure enjoyment.</p>
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <div className="filter-section">
        <h2>Filter Hobbies</h2>
        <div className="filter-buttons">
          {filterOptions.map(option => (
            <button
              key={option.value}
              className={`filter-btn ${activeFilter === option.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(option.value)}
            >
              <span className="filter-label">{option.label}</span>
              {option.subtext && <span className="filter-subtext">{option.subtext}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Hobbies Grid */}
      <div className="hobbies-grid">
        {filteredHobbies.map(hobby => (
          <div key={hobby.id} className="hobby-card">
            {/* Header */}
            <div className="hobby-header">
              <span className="hobby-emoji">{hobby.emoji}</span>
              <div className="hobby-title-section">
                <h3 className="hobby-name">{hobby.name}</h3>
                <div className="hobby-duration">{hobby.duration}</div>
              </div>
            </div>

            {/* Description */}
            <p className="hobby-description">{hobby.description}</p>

            {/* Recovery Benefits */}
            <div className="recovery-benefits">
              <h4>✨ Recovery Benefits:</h4>
              <ul className="benefits-list">
                {hobby.recovery_benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>

            {/* Get Started */}
            <div className="get-started">
              <h4>🚀 Get Started:</h4>
              <p>{hobby.get_started}</p>
            </div>

            {/* Tags */}
            <div className="hobby-tags">
              {hobby.category.map(cat => (
                <span key={cat} className={`tag tag-${cat}`}>
                  {cat === 'solo' && '😊 Solo'}
                  {cat === 'social' && '👥 Social'}
                  {cat === 'outdoor' && '🌳 Outdoor'}
                  {cat === 'indoor' && '🏠 Indoor'}
                  {cat === 'free' && '💰 Free'}
                  {cat === 'paid' && '💵 Paid'}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Final Message */}
      <section className="hobbies-final">
        <h2>Start Exploring</h2>
        <p>
          Pick ONE hobby that genuinely sounds interesting to you. Don't overthink it. Just one.
        </p>
        <p>
          Try it this week. Give it a real chance. You don't have to be good at it—you just have to do it.
        </p>
        <p>
          <strong>The goal isn't perfection. The goal is engagement, joy, and a life worth living sober.</strong>
        </p>
      </section>
    </div>
  );
};

export default Hobbies;
