import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import './SetStopDateModal.css';

export default function SetStopDateModal({ onClose, onSuccess }) {
  const [selectedAddictionType, setSelectedAddictionType] = useState('');
  const [customAddictionName, setCustomAddictionName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSetStopDate = async () => {
    if (!selectedDate) {
      setError('Please pick a date');
      return;
    }

    if (!selectedAddictionType) {
      setError('Please select an addiction type');
      return;
    }

    if (selectedAddictionType === '❓ Other' && !customAddictionName.trim()) {
      setError('Please enter an addiction name');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const addictionName = selectedAddictionType === '❓ Other' ? customAddictionName.trim() : selectedAddictionType;

      // Use the date string directly to avoid timezone conversion issues
      const isoDate = selectedDate + 'T00:00:00Z';

      // Create a pledge (completely independent from addictions)
      await apiClient.post('/api/pledges', {
        what: addictionName,
        plannedStopDate: isoDate
      });

      setSuccess('Your pledge is set! 💪');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set pledge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📅 Set Your Stop Date</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="addictionType">What will you stop?</label>
            <select
              id="addictionType"
              value={selectedAddictionType}
              onChange={(e) => {
                setSelectedAddictionType(e.target.value);
                setCustomAddictionName('');
                setError('');
              }}
              className="addiction-select"
            >
              <option value="">Choose an addiction type...</option>
              <option value="🍺 Alcohol">🍺 Alcohol</option>
              <option value="🌿 Cannabis">🌿 Cannabis</option>
              <option value="☕ Coffee">☕ Coffee</option>
              <option value="📰 Doomscrolling">📰 Doomscrolling</option>
              <option value="🍽️ Overeating">🍽️ Overeating</option>
              <option value="🎰 Gambling">🎰 Gambling</option>
              <option value="💉 Hard Drugs">💉 Hard Drugs</option>
              <option value="🚬 Nicotine">🚬 Nicotine</option>
              <option value="🔞 Pornography">🔞 Pornography</option>
              <option value="📱 Social Media">📱 Social Media</option>
              <option value="🛍️ Shopping">🛍️ Shopping</option>
              <option value="🍬 Sugar">🍬 Sugar</option>
              <option value="🎮 Video Games">🎮 Video Games</option>
              <option value="❓ Other">❓ Other (custom)</option>
            </select>
          </div>

          {selectedAddictionType === '❓ Other' && (
            <div className="form-group">
              <label htmlFor="customAddiction">Enter what you'll stop</label>
              <input
                id="customAddiction"
                type="text"
                value={customAddictionName}
                onChange={(e) => setCustomAddictionName(e.target.value)}
                placeholder="e.g., Procrastination, Overspending"
                className="custom-input"
              />
            </div>
          )}

          {selectedAddictionType && (selectedAddictionType !== '❓ Other' || customAddictionName.trim()) && (
            <div className="form-group">
              <label htmlFor="stopDate">Pick Your Stop Date (in the future)</label>
              <input
                id="stopDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                className="date-input"
              />
              {selectedDate && (
                <div className="date-preview">
                  <span className="label">You commit to stopping on:</span>
                  <span className="date">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  <span className="days-away">
                    ({Math.ceil((new Date(selectedDate) - new Date()) / (1000 * 60 * 60 * 24))} days away)
                  </span>
                </div>
              )}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSetStopDate}
            disabled={loading || !selectedAddictionType || !selectedDate || (selectedAddictionType === '❓ Other' && !customAddictionName.trim())}
          >
            {loading ? 'Setting pledge...' : 'Make This Pledge'}
          </button>
        </div>
      </div>
    </div>
  );
}
