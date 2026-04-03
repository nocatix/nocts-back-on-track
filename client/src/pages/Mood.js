import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Mood.css';
import apiClient from '../api/axiosConfig';

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
  const { t } = useTranslation('tracking');
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
        const response = await apiClient.get(`/api/moods/month/${year}/${month + 1}`);

        const moodMap = {};
        response.data.forEach((mood) => {
          const dateKey = toLocalDateKey(new Date(mood.date));
          moodMap[dateKey] = mood;
        });
        setMoods(moodMap);
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
      setMessage(t('mood.selectPrimaryError'));
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!token) {
      setMessage(t('mood.loginRequired'));
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const dateString = toLocalDateKey(selectedDate);
      const response = await apiClient.post('/api/moods', {
        date: dateString,
        primaryMood: selectedPrimary,
        secondaryMood: selectedSecondary,
        intensity,
        notes,
        triggers: triggers ? triggers.split(',').map((t) => t.trim()) : []
      });

      const mood = response.data;
      const dateKey = toLocalDateKey(selectedDate);
      setMoods((prev) => ({
        ...prev,
        [dateKey]: mood
      }));
      setShowWheel(false);
    } catch (error) {
      console.error('Error saving mood:', error);
      setMessage(t('mood.saveFailed'));
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

  const monthNames = t('mood.monthNames', { returnObjects: true });

  if (!user) {
    return <div className="mood-container">{t('mood.loading')}</div>;
  }

  return (
    <div className="mood-container">
      {message && <div className="message-notification error">{message}</div>}
      <h1>{t('mood.pageTitle')}</h1>

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
            {t('mood.weekdays', { returnObjects: true }).map(day => (
              <div key={day} className="weekday-header">{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {renderCalendar()}
          </div>

          <div className="mood-legend">
            <div className="legend-title">{t('mood.moodLegend')}</div>
            <div className="legend-items">
              {t('mood.emotions.primary', { returnObjects: true }).map(emotion => (
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
                      <p className="intensity">{t('mood.intensityStatusDisplay', { intensity })}</p>
                    </div>
                  </div>

                  {notes && <div className="mood-notes"><strong>{t('mood.notesTitle')}</strong> {notes}</div>}
                  {triggers && <div className="mood-triggers"><strong>{t('mood.triggersTitle')}</strong> {triggers}</div>}
                </div>
              ) : (
                <div className="no-mood">
                  <p>{t('mood.noMoodRecorded')}</p>
                </div>
              )}

              <button onClick={() => setShowWheel(true)} className="btn btn-primary mood-edit-btn">
                {selectedPrimary ? t('mood.editMood') : t('mood.addMood')}
              </button>
            </div>
          ) : (
            <div className="mood-wheel-section">
              <div className="emotion-wheel">
                <div className="wheel-stage">
                  {!selectedPrimary ? (
                    <div className="primary-emotions">
                      <p className="wheel-label">{t('mood.howAreYouFeeling')}</p>
                      <div className="emotions-grid">
                        {t('mood.emotions.primary', { returnObjects: true }).map(emotion => (
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
                      }}>{t('mood.changePrimary')}</button>
                      <p className="wheel-label">{t('mood.moreSpecifically')}</p>
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
                        {t('mood.emotions.secondary', { returnObjects: true })[selectedPrimary]?.map((emotion, index) => {
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
                      <label>{t('mood.intensityFormLabel')}</label>
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
                      <label>{t('mood.triggersLabel')}</label>
                      <input
                        type="text"
                        value={triggers}
                        onChange={(e) => setTriggers(e.target.value)}
                        placeholder={t('mood.triggersPlaceholder')}
                      />
                    </div>

                    <div className="form-group">
                      <label>{t('mood.notesLabel')}</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t('mood.notesPlaceholder')}
                        rows="3"
                      />
                    </div>

                    <div className="form-buttons">
                      <button onClick={handleSaveMood} className="btn btn-primary">
                        {t('mood.saveMoodButton')}
                      </button>
                      <button onClick={() => setShowWheel(false)} className="btn btn-secondary">
                        {t('mood.cancelButton')}
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
