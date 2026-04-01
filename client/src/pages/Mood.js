import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Mood.css';

const EMOTIONS = {
  primary: ['😊 Happy', '😢 Sad', '😠 Angry', '😰 Anxious', '😌 Calm', '⚡ Energetic', '😴 Tired', '😐 Neutral'],
  secondary: {
    '😊 Happy': ['😄 Joyful', '🤩 Excited', '😌 Content', '🙏 Grateful', '😎 Proud'],
    '😢 Sad': ['😞 Depressed', '😕 Disappointed', '😔 Lonely', '😩 Hopeless', '☔ Melancholic'],
    '😠 Angry': ['🤬 Furious', '😤 Irritated', '😒 Resentful', '😤 Frustrated', '😑 Annoyed'],
    '😰 Anxious': ['😟 Worried', '😨 Panicked', '😰 Nervous', '😩 Stressed', '😵 Overwhelmed'],
    '😌 Calm': ['☮️ Peaceful', '😌 Relaxed', '😇 Serene', '🌳 Grounded', '🧘 Meditative'],
    '⚡ Energetic': ['💪 Motivated', '🎯 Ambitious', '🚀 Productive', '💡 Inspired', '✨ Vibrant'],
    '😴 Tired': ['🥱 Exhausted', '😑 Lazy', '🪫 Drained', '😴 Sleepy', '🚪 Burnt Out'],
    '😐 Neutral': ['🤷 Indifferent', '🙈 Detached', '👁️ Observant', '⚖️ Balanced', '😐 Neutral']
  }
};

const PRIMARY_COLORS = {
  '😊 Happy': '#FFD700',
  '😢 Sad': '#4169E1',
  '😠 Angry': '#FF4500',
  '😰 Anxious': '#FF69B4',
  '😌 Calm': '#90EE90',
  '⚡ Energetic': '#FF8C00',
  '😴 Tired': '#696969',
  '😐 Neutral': '#D3D3D3'
};

// Function to lighten or darken a hex color
const adjustColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
};

// Generate shades for secondary emotions
const getSecondaryShades = (primaryEmotion) => {
  const baseColor = PRIMARY_COLORS[primaryEmotion];
  const shades = [-40, -20, 0, 20, 40];
  return shades.map(shade => adjustColor(baseColor, shade));
};

// Calculate luminance to determine if text should be dark or light
const getLuminance = (hexColor) => {
  const rgb = parseInt(hexColor.replace('#', ''), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return (r * 299 + g * 587 + b * 114) / 1000;
};

// Get contrasting text color based on background brightness
const getTextColor = (backgroundColor) => {
  const luminance = getLuminance(backgroundColor);
  return luminance > 128 ? '#000000' : '#FFFFFF';
};

const toLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Mood = () => {
  const { user, token } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [moods, setMoods] = useState({});
  const [showWheel, setShowWheel] = useState(false);
  const [selectedPrimary, setSelectedPrimary] = useState(null);
  const [selectedSecondary, setSelectedSecondary] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [triggers, setTriggers] = useState('');
  const [message, setMessage] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch moods for the current month
  useEffect(() => {
    if (!token) return;

    const fetchMoods = async () => {
      try {
        const API_BASE_URL = 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/api/moods/month/${year}/${month + 1}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          console.error(`Error fetching moods: ${response.status} ${response.statusText}`);
          return;
        }

        try {
          const data = await response.json();

          const moodMap = {};
          data.forEach(mood => {
            const dateKey = toLocalDateKey(new Date(mood.date));
            moodMap[dateKey] = mood;
          });
          setMoods(moodMap);
        } catch (parseError) {
          console.error('Failed to parse moods response:', parseError);
          console.error('Response status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching moods:', error);
      }
    };

    fetchMoods();
  }, [year, month, token]);

  // Fetch mood for selected date
  useEffect(() => {
    const loadMoodForDate = async () => {
      const dateKey = toLocalDateKey(selectedDate);
      if (moods[dateKey]) {
        const mood = moods[dateKey];
        setSelectedPrimary(mood.primaryMood);
        setSelectedSecondary(mood.secondaryMood);
        setIntensity(mood.intensity);
        setNotes(mood.notes || '');
        setTriggers(mood.triggers?.join(', ') || '');
      } else {
        setSelectedPrimary(null);
        setSelectedSecondary(null);
        setIntensity(3);
        setNotes('');
        setTriggers('');
      }
    };

    loadMoodForDate();
  }, [selectedDate, moods]);

  const handleSaveMood = async () => {
    if (!selectedPrimary) {
      setMessage('Please select a primary emotion');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!token) {
      setMessage('You need to be logged in to save moods');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const API_BASE_URL = 'http://localhost:5000';
      const dateString = toLocalDateKey(selectedDate);
      const response = await fetch(`${API_BASE_URL}/api/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: dateString,
          primaryMood: selectedPrimary,
          secondaryMood: selectedSecondary,
          intensity,
          notes,
          triggers: triggers ? triggers.split(',').map(t => t.trim()) : []
        })
      });

      if (response.ok) {
        const mood = await response.json();
        const dateKey = toLocalDateKey(selectedDate);
        setMoods(prev => ({
          ...prev,
          [dateKey]: mood
        }));
        setShowWheel(false);
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      setMessage('Failed to save mood');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getDaysInMonth = () => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(year, month, 1).getDay();
  };

  const getMoodColor = (moodDate) => {
    const dateKey = toLocalDateKey(moodDate);
    const mood = moods[dateKey];
    if (!mood) return 'transparent';

    return PRIMARY_COLORS[mood.primaryMood] || '#D3D3D3';
  };

  const renderCalendar = () => {
    const days = [];
    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfMonth();

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = toLocalDateKey(date);
      const isToday = dateKey === toLocalDateKey(new Date());
      const isSelected = dateKey === toLocalDateKey(selectedDate);
      const moodColor = getMoodColor(date);

      const mood = moods[dateKey];
      const emoji = mood ? mood.primaryMood.split(' ')[0] : '';
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          style={{
            backgroundColor: moodColor,
            borderColor: isSelected ? 'var(--accent-color)' : 'var(--border-color)',
            borderWidth: isSelected ? '3px' : '1px',
            color: moodColor ? getTextColor(moodColor) : 'var(--text-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px'
          }}
          onClick={() => setSelectedDate(date)}
        >
          {emoji && <div style={{ fontSize: '20px' }}>{emoji}</div>}
          <div>{day}</div>
        </div>
      );
    }

    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  if (!user) {
    return <div className="mood-container">Loading...</div>;
  }

  return (
    <div className="mood-container">
      {message && <div className="message-notification error">{message}</div>}
      <h1>🎭 Mood Tracker</h1>

      <div className="mood-layout">
        <div className="mood-calendar-section">
          <div className="calendar-header">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              className="calendar-nav-btn"
            >
              ◀
            </button>
            <h2>{monthNames[month]} {year}</h2>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              className="calendar-nav-btn"
            >
              ▶
            </button>
          </div>

          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday-header">{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {renderCalendar()}
          </div>

          <div className="mood-legend">
            <div className="legend-title">Mood Legend:</div>
            <div className="legend-items">
              {EMOTIONS.primary.map(emotion => (
                <div key={emotion} className="legend-item">
                  <span className="legend-color" style={{
                    backgroundColor: PRIMARY_COLORS[emotion]
                  }}></span>
                  <span>{emotion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mood-detail-section">
          <div className="mood-date-display">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          {!showWheel ? (
            <div className="mood-display">
              {selectedPrimary ? (
                <div className="mood-current">
                  <div className="current-mood">
                    <div className="mood-emoji" style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '50px',
                      backgroundColor: PRIMARY_COLORS[selectedPrimary] || '#D3D3D3',
                      color: getTextColor(PRIMARY_COLORS[selectedPrimary] || '#D3D3D3')
                    }}></div>
                    <div className="mood-text">
                      <p className="primary-mood">{selectedPrimary}</p>
                      {selectedSecondary && <p className="secondary-mood">{selectedSecondary}</p>}
                      <p className="intensity">Intensity: {intensity}/5</p>
                    </div>
                  </div>

                  {notes && <div className="mood-notes"><strong>Notes:</strong> {notes}</div>}
                  {triggers && <div className="mood-triggers"><strong>Triggers:</strong> {triggers}</div>}
                </div>
              ) : (
                <div className="no-mood">
                  <p>No mood recorded for this day</p>
                </div>
              )}

              <button onClick={() => setShowWheel(true)} className="btn btn-primary mood-edit-btn">
                {selectedPrimary ? 'Edit Mood' : 'Add Mood'}
              </button>
            </div>
          ) : (
            <div className="mood-wheel-section">
              <div className="emotion-wheel">
                <div className="wheel-stage">
                  {!selectedPrimary ? (
                    <div className="primary-emotions">
                      <p className="wheel-label">How are you feeling?</p>
                      <div className="emotions-grid">
                        {EMOTIONS.primary.map(emotion => (
                          <button
                            key={emotion}
                            className="emotion-btn"
                            onClick={() => setSelectedPrimary(emotion)}
                            style={{
                              backgroundColor: PRIMARY_COLORS[emotion],
                              color: getTextColor(PRIMARY_COLORS[emotion])
                            }}
                          >
                            {emotion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="secondary-emotions">
                      <button className="back-btn" onClick={() => {
                        setSelectedPrimary(null);
                        setSelectedSecondary(null);
                      }}>← Change Primary</button>
                      <p className="wheel-label">More specifically...</p>
                      <div className="emotions-grid">
                        <button
                          className={`emotion-btn ${!selectedSecondary ? 'selected' : ''}`}
                          onClick={() => setSelectedSecondary(null)}
                          style={{
                            backgroundColor: PRIMARY_COLORS[selectedPrimary],
                            color: getTextColor(PRIMARY_COLORS[selectedPrimary])
                          }}
                        >
                          {selectedPrimary}
                        </button>
                        {EMOTIONS.secondary[selectedPrimary]?.map((emotion, index) => {
                          const shades = getSecondaryShades(selectedPrimary);
                          return (
                            <button
                              key={emotion}
                              className={`emotion-btn ${selectedSecondary === emotion ? 'selected' : ''}`}
                              onClick={() => setSelectedSecondary(emotion)}
                              style={{
                                backgroundColor: shades[index],
                                color: getTextColor(shades[index])
                              }}
                            >
                              {emotion}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {selectedPrimary && (
                  <div className="mood-details-form">
                    <div className="form-group">
                      <label>Intensity (1-5)</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={intensity}
                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                      />
                      <div className="intensity-display">{intensity}/5</div>
                    </div>

                    <div className="form-group">
                      <label>Triggers (comma-separated)</label>
                      <input
                        type="text"
                        value={triggers}
                        onChange={(e) => setTriggers(e.target.value)}
                        placeholder="e.g., Coffee, Sleep deprivation, Work stress"
                      />
                    </div>

                    <div className="form-group">
                      <label>Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any additional notes about your mood..."
                        rows="3"
                      />
                    </div>

                    <div className="form-buttons">
                      <button onClick={handleSaveMood} className="btn btn-primary">
                        Save Mood
                      </button>
                      <button onClick={() => setShowWheel(false)} className="btn btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mood;
