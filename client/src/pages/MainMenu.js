import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './MainMenu.css';
import apiClient from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAddictions } from '../context/AddictionsContext';
import { calculateDailyPredictions, formatDayCount } from '../utils/withdrawalHelper';
import { getCookie, setCookie } from '../utils/cookieHelper';
import { getRandomQuote } from '../data/motivationalQuotes';

export default function MainMenu() {
  const { t } = useTranslation(['messages', 'common']);
  const { addictions } = useAddictions();
  const [pledges, setPledges] = useState([]);
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
  const [duePledge, setDuePledge] = useState(null);
  const [showPledgeConversionModal, setShowPledgeConversionModal] = useState(false);
  const [convertingPledge, setConvertingPledge] = useState(false);
  const [reschedulingPledge, setReschedulingPledge] = useState(false);
  const [newPledgeDate, setNewPledgeDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Calculate predictions from context addictions
        const dailyPredictions = calculateDailyPredictions(addictions);
        console.log('Daily predictions:', dailyPredictions);
        setPredictions(dailyPredictions);

        // Fetch pledges
        const pledgesResponse = await apiClient.get('/api/pledges');
        console.log('Fetched pledges:', pledgesResponse.data);
        setPledges(pledgesResponse.data);

        // Check for due pledges
        const due = pledgesResponse.data.find(pledge => pledge.daysUntilStop <= 0);
        if (due) {
          setDuePledge(due);
          setShowPledgeConversionModal(true);
        }
      } catch (err) {
        setError(t('mainMenu.failedToLoadAddictions'));
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
      fetchData();
      checkTrophies();
    }
  }, [token, addictions, t]);

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

  const handleDeletePledge = async (pledgeId) => {
    try {
      await apiClient.delete(`/api/pledges/${pledgeId}`);
      // Refresh pledges
      const response = await apiClient.get('/api/pledges');
      setPledges(response.data);
    } catch (err) {
      console.error('Failed to delete pledge:', err);
      setError(t('mainMenu.failedToUpdateAddiction'));
    }
  };

  const handleConvertPledgeToAddiction = async () => {
    if (!duePledge) return;

    setConvertingPledge(true);
    try {
      // Convert pledge to addiction
      const response = await apiClient.post(`/api/pledges/${duePledge._id}/convert-to-addiction`);
      const newAddiction = response.data;

      // Close modal
      setShowPledgeConversionModal(false);
      setDuePledge(null);

      // Refresh pledges
      const pledgesResponse = await apiClient.get('/api/pledges');
      setPledges(pledgesResponse.data);

      // Predictions will be recalculated via useEffect when addictions context updates

      // Navigate to the addiction edit page with editMode enabled
      navigate(`/addiction/${newAddiction._id}`, { state: { editMode: true } });
    } catch (err) {
      console.error('Failed to convert pledge:', err);
      setError(err.response?.data?.message || 'Failed to convert pledge to addiction');
    } finally {
      setConvertingPledge(false);
    }
  };

  const handleSkipPledgeConversion = () => {
    setReschedulingPledge(true);
    setNewPledgeDate('');
  };

  const getMinRescheduleDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleRescheduleConfirm = async () => {
    if (!newPledgeDate || !duePledge) return;

    try {
      // Use the date string directly to avoid timezone conversion issues
      const isoDate = newPledgeDate + 'T00:00:00Z';

      await apiClient.put(`/api/pledges/${duePledge._id}`, {
        plannedStopDate: isoDate
      });

      // Refresh pledges
      const pledgesResponse = await apiClient.get('/api/pledges');
      setPledges(pledgesResponse.data);

      // Close modal
      setShowPledgeConversionModal(false);
      setDuePledge(null);
      setReschedulingPledge(false);
      setNewPledgeDate('');
    } catch (err) {
      console.error('Failed to reschedule pledge:', err);
      setError(err.response?.data?.message || 'Failed to reschedule pledge');
    }
  };

  const handleCancelReschedule = () => {
    setReschedulingPledge(false);
    setNewPledgeDate('');
  };

  if (loading) return <div className="loading">{t('loading')}</div>;

  return (
    <div className="main-menu">
      {error && <p className="error">{error}</p>}

      <div className="action-buttons">
        <button className="btn btn-craving" onClick={handleCravingSupport}>
          {t('mainMenu.aboutToCave')}
        </button>
      </div>

      {showCravingModal && (
        <div className="craving-modal-overlay">
          <div className="craving-modal">
            {cravingStep === 'initial' && !cravingResult ? (
              <>
                <h2>{t('mainMenu.craviingSupport')}</h2>
                <p className="craving-message">
                  {t('mainMenu.cravineSupportMessage')}
                </p>
                <p className="craving-encouragement">
                  {t('mainMenu.cravingEncouragement')}
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
                    {t('mainMenu.managedCraving')}
                  </button>
                  <button className="btn btn-warning" onClick={handleProceededWithCaving}>
                    {t('mainMenu.needHelp')}
                  </button>
                </div>
              </>
            ) : cravingStep === 'select-addiction' ? (
              <>
                <h2>{t('mainMenu.whichAddiction')}</h2>
                <p className="craving-message">
                  {t('mainMenu.selectAddictionForLogging')}
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
                    <p className="no-addictions-message">{t('mainMenu.noAddictionsToLog')}</p>
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
                <h2>{t('mainMenu.amazingWork')}</h2>
                <p>{t('mainMenu.resistedCraving')}</p>
                <p className="small">{t('mainMenu.messageClosing')}</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {showPledgeConversionModal && duePledge && (
        <div className="pledge-conversion-modal-overlay">
          <div className="pledge-conversion-modal">
            {!reschedulingPledge ? (
              <>
                <h2>🎯 Time to Stop!</h2>
                <p className="conversion-message">
                  Your pledge to stop <strong>{duePledge.what}</strong> is due today!
                </p>
                <p className="conversion-question">
                  Are you ready to begin your journey without it?
                </p>
                <div className="conversion-buttons">
                  <button 
                    className="btn btn-warning"
                    onClick={handleSkipPledgeConversion}
                    disabled={convertingPledge}
                  >
                    Not Yet
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={handleConvertPledgeToAddiction}
                    disabled={convertingPledge}
                  >
                    {convertingPledge ? 'Starting...' : 'Yes, I\'m Ready! 💪'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>📅 Pick a New Date</h2>
                <p className="reschedule-message">
                  When will you be ready to stop <strong>{duePledge.what}</strong>?
                </p>
                <div className="reschedule-form">
                  <input
                    type="date"
                    value={newPledgeDate}
                    onChange={(e) => setNewPledgeDate(e.target.value)}
                    min={getMinRescheduleDate()}
                    className="reschedule-date-input"
                  />
                  {newPledgeDate && (
                    <p className="reschedule-preview">
                      New stop date: {(() => {
                        const [year, month, day] = newPledgeDate.split('-');
                        const date = new Date(year, parseInt(month) - 1, parseInt(day));
                        return date.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        });
                      })()}
                    </p>
                  )}
                </div>
                <div className="reschedule-buttons">
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCancelReschedule}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleRescheduleConfirm}
                    disabled={!newPledgeDate}
                  >
                    Update Pledge
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {(pledges.length > 0 || predictions.length > 0) && (
        <div className="daily-predictions">
          <h2>{t('mainMenu.todaysOutlook')}</h2>
          
          {/* Pledges Section */}
          {pledges.length > 0 && (
            <div className="pledges-section">
              <h3>📅 Your Pledges to Stop</h3>
              <div className="pledges-list">
                {pledges.map((pledge) => (
                  <div key={pledge._id} className="pledge-item">
                    <div className="pledge-content">
                      <div className="pledge-header">
                        <h4>{pledge.what}</h4>
                        <span className="days-remaining">{pledge.daysUntilStop} days</span>
                      </div>
                      <p className="pledge-date">
                        Stop date: {new Date(pledge.plannedStopDate).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <button 
                      className="btn-delete-pledge" 
                      onClick={() => handleDeletePledge(pledge._id)}
                      title="Delete pledge"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Current Addictions Section */}
          {predictions.length > 0 && (
            <>
              <h3 style={{marginTop: '30px'}}>Your Addictions</h3>
              <div className="predictions-grid">
                {predictions.map((pred, idx) => {
                  return (
                    <div key={idx} className="prediction-container">
                      <div className="prediction-card" onClick={() => navigate(`/addiction/${pred._id}`)}>
                        <div className="prediction-header">
                          <h3>{pred.name}</h3>
                          <span className="days-count">{formatDayCount(pred.daysSoFar)}</span>
                        </div>
                        
                        {pred.moneySpent > 0 && (
                          <div className="savings-summary">
                            <div className="saving-item">
                              <span className="saving-label">{t('mainMenu.todaysSavings')}</span>
                              <span className="saving-amount">${(pred.dailySavingsSinceMidnight || 0).toFixed(2)}</span>
                            </div>
                            <div className="saving-item">
                              <span className="saving-label">{t('mainMenu.totalSaved')}</span>
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
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {predictions.length > 0 && (
        <div className="daily-tips-section">
          <div className="daily-tip-bento">
            <div className="daily-tip-header">
              <strong>{t('mainMenu.todaysTips')}</strong>
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
