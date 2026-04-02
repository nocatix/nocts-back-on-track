import React, { useState, useEffect, useContext } from 'react';
import './AddictionDetail.css';
import apiClient from '../api/axiosConfig';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAddictions } from '../context/AddictionsContext';
import WithdrawalTimeline from '../components/WithdrawalTimeline';
import { getFrequencyLabel, getCostLabel } from '../utils/withdrawalHelper';
import { addictionDatabase } from '../data/addictions';

export default function AddictionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const { removeAddiction, updateAddiction } = useAddictions();
  const [addiction, setAddiction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [caved, setCaved] = useState(false);
  const [message, setMessage] = useState('');
  const [showCavedConfirm, setShowCavedConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    frequencyPerDay: 0,
    moneySpentPerDay: 0,
    notes: '',
    stopDate: ''
  });

  useEffect(() => {
    const fetchAddiction = async () => {
      try {
        const response = await apiClient.get(`/api/addictions/${id}`);
        const addictionData = response.data;
        
        // Calculate daysStopped if not provided by backend
        if (!addictionData.daysStopped && addictionData.stopDate) {
          const stopDate = new Date(addictionData.stopDate);
          const today = new Date();
          const daysStopped = Math.floor((today - stopDate) / (1000 * 60 * 60 * 24));
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
        
        // Open edit mode if navigated from pledge conversion
        if (location.state?.editMode) {
          // Populate editData with addiction values
          let isoString = '';
          try {
            if (addictionData.stopDate) {
              const stopDate = new Date(addictionData.stopDate);
              if (!isNaN(stopDate.getTime())) {
                const year = stopDate.getFullYear();
                const month = String(stopDate.getMonth() + 1).padStart(2, '0');
                const day = String(stopDate.getDate()).padStart(2, '0');
                const hours = String(stopDate.getHours()).padStart(2, '0');
                const minutes = String(stopDate.getMinutes()).padStart(2, '0');
                isoString = `${year}-${month}-${day}T${hours}:${minutes}`;
              }
            }
          } catch (err) {
            console.error('Error parsing stop date:', err);
          }
          
          const frequencyValue = addictionData.frequencyPerDay ? Number(addictionData.frequencyPerDay) : 0;
          const costValue = addictionData.moneySpentPerDay ? Number(addictionData.moneySpentPerDay) : 0;
          
          setEditData({
            name: addictionData.name || '',
            frequencyPerDay: frequencyValue,
            moneySpentPerDay: costValue,
            notes: addictionData.notes || '',
            stopDate: isoString
          });
          setIsEditing(true);
        }
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
  }, [id, token, location.state?.editMode]);

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
      // Remove from context
      removeAddiction(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete addiction');
      setShowDeleteConfirm(false);
    }
  };

  const handleEditStart = () => {
    let isoString = '';
    
    try {
      if (addiction.stopDate) {
        const stopDate = new Date(addiction.stopDate);
        
        if (!isNaN(stopDate.getTime())) {
          // Get local date/time components
          const year = stopDate.getFullYear();
          const month = String(stopDate.getMonth() + 1).padStart(2, '0');
          const day = String(stopDate.getDate()).padStart(2, '0');
          const hours = String(stopDate.getHours()).padStart(2, '0');
          const minutes = String(stopDate.getMinutes()).padStart(2, '0');
          
          isoString = `${year}-${month}-${day}T${hours}:${minutes}`;
          console.log('Formatted datetime:', isoString);
        } else {
          console.warn('Invalid date:', addiction.stopDate);
        }
      } else {
        console.warn('No stopDate found');
      }
    } catch (err) {
      console.error('Error parsing stop date:', err);
    }
    
    // Ensure numeric values are properly converted
    const frequencyValue = addiction.frequencyPerDay ? Number(addiction.frequencyPerDay) : 0;
    const costValue = addiction.moneySpentPerDay ? Number(addiction.moneySpentPerDay) : 0;
    
    console.log('Edit form values - Frequency:', frequencyValue, 'Cost:', costValue);
    
    setEditData({
      name: addiction.name || '',
      frequencyPerDay: frequencyValue,
      moneySpentPerDay: costValue,
      notes: addiction.notes || '',
      stopDate: isoString
    });
    
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditData({
      name: '',
      frequencyPerDay: 0,
      moneySpentPerDay: 0,
      notes: '',
      stopDate: ''
    });
  };

  const handleEditSave = async () => {
    try {
      const response = await apiClient.put(`/api/addictions/${id}`, {
        name: editData.name,
        frequencyPerDay: editData.frequencyPerDay,
        moneySpentPerDay: editData.moneySpentPerDay,
        notes: editData.notes,
        stopDate: editData.stopDate ? new Date(editData.stopDate).toISOString() : addiction.stopDate
      });
      
      setAddiction(response.data);
      setIsEditing(false);
      // Update in context
      updateAddiction(response.data);
      
      // Force refetch of achievements/trophies after edit
      try {
        await apiClient.post(`/api/achievements/check/${id}`, {});
        console.log('Achievements rechecked after addiction edit');
      } catch (checkErr) {
        console.error('Error rechecking achievements:', checkErr);
      }
      
      setMessage('Addiction updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update addiction');
    }
  };

  const handleEditChange = (field, value) => {
    let processedValue = value;
    
    // Convert to appropriate type
    if (field === 'frequencyPerDay') {
      processedValue = value === '' ? 0 : parseInt(value) || 0;
    } else if (field === 'moneySpentPerDay') {
      processedValue = value === '' ? 0 : parseFloat(value) || 0;
    }
    
    setEditData(prev => ({
      ...prev,
      [field]: processedValue
    }));
  };

  const calculateElapsedTime = () => {
    if (!addiction.stopDate) return null;
    
    const stopDate = new Date(addiction.stopDate);
    const now = new Date();
    const diffMs = now - stopDate;

    // Calculate total days in decimal format for money calculation
    const totalDaysElapsed = diffMs / (1000 * 60 * 60 * 24);

    // Calculate breakdown for display
    let diff = diffMs;
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));

    // Build elapsed text - always include days
    let elapsedText = `${days} day${days !== 1 ? 's' : ''}`;
    if (hours > 0) {
      elapsedText += `, ${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      elapsedText += `, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    // Calculate money saved: (elapsed days) × (money spent per day)
    const totalMoneySaved = totalDaysElapsed * (addiction.moneySpentPerDay || 0);

    const formattedDate = stopDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedTime = stopDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return {
      date: formattedDate,
      time: formattedTime,
      elapsed: elapsedText,
      days: days,
      totalMoneySaved: totalMoneySaved
    };
  };

  const elapsedTime = addiction ? calculateElapsedTime() : null;

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!addiction) return <div>Addiction not found</div>;

  return (
    <div className="addiction-detail">
      {message && <div className="message-notification">{message}</div>}
      <div className="detail-header">
        <h1>{addiction.name}</h1>
        <div className="detail-header-buttons">
          <button onClick={handleEditStart} className="btn btn-primary">
            ✏️
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            🗑️
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="edit-section">
          <h2>Edit Addiction Details</h2>
          <div className="edit-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
                placeholder="Addiction name"
              />
            </div>

            <div className="form-group">
              <label>Date & Time Stopped</label>
              <input
                type="datetime-local"
                value={editData.stopDate}
                onChange={(e) => handleEditChange('stopDate', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{getFrequencyLabel(addiction.addictionType)}</label>
              <input
                type="number"
                value={editData.frequencyPerDay || ''}
                onChange={(e) => handleEditChange('frequencyPerDay', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>{getCostLabel(addiction.addictionType)}</label>
              <input
                type="number"
                value={editData.moneySpentPerDay || ''}
                onChange={(e) => handleEditChange('moneySpentPerDay', e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={editData.notes}
                onChange={(e) => handleEditChange('notes', e.target.value)}
                placeholder="Add notes..."
                rows="4"
              />
            </div>

            <div className="form-buttons">
              <button onClick={handleEditSave} className="btn btn-success">
                ✓ Save
              </button>
              <button onClick={handleEditCancel} className="btn btn-secondary">
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {elapsedTime && (
        <div className="stop-date-section">
          <div className="stop-date-card">
            <div className="stop-date-info">
              <h3>🕐 Started Recovery</h3>
              <p className="stop-date-datetime">
                {elapsedTime.date} at {elapsedTime.time}
              </p>
              <p className="elapsed-time">
                <strong>{elapsedTime.elapsed}</strong> since you stopped
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="stats-container">
        <div className="stat-card">
          <h3>Days Since Stopping</h3>
          <p className="stat-value">{elapsedTime?.days || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total Money Saved</h3>
          <p className="stat-value">${(elapsedTime?.totalMoneySaved || 0).toFixed(2)}</p>
        </div>

        <div className="stat-card">
          <h3>{getFrequencyLabel(addiction.addictionType)}</h3>
          <p className="stat-value">{addiction.frequencyPerDay || 0}</p>
        </div>

        <div className="stat-card">
          <h3>{getCostLabel(addiction.addictionType)}</h3>
          <p className="stat-value">${(addiction.moneySpentPerDay || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="details-section">
        <h2>Withdrawal Timeline & Milestones</h2>
        <WithdrawalTimeline daysStopped={elapsedTime?.days || addiction.daysStopped || 0} timeline={timeline} />
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
