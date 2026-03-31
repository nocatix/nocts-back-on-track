import React, { useState, useContext } from 'react';
import './AddNewAddiction.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AddNewAddiction() {
  const [formData, setFormData] = useState({
    addictionType: '',
    customName: '',
    stopDate: '',
    stopTime: '00:00',
    frequencyPerDay: '',
    moneySpentPerDay: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const addictionName = formData.addictionType === 'other' ? formData.customName : formData.addictionType;

    if (!addictionName || !formData.stopDate || formData.frequencyPerDay === '' || formData.moneySpentPerDay === '') {
      setError('All required fields must be filled');
      return;
    }

    // Combine date and time
    const [hours, minutes] = formData.stopTime.split(':');
    const stopDateTime = new Date(formData.stopDate);
    stopDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    try {
      await axios.post('/api/addictions', {
        name: addictionName,
        stopDate: stopDateTime.toISOString(),
        frequencyPerDay: formData.frequencyPerDay,
        moneySpentPerDay: formData.moneySpentPerDay,
        notes: formData.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create addiction entry');
    }
  };

  return (
    <div className="add-addiction">
      <button onClick={() => navigate('/')} className="btn btn-secondary">
        &larr; Back
      </button>

      <h1>Add New Addiction</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="addiction-form">
        <div className="form-group">
          <label>Addiction Name *</label>
          <select
            name="addictionType"
            value={formData.addictionType}
            onChange={handleChange}
            required
          >
            <option value="">Select an addiction...</option>
            <option value="alcohol">Alcohol</option>
            <option value="cannabis">Cannabis</option>
            <option value="nicotine">Nicotine</option>
            <option value="other">Other</option>
          </select>
        </div>

        {formData.addictionType === 'other' && (
          <div className="form-group">
            <label>Enter Addiction Name *</label>
            <input
              type="text"
              name="customName"
              placeholder="e.g., Sugar, Gambling, Social Media"
              value={formData.customName}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Date You Stopped *</label>
          <input
            type="date"
            name="stopDate"
            value={formData.stopDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Time You Stopped (24h format) *</label>
          <input
            type="time"
            name="stopTime"
            value={formData.stopTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Frequency (times per day) *</label>
          <input
            type="number"
            name="frequencyPerDay"
            placeholder="e.g., 10"
            value={formData.frequencyPerDay}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Money Spent Per Day ($) *</label>
          <input
            type="number"
            name="moneySpentPerDay"
            placeholder="e.g., 15.50"
            value={formData.moneySpentPerDay}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            name="notes"
            placeholder="Any additional information..."
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Addiction Entry
        </button>
      </form>
    </div>
  );
}
