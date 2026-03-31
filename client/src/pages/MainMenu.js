import React, { useState, useEffect, useContext } from 'react';
import './MainMenu.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AddictionCard from '../components/AddictionCard';
import { calculateDailyPredictions, formatDayCount } from '../utils/withdrawalHelper';

export default function MainMenu() {
  const [addictions, setAddictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useContext(AuthContext);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchAddictions = async () => {
      try {
        const response = await axios.get('/api/addictions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddictions(response.data);
        const dailyPredictions = calculateDailyPredictions(response.data);
        setPredictions(dailyPredictions);
      } catch (err) {
        setError('Failed to load addictions');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAddictions();
    }
  }, [token]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="main-menu">
      {error && <p className="error">{error}</p>}

      <h2>Welcome, {user?.fullName}</h2>

      {predictions.length > 0 && (
        <div className="daily-predictions">
          <h2>📊 Today's Outlook</h2>
          <div className="predictions-grid">
            {predictions.map((pred, idx) => (
              <div key={idx} className="prediction-card">
                <div className="prediction-header">
                  <h3>{pred.name}</h3>
                  <span className="days-count">{formatDayCount(pred.daysSoFar)}</span>
                </div>
                
                <div className="withdrawal-stage">
                  <span className={`difficulty ${pred.stage.difficulty.toLowerCase().replace(/\s+/g, '-')}`}>
                    {pred.stage.difficulty}
                  </span>
                  <p className="stage-symptom">{pred.stage.symptom}</p>
                </div>

                <div className="daily-tip">
                  <strong>💡 Today's Tip:</strong>
                  <p>{pred.tip}</p>
                </div>

                {pred.moneySpent > 0 && (
                  <div className="money-saved">
                    <small>💰 Saving ~${(pred.moneySpent * pred.daysSoFar).toFixed(2)} since you quit!</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
