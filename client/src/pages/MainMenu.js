import React, { useState, useEffect, useContext } from 'react';
import './MainMenu.css';
import apiClient from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { calculateDailyPredictions, formatDayCount, getWithdrawalStage } from '../utils/withdrawalHelper';
import { getCookie, setCookie } from '../utils/cookieHelper';
import { getRandomQuote } from '../data/motivationalQuotes';

export default function MainMenu() {
  const [addictions, setAddictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [showCravingModal, setShowCravingModal] = useState(false);
  const [cravingResult, setCravingResult] = useState(null);
  const [cravingStep, setCravingStep] = useState('initial');
  const [randomMemory, setRandomMemory] = useState(null);
  const [showDailyTip, setShowDailyTip] = useState(() => {
    const saved = getCookie('showDailyTip');
    return saved !== null ? saved : true;
  });
  const [dailyQuote, setDailyQuote] = useState('');

  useEffect(() => {
    const fetchAddictions = async () => {
      try {
        const response = await apiClient.get('/api/addictions');
        console.log('Fetched addictions:', response.data);
        setAddictions(response.data);
        const dailyPredictions = calculateDailyPredictions(response.data);
        console.log('Daily predictions:', dailyPredictions);
        setPredictions(dailyPredictions);
      } catch (err) {
        setError('Failed to load addictions');
      } finally {
        setLoading(false);
      }
    };

    const checkTrophies = async () => {
      try {
        await apiClient.post('/api/trophies/check', {});
      } catch (err) {
        console.error('Failed to check trophies:', err);
      }
    };

    if (token) {
      fetchAddictions();
      checkTrophies();
    }
  }, [token]);

  // Save daily tip state to cookie
  useEffect(() => {
    setCookie('showDailyTip', showDailyTip, 365);
  }, [showDailyTip]);

  // Set daily motivational quote
  useEffect(() => {
    setDailyQuote(getRandomQuote());
  }, []);

  const handleCravingSupport = () => {
    setShowCravingModal(true);
    setCravingResult(null);
    setCravingStep('initial');
    fetchRandomMemory();
  };

  const fetchRandomMemory = async () => {
    try {
      const response = await apiClient.get('/api/memories/random');
      setRandomMemory(response.data);
    } catch (err) {
      setRandomMemory(null);
    }
  };

  const handleManagedCraving = () => {
    setCravingResult('success');
    setTimeout(() => {
      setShowCravingModal(false);
      setCravingResult(null);
      setCravingStep('initial');
    }, 3000);
  };

  const handleProceededWithCaving = () => {
    setCravingStep('select-addiction');
  };

  const handleCavingForAddiction = (addictionId) => {
    navigate(`/addiction/${addictionId}#caved-section`);
    setShowCravingModal(false);
    setCravingResult(null);
    setCravingStep('initial');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="main-menu">
      {error && <p className="error">{error}</p>}

      <div className="action-buttons">
        <button className="btn btn-craving" onClick={handleCravingSupport}>
          🚨 I'm About to Cave
        </button>
      </div>

      {showCravingModal && (
        <div className="craving-modal-overlay">
          <div className="craving-modal">
            {cravingStep === 'initial' && !cravingResult ? (
              <>
                <h2>💪 You've Got This!</h2>
                <p className="craving-message">
                  The urge to use won't last forever. It's temporary, and you're stronger than you think. 
                  Take a deep breath, drink some water, and reach out to someone you trust. 
                  You've come so far - don't let a moment of weakness undo all your progress.
                </p>
                <p className="craving-encouragement">
                  Every time you resist, you're rewiring your brain and getting closer to freedom. 
                  You can do this!
                </p>
                
                {randomMemory && (
                  <div className="craving-memory">
                    {randomMemory.imageUrl && (
                      <img src={randomMemory.imageUrl} alt="Memory" className="memory-photo" />
                    )}
                    {randomMemory.message && (
                      <p className="memory-quote">"{randomMemory.message}"</p>
                    )}
                  </div>
                )}
                
                <div className="craving-buttons">
                  <button className="btn btn-success" onClick={handleManagedCraving}>
                    ✅ I Managed My Craving
                  </button>
                  <button className="btn btn-warning" onClick={handleProceededWithCaving}>
                    ❌ I Need Help / Didn't Make It
                  </button>
                </div>
              </>
            ) : cravingStep === 'select-addiction' ? (
              <>
                <h2>📝 Which Addiction?</h2>
                <p className="craving-message">
                  Select which addiction you need to log for:
                </p>
                <div className="addiction-list-modal">
                  {addictions.length > 0 ? (
                    addictions.map((addiction) => (
                      <button
                        key={addiction._id}
                        className="addiction-item-modal"
                        onClick={() => handleCavingForAddiction(addiction._id)}
                      >
                        <span className="addiction-name">{addiction.name}</span>
                        <span className="addiction-days">{addiction.daysStopped} days</span>
                      </button>
                    ))
                  ) : (
                    <p className="no-addictions-message">No addictions to log</p>
                  )}
                </div>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setCravingStep('initial')}
                  style={{ marginTop: '20px', width: '100%' }}
                >
                  ← Back
                </button>
              </>
            ) : cravingResult === 'success' ? (
              <div className="craving-result success">
                <h2>🎉 Amazing Work!</h2>
                <p>You resisted the craving! This is a victory. Each moment you resist makes you stronger.</p>
                <p className="small">This message will close automatically...</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {predictions.length > 0 && (
        <div className="daily-predictions">
          <h2>📊 Today's Outlook</h2>
          <div className="predictions-grid">
            {predictions.map((pred, idx) => (
              <div key={idx} className="prediction-card" onClick={() => navigate(`/addiction/${pred._id}`)}>
                <div className="prediction-header">
                  <h3>{pred.name}</h3>
                  <span className="days-count">{formatDayCount(pred.daysSoFar)}</span>
                </div>
                
                {pred.moneySpent > 0 && (
                  <div className="savings-summary">
                    <div className="saving-item">
                      <span className="saving-label">Today's Savings:</span>
                      <span className="saving-amount">${(pred.dailySavingsSinceMidnight || 0).toFixed(2)}</span>
                    </div>
                    <div className="saving-item">
                      <span className="saving-label">Total Saved:</span>
                      <span className="saving-amount">${(pred.totalMoneySaved || 0).toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                <div className="withdrawal-stage">
                  <span className={`difficulty ${pred.stage.difficulty.toLowerCase().replace(/\s+/g, '-')}`}>
                    {pred.stage.difficulty}
                  </span>
                  <p className="stage-symptom">{pred.stage.symptom}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {predictions.length > 0 && (
        <div className="daily-tips-section">
          <div className="daily-tip-bento">
            <div className="daily-tip-header">
              <strong>💡 Today's Tips:</strong>
              <button className="btn-hint-toggle-arrow" onClick={() => setShowDailyTip(!showDailyTip)}>
                {showDailyTip ? '▼' : '▶'}
              </button>
            </div>
            {showDailyTip && (
              <div className="daily-tips-content">
                {predictions.map((pred, idx) => (
                  <div key={idx} className="daily-tip-item">
                    <h4>{pred.name}</h4>
                    <p>{pred.tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {dailyQuote && (
        <div className="motivational-quote-section">
          <p className="motivational-quote">✨ {dailyQuote}</p>
        </div>
      )}
    </div>
  );
}
