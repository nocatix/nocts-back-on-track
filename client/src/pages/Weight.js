import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Weight.css';

const Weight = () => {
  const { t } = useTranslation('tracking');
  const { user, loading, token } = useAuth();
  const [weights, setWeights] = useState([]);
  const [goalWeight, setGoalWeight] = useState(() => {
    const saved = localStorage.getItem('weightGoal');
    return saved ? JSON.parse(saved) : { weight: 0, unit: 'lbs' };
  });
  const [currentWeight, setCurrentWeight] = useState('');
  const [unit, setUnit] = useState(() => {
    // Use user preference, fall back to localStorage, default to 'lbs'
    return 'lbs';
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWeightId, setSelectedWeightId] = useState(null);
  const [selectedWeightValue, setSelectedWeightValue] = useState(null);

  // Fetch weights on mount
  useEffect(() => {
    if (token && user) {
      // Determine correct unit first
      const targetUnit = user.unitPreference === 'metric' ? 'kg' : 'lbs';
      setUnit(targetUnit);
      
      // Then fetch weights with the correct unit
      fetchWeightsWithUnit(targetUnit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  // Update goal weight display when unit changes
  useEffect(() => {
    const saved = localStorage.getItem('weightGoal');
    if (saved) {
      try {
        const goal = JSON.parse(saved);
        // Goal is stored in kg, convert for display
        let displayGoalWeight = parseFloat(goal.weight);
        if (unit === 'lbs') {
          displayGoalWeight = (displayGoalWeight * 2.20462).toFixed(2);
        }
        setGoalWeight({ weight: displayGoalWeight, unit });
      } catch (err) {
        console.error('Error loading goal weight:', err);
      }
    }
    
    // Refetch weights when unit changes to ensure correct conversion
    if (token) {
      fetchWeightsWithUnit(unit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, token]);

  const fetchWeights = async () => {
    fetchWeightsWithUnit(unit);
  };

  const fetchWeightsWithUnit = async (targetUnit) => {
    try {
      const API_BASE_URL = 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/weights`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        console.error(`Error fetching weights: ${response.status} ${response.statusText}`);
        return;
      }

      try {
        const data = await response.json();
        // Convert weights from kg (storage unit) to display unit
        convertWeights(data, targetUnit);
      } catch (parseError) {
        console.error('Failed to parse weights response:', parseError);
        console.error('Response status:', response.status);
      }
    } catch (err) {
      console.error('Error fetching weights:', err);
    }
  };

  const convertWeights = (dataWeights, targetUnit) => {
    const converted = dataWeights.map(w => {
      let displayWeight = parseFloat(w.weight);
      // All weights in DB are in kg, convert to lbs if needed for display
      if (targetUnit === 'lbs') {
        displayWeight = (displayWeight * 2.20462).toFixed(2);
      }
      return {
        ...w,
        weight: displayWeight,
        originalWeight: w.weight,
        unit: targetUnit
      };
    });
    setWeights(converted);
  };

  const handleLogWeight = async (e) => {
    e.preventDefault();

    if (!currentWeight || currentWeight <= 0) {
      setMessage('Please enter a valid weight');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const API_BASE_URL = 'http://localhost:5000';
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      // Convert weight to kg for storage
      let weightInKg = parseFloat(currentWeight);
      if (unit === 'lbs') {
        weightInKg = (weightInKg / 2.20462).toFixed(2);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/weights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          weight: weightInKg,
          unit: 'kg',
          date: dateTime.toISOString()
        })
      });

      if (response.ok) {
        setCurrentWeight('');
        const now = new Date();
        setSelectedDate(now.toISOString().split('T')[0]);
        setSelectedTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
        fetchWeights();
      } else {
        setMessage('Error logging weight');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error logging weight:', err);
      setMessage('Error logging weight');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSetGoal = (e) => {
    e.preventDefault();
    // Convert goal weight to kg for storage
    let goalWeightInKg = parseFloat(goalWeight.weight);
    if (unit === 'lbs') {
      goalWeightInKg = (goalWeightInKg / 2.20462).toFixed(2);
    }
    
    const newGoal = { weight: goalWeightInKg, unit: 'kg' };
    localStorage.setItem('weightGoal', JSON.stringify(newGoal));
    
    // Convert back to display unit for UI
    let displayGoalWeight = goalWeightInKg;
    if (unit === 'lbs') {
      displayGoalWeight = (goalWeightInKg * 2.20462).toFixed(2);
    }
    setGoalWeight({ weight: displayGoalWeight, unit });
    setShowGoalForm(false);
  };

  const handleDeleteWeight = (id, weight) => {
    setSelectedWeightId(id);
    setSelectedWeightValue(weight);
    setShowDeleteModal(true);
  };

  const confirmDeleteWeight = async () => {
    try {
      const API_BASE_URL = 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/weights/${selectedWeightId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setMessage('Weight entry deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchWeights();
        setShowDeleteModal(false);
        setSelectedWeightId(null);
        setSelectedWeightValue(null);
      }
    } catch (err) {
      console.error('Error deleting weight:', err);
      setMessage('Failed to delete weight entry');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getMonthWeights = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    return weights.filter(w => {
      const date = new Date(w.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const dateLocale = unit === 'kg' ? 'en-GB' : 'en-US';

  const formatDate = (dateValue, options = {}) => {
    return new Date(dateValue).toLocaleDateString(dateLocale, options);
  };

  // Calculate linear regression trendline
  const calculateTrendline = (points, CHART_LEFT, CHART_RIGHT, CHART_BOTTOM, minWeight, range) => {
    if (points.length < 2) return null;

    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    points.forEach((p, i) => {
      sumX += i;
      sumY += p.weight;
      sumXY += i * p.weight;
      sumX2 += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate trendline points
    const trendPoints = points.map((p, i) => {
      const trendWeight = slope * i + intercept;
      const trendY = CHART_BOTTOM - ((trendWeight - minWeight) / range) * (CHART_BOTTOM - 0);
      return { x: p.x, y: trendY };
    });

    const trendPathData = trendPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return trendPathData;
  };

  const renderGraph = () => {
    const sortedWeights = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortedWeights.length === 0) return null;

    const CHART_LEFT = 30;
    const CHART_RIGHT = 330;
    const CHART_TOP = 0;
    const CHART_BOTTOM = 150;
    const CHART_WIDTH = CHART_RIGHT - CHART_LEFT;
    const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP;

    const minWeight = Math.min(...sortedWeights.map(w => parseFloat(w.weight))) - 5;
    const maxWeight = Math.max(...sortedWeights.map(w => parseFloat(w.weight))) + 5;
    const range = maxWeight - minWeight;

    const points = sortedWeights.map((w, index) => {
      const x = CHART_LEFT + (index / (sortedWeights.length - 1 || 1)) * CHART_WIDTH;
      const y = CHART_BOTTOM - ((parseFloat(w.weight) - minWeight) / range) * CHART_HEIGHT;
      const date = new Date(w.date);
      return {
        x,
        y,
        weight: parseFloat(w.weight),
        weightLabel: Number.parseFloat(w.weight).toFixed(1),
        dateLabel: formatDate(date, { month: 'numeric', day: 'numeric' }),
        date: formatDate(date)
      };
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const trendlineData = calculateTrendline(points, CHART_LEFT, CHART_RIGHT, CHART_BOTTOM, minWeight, range);
    const goalY = goalWeight.weight > 0 ? CHART_BOTTOM - ((goalWeight.weight - minWeight) / range) * CHART_HEIGHT : null;

    return (
      <div className="weight-graph-container">
        <svg viewBox="0 0 350 225" className="weight-graph">
          {/* Grid lines */}
          {[0, 50, 100, 150].map((y) => (
            <line key={`grid-${y}`} x1="30" y1={y} x2="330" y2={y} className="grid-line" />
          ))}

          {/* Goal weight line */}
          {goalY !== null && (
            <line x1={CHART_LEFT} y1={goalY} x2={CHART_RIGHT} y2={goalY} className="goal-line" />
          )}

          {/* Trendline (linear regression) */}
          {trendlineData && (
            <path d={trendlineData} className="trend-line" />
          )}

          {/* Weight trend line */}
          <path d={pathData} className="weight-line" />

          {/* Per-point axis markers and guides */}
          {points.map((p, i) => (
            <g key={`marker-${i}`}>
              <line x1={p.x} y1={p.y} x2={p.x} y2={CHART_BOTTOM} className="point-guide" />
              <line x1={CHART_LEFT} y1={p.y} x2={p.x} y2={p.y} className="point-guide" />
              <line x1={p.x} y1={CHART_BOTTOM} x2={p.x} y2={CHART_BOTTOM + 4} className="axis-marker" />
              <line x1={CHART_LEFT - 4} y1={p.y} x2={CHART_LEFT} y2={p.y} className="axis-marker" />
              <text
                x={p.x}
                y={CHART_BOTTOM + 14 + (i % 2) * 10}
                className="axis-point-label x-point-label"
                textAnchor="middle"
              >
                {p.dateLabel}
              </text>
              <text
                x={CHART_LEFT - 8}
                y={p.y + 3}
                className="axis-point-label y-point-label"
                textAnchor="end"
              >
                {p.weightLabel}
              </text>
            </g>
          ))}

          {/* Data points */}
          {points.map((p, i) => (
            <circle key={`point-${i}`} cx={p.x} cy={p.y} r="3" className="weight-point">
              <title>{`${p.date} - ${p.weightLabel} ${unit}`}</title>
            </circle>
          ))}

          {/* Axes */}
          <line x1={CHART_LEFT} y1={CHART_TOP} x2={CHART_LEFT} y2={CHART_BOTTOM} className="axis" />
          <line x1={CHART_LEFT} y1={CHART_BOTTOM} x2={CHART_RIGHT} y2={CHART_BOTTOM} className="axis" />
          
          {/* Y-axis label */}
          <text x="10" y="75" className="axis-label y-axis-label" textAnchor="middle">
            {`Weight (${unit})`}
          </text>
          
          {/* X-axis label */}
          <text x="180" y="215" className="axis-label x-axis-label" textAnchor="middle">
            Time
          </text>
          
          {/* Y-axis tick labels */}
          <text x="25" y="10" className="tick-label" textAnchor="end">{maxWeight.toFixed(0)}</text>
          <text x="25" y="155" className="tick-label" textAnchor="end">{minWeight.toFixed(0)}</text>
        </svg>
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthWeights = getMonthWeights();
    const monthWeightMap = {};

    monthWeights.forEach(w => {
      const date = new Date(w.date);
      const day = date.getDate();
      monthWeightMap[day] = w;
    });

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button
            className="calendar-nav-btn prev-btn"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            ◀
          </button>
          <span className="calendar-month-display">
            {formatDate(currentMonth, { month: 'long', year: 'numeric' })}
          </span>
          <button
            className="calendar-nav-btn next-btn"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            ▶
          </button>
        </div>

        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}

          {days.map((day, index) => {
            const weight = day ? monthWeightMap[day] : null;
            const bgColor = weight ? weight.originalWeight ? '#e8f5e9' : '#fff9c4' : 'transparent';

            return (
              <div
                key={index}
                className="calendar-day"
                style={{ backgroundColor: bgColor }}
              >
                {day && (
                  <>
                    <div className="calendar-day-number">{day}</div>
                    {weight && (
                      <div className="calendar-day-weight">
                        {parseFloat(weight.weight).toFixed(1)} {unit}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">{t('weight.loading')}</div>;
  if (!user) return <div className="loading">{t('weight.pleaseLogin')}</div>;

  return (
    <div className="weight-tracker">
      <h1>{t('weight.pageTitle')}</h1>

      {message && <div className="message">{message}</div>}

      <div className="weight-container">
        {/* Stats Section */}
        <div className="weight-stats-section">
          {weights.length > 0 && (
            <div className="weight-stats">
              <div className="stat-item">
                <label>{t('weight.latestWeight')}</label>
                <span className="stat-value">{parseFloat(weights[0].weight).toFixed(1)} {weights[0].unit}</span>
              </div>
              <div className="stat-item">
                <label>{t('weight.goalWeight')}</label>
                <span className="stat-value">{goalWeight.weight > 0 ? `${goalWeight.weight} ${goalWeight.unit}` : t('weight.notSet')}</span>
              </div>
              {goalWeight.weight > 0 && weights.length > 0 && (
                <div className="stat-item">
                  <label>{t('weight.difference')}</label>
                  <span className="stat-value">
                    {(weights[0].weight - goalWeight.weight).toFixed(1)} {unit}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Log Weight Form */}
        <div className="weight-form-container">
          <form onSubmit={handleLogWeight} className="weight-form bento-box">
            <h2>{t('weight.logWeightTitle')}</h2>

            <div className="form-group">
              <label>{t('weight.weightLabel')} ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder={t('weight.enterWeight')}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('weight.dateLabel')}</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('weight.timeLabel')}</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">{t('weight.logWeightButton')}</button>
          </form>

          {/* Goal Weight Section */}
          <div className="goal-weight-section bento-box">
            <h2>{t('weight.goalWeightTitle')}</h2>
            {!showGoalForm ? (
              <>
                <div className="goal-display">
                  <p>{goalWeight.weight > 0 ? `${goalWeight.weight} ${goalWeight.unit}` : t('weight.noGoalSet')}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowGoalForm(true)}
                >
                  {goalWeight.weight > 0 ? t('weight.updateGoal') : t('weight.setGoal')}
                </button>
              </>
            ) : (
              <form onSubmit={handleSetGoal}>
                <div className="form-group">
                  <label>{t('weight.goalWeightLabel')} ({unit === 'lbs' ? 'lbs' : 'kg'})</label>
                  <input
                    type="number"
                    step="0.1"
                    value={goalWeight.weight}
                    onChange={(e) => setGoalWeight({ ...goalWeight, weight: e.target.value, unit })}
                    placeholder={t('weight.enterGoalWeight')}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary">{t('weight.saveGoalButton')}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowGoalForm(false)}>
                    {t('weight.cancelButton')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Graph Section */}
        {weights.length > 0 && (
          <div className="weight-graph-section bento-box">
            <h2>{t('weight.weightTrendTitle')}</h2>
            {renderGraph()}
          </div>
        )}

        {/* Calendar and History */}
        <div className="weight-history-section">
          <div className="weight-calendar bento-box">
            <h2>{t('weight.weightCalendarTitle')}</h2>
            {renderCalendar()}
          </div>

          <div className="weight-list bento-box">
            <h2>{t('weight.weightHistoryTitle')}</h2>
            <div className="weight-list-container">
              {weights.length === 0 ? (
                <p className="no-data">{t('weight.noDataMessage')}</p>
              ) : (
                weights.map((w, index) => (
                  <div key={w._id || index} className="weight-entry">
                    <div className="entry-info">
                      <span className="entry-weight">{parseFloat(w.weight).toFixed(1)} {w.unit}</span>
                      <span className="entry-date">{formatDate(w.date)} at {new Date(w.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteWeight(w._id, w)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Weight Modal */}
      {showDeleteModal && selectedWeightValue && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{t('weight.deleteEntryTitle')}</h3>
            <p>{t('weight.deleteConfirmation')}</p>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              {parseFloat(selectedWeightValue.weight).toFixed(1)} {selectedWeightValue.unit} on {formatDate(selectedWeightValue.date)}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {t('weight.deleteWarning')}
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="cancel-button"
              >
                {t('weight.cancelButton')}
              </button>
              <button 
                onClick={confirmDeleteWeight}
                className="confirm-delete-button"
              >
                {t('weight.deleteEntryButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weight;
