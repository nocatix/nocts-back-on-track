import React, { useState, useEffect, useContext } from 'react';
import './AddictionDetail.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import WithdrawalTimeline from '../components/WithdrawalTimeline';
import { getFrequencyLabel } from '../utils/withdrawalHelper';

const WITHDRAWAL_TIMELINES = {
  'nicotine': [
    { day: 1, symptom: '🔴 PEAK DIFFICULTY: Intense cravings, irritability, anxiety', severity: 'high' },
    { day: 3, symptom: '🔴 Severe cravings peak. Sleep disruption, restlessness', severity: 'high' },
    { day: 4, symptom: '🔴 Headaches, difficulty concentrating, mood swings', severity: 'high' },
    { day: 7, symptom: '🟡 One week milestone! Cravings still intense but becoming manageable', severity: 'high' },
    { day: 14, symptom: '🟡 Cravings decrease by 50%. Sleep improving, energy returning', severity: 'medium' },
    { day: 21, symptom: '🟡 Three weeks - physical withdrawal mostly gone. Mental cravings remain', severity: 'medium' },
    { day: 30, symptom: '🟢 ONE MONTH! Cravings much less frequent. Taste/smell returning', severity: 'low' },
    { day: 60, symptom: '🟢 Two months - significant psychological improvement. Sleep normalized', severity: 'low' },
    { day: 90, symptom: '🟢 THREE MONTHS! Brain chemistry largely recovered. Major milestone', severity: 'low' },
    { day: 180, symptom: '🟢 Six months - cravings rare. Breathing capacity noticeably improved', severity: 'low' },
    { day: 365, symptom: '🏆 ONE YEAR SMOKE-FREE! Your health and lungs are significantly healed', severity: 'low' }
  ],
  'alcohol': [
    { day: 1, symptom: '🔴 PEAK DIFFICULTY: Tremors, sweating, anxiety, sleep problems', severity: 'high' },
    { day: 2, symptom: '🔴 Worst symptoms. Heart palpitations, vivid dreams, nausea', severity: 'high' },
    { day: 3, symptom: '🔴 Confusion possible, peak discomfort. Blood pressure elevated', severity: 'high' },
    { day: 5, symptom: '🔴 Physical symptoms still intense but beginning to stabilize', severity: 'high' },
    { day: 7, symptom: '🟡 ONE WEEK! Physical symptoms reducing. Sleep still disrupted', severity: 'medium' },
    { day: 14, symptom: '🟡 Two weeks - tremors gone, but anxiety and mood swings continue', severity: 'medium' },
    { day: 21, symptom: '🟡 Three weeks - headaches fading, mental clarity improving', severity: 'medium' },
    { day: 30, symptom: '🟢 ONE MONTH! Most physical symptoms resolved. Energy returning', severity: 'low' },
    { day: 60, symptom: '🟢 Two months - sleep normalized, anxiety greatly reduced', severity: 'low' },
    { day: 90, symptom: '🟢 THREE MONTHS! Liver function beginning to improve', severity: 'low' },
    { day: 180, symptom: '🟢 Six months - major psychological shifts. Cravings rare', severity: 'low' },
    { day: 365, symptom: '🏆 ONE YEAR SOBER! Liver and brain function significantly improved', severity: 'low' }
  ],
  'cannabis': [
    { day: 1, symptom: '🔴 PEAK DIFFICULTY: Irritability, anxiety, insomnia', severity: 'high' },
    { day: 2, symptom: '🔴 Mood swings, intense cravings, vivid dreams/nightmares', severity: 'high' },
    { day: 3, symptom: '🔴 Worst symptoms. Restlessness, headaches, loss of appetite', severity: 'high' },
    { day: 5, symptom: '🔴 Sleep problems continue. Irritability still high. Appetite returning', severity: 'high' },
    { day: 7, symptom: '🟡 ONE WEEK! Cravings still strong but manageable. Sleep improving', severity: 'high' },
    { day: 14, symptom: '🟡 Two weeks - mood stabilizing. Concentration returning. Night sweats stop', severity: 'medium' },
    { day: 21, symptom: '🟡 Three weeks - cravings much less frequent. Mental clarity improving', severity: 'medium' },
    { day: 30, symptom: '🟢 ONE MONTH! Physical withdrawal mostly complete. Sleep normalized', severity: 'low' },
    { day: 60, symptom: '🟢 Two months - psychological withdrawal easing. Energy high', severity: 'low' },
    { day: 90, symptom: '🟢 THREE MONTHS! Brain chemistry rebalancing. Motivation returning', severity: 'low' },
    { day: 180, symptom: '🟢 Six months - memory and focus noticeably improved', severity: 'low' },
    { day: 365, symptom: '🏆 ONE YEAR CANNABIS-FREE! Mental clarity and motivation fully restored', severity: 'low' }
  ],
  'nicotine-vaping': [
    { day: 1, symptom: '🔴 PEAK DIFFICULTY: Intense cravings, anxiety, irritability', severity: 'high' },
    { day: 3, symptom: '🔴 Severe cravings, trouble concentrating, mood swings', severity: 'high' },
    { day: 7, symptom: '🟡 ONE WEEK! Cravings still intense. Sleep disrupted', severity: 'high' },
    { day: 14, symptom: '🟡 Cravings decreasing. Lungs starting to clear', severity: 'medium' },
    { day: 30, symptom: '🟢 ONE MONTH! Cravings manageable. Breathing capacity improving', severity: 'low' },
    { day: 90, symptom: '🟢 THREE MONTHS! Lungs significantly recovered', severity: 'low' },
    { day: 365, symptom: '🏆 ONE YEAR VAPE-FREE! Respiratory health greatly improved', severity: 'low' }
  ],
  'default': [
    { day: 1, symptom: '🔴 Initial withdrawal begins. Expect strong cravings and mood changes', severity: 'high' },
    { day: 3, symptom: '🔴 PEAK DIFFICULTY. This is the hardest time. Stay strong!', severity: 'high' },
    { day: 7, symptom: '🟡 ONE WEEK! You\'ve made it through the worst. It gets easier from here', severity: 'high' },
    { day: 14, symptom: '🟡 Two weeks - physical symptoms improving. Mental cravings persist', severity: 'medium' },
    { day: 21, symptom: '🟡 Three weeks - significant progress. Keep pushing!', severity: 'medium' },
    { day: 30, symptom: '🟢 ONE MONTH! Major milestone reached. Mostly smooth sailing ahead', severity: 'low' },
    { day: 60, symptom: '🟢 Two months - strong momentum. New habits forming', severity: 'low' },
    { day: 90, symptom: '🟢 THREE MONTHS! Three month victory. Your brain is healing', severity: 'low' },
    { day: 180, symptom: '🟢 Six months - cravings rare. You\'ve got this!', severity: 'low' },
    { day: 365, symptom: '🏆 ONE YEAR SOBER/CLEAN! Complete transformation. You did it!', severity: 'low' }
  ]
};

export default function AddictionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [addiction, setAddiction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [caved, setCaved] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAddiction = async () => {
      try {
        const response = await axios.get(`/api/addictions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddiction(response.data);
        
        // Select timeline based on addiction name
        const selectedTimeline = WITHDRAWAL_TIMELINES[response.data.name.toLowerCase()] || WITHDRAWAL_TIMELINES.default;
        setTimeline(selectedTimeline);

        // Check for new achievements
        await axios.post(`/api/achievements/check/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        setError('Failed to load addiction details');
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchAddiction();
    }
  }, [id, token]);

  useEffect(() => {
    // Scroll to element if there's a URL fragment
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [addiction]);

  const handleCaved = async () => {
    if (window.confirm('Are you sure you want to log that you caved? This will reset your streak.')) {
      try {
        // Update the addiction to mark it as caved
        await axios.put(`/api/addictions/${id}/caved`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update the UI to show that we've caved
        setCaved(true);
        
        // Show a success message
        setMessage('You caved. Your streak has been reset. Remember, every day you stay clean is a victory!');
        setTimeout(() => setMessage(''), 4000);
      } catch (err) {
        setError('Failed to log caving');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this addiction?')) {
      try {
        await axios.delete(`/api/addictions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/');
      } catch (err) {
        setError('Failed to delete addiction');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!addiction) return <div>Addiction not found</div>;

  return (
    <div className="addiction-detail">
      {message && <div className="message-notification">{message}</div>}
      <div className="detail-header">
        <h1>{addiction.name}</h1>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Days Since Stopping</h3>
          <p className="stat-value">{addiction.daysStopped}</p>
        </div>

        <div className="stat-card">
          <h3>Total Money Saved</h3>
          <p className="stat-value">${addiction.totalMoneySaved.toFixed(2)}</p>
        </div>

        <div className="stat-card">
          <h3>{getFrequencyLabel(addiction.name)}</h3>
          <p>{addiction.frequencyPerDay}</p>
        </div>

        <div className="stat-card">
          <h3>Cost per Day</h3>
          <p>${addiction.moneySpentPerDay.toFixed(2)}</p>
        </div>
      </div>

      <div className="details-section">
        <h2>Withdrawal Timeline & Milestones</h2>
        <WithdrawalTimeline daysStopped={addiction.daysStopped} timeline={timeline} />
      </div>

      {addiction.notes && (
        <div className="notes-section">
          <h3>Notes</h3>
          <p>{addiction.notes}</p>
        </div>
      )}

      <div className="motivation-section">
        <h3>Keep Going! 🎉</h3>
        <p>Every day is a victory. You're rewiring your brain and reclaiming your life.</p>
      </div>
      
      {!caved && (
        <div className="caved-section">
          <button onClick={handleCaved} className="btn btn-danger caved-button">
            I Caved 😢
          </button>
          <p className="caved-note">
            Click this button if you've used the addiction again. This will reset your streak.
          </p>
        </div>
      )}
      
      {caved && (
        <div className="caved-section">
          <p className="caved-message">
            You've marked this addiction as caved. Your streak has been reset.
          </p>
        </div>
      )}
    </div>
  );
}
