import React, { useState, useEffect, useContext } from 'react';
import './AddictionDetail.css';
import apiClient from '../api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import WithdrawalTimeline from '../components/WithdrawalTimeline';
import { getFrequencyLabel, getCostLabel } from '../utils/withdrawalHelper';
import { addictionDatabase } from '../data/addictions';

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
  const [showCavedConfirm, setShowCavedConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchAddiction = async () => {
      try {
        const response = await apiClient.get(`/api/addictions/${id}`);
        const addictionData = response.data;
        
        // Calculate daysStopped if not provided by backend
        if (!addictionData.daysStopped && addictionData.startDate) {
          const startDate = new Date(addictionData.startDate);
          const today = new Date();
          const daysStopped = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
          addictionData.daysStopped = daysStopped;
        }
        
        setAddiction(addictionData);
        
        // Get addiction data from the database using the addictionType from backend
        const addictionType = addictionData.addictionType;
        console.log('Addiction type from backend:', addictionType);
        console.log('Addiction data keys:', Object.keys(addictionData));
        
        if (!addictionType) {
          console.warn('No addiction type found in response');
          setTimeline({});
        } else {
          // Search through all keys to find matching addiction
          let databaseAddictionData = null;
          
          for (const key of Object.keys(addictionDatabase)) {
            // Extract the name part after the emoji (e.g., "Alcohol" from "🍺 Alcohol")
            const namePart = key.split(' ').slice(1).join(' ');
            
            if (namePart.toLowerCase() === addictionType.toLowerCase()) {
              databaseAddictionData = addictionDatabase[key];
              console.log('Found match:', key, 'for addiction type:', addictionType);
              break;
            }
          }
          
          if (databaseAddictionData && databaseAddictionData.withdrawalTimeline) {
            console.log('Successfully loaded withdrawal timeline');
            setTimeline(databaseAddictionData.withdrawalTimeline);
          } else {
            console.warn('Could not find withdrawal timeline for:', addictionType);
            console.warn('Available keys:', Object.keys(addictionDatabase));
            setTimeline({});
          }
        }

        // Check for new achievements
        await apiClient.post(`/api/achievements/check/${id}`, {});
      } catch (err) {
        console.error('Error loading addiction:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        console.error('Token being sent:', token ? 'YES' : 'NO');
        setError('Failed to load addiction details: ' + (err.response?.data?.message || err.message));
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

  const handleCaved = () => {
    setShowCavedConfirm(true);
  };

  const confirmCaved = async () => {
    try {
      // Update the addiction to mark it as caved
      await apiClient.put(`/api/addictions/${id}/caved`, {});

      // Update the UI to show that we've caved
      setCaved(true);
      setShowCavedConfirm(false);

      // Show a success message
      setMessage('You caved. Your streak has been reset. Remember, every day you stay clean is a victory!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError('Failed to log caving');
      setShowCavedConfirm(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/api/addictions/${id}`);
      setShowDeleteConfirm(false);
      navigate('/');
    } catch (err) {
      setError('Failed to delete addiction');
      setShowDeleteConfirm(false);
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
          🗑️
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Days Since Stopping</h3>
          <p className="stat-value">{addiction.daysStopped}</p>
        </div>

        <div className="stat-card">
          <h3>Total Money Saved</h3>
          <p className="stat-value">${(addiction.totalMoneySaved || 0).toFixed(2)}</p>
        </div>

        <div className="stat-card">
          <h3>{getFrequencyLabel(addiction.addictionType)}</h3>
          <p className="stat-value">{addiction.frequency || 0}</p>
        </div>

        <div className="stat-card">
          <h3>{getCostLabel(addiction.addictionType)}</h3>
          <p className="stat-value">${(addiction.cost || 0).toFixed(2)}</p>
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
          <button onClick={handleCaved} className="caved-button">
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

      {showCavedConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Are you sure?</h3>
            <p>This will reset your streak and mark today as a cave.</p>
            <div className="confirm-buttons">
              <button onClick={confirmCaved} className="btn btn-danger">
                Yes, I Caved
              </button>
              <button onClick={() => setShowCavedConfirm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Are you sure?</h3>
            <p>This will permanently delete this addiction and all its data.</p>
            <div className="confirm-buttons">
              <button onClick={confirmDelete} className="btn btn-danger">
                Yes
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
