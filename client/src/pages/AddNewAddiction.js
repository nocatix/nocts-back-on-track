import React, { useState, useContext } from 'react';
import './AddNewAddiction.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getFrequencyLabel, getCostLabel } from '../utils/withdrawalHelper';

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
  const [timeHour, setTimeHour] = useState('12');
  const [timeMinute, setTimeMinute] = useState('00');
  const [timePeriod, setTimePeriod] = useState('AM');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const unitPreference = user?.unitPreference || 'metric';

  // Convert 12h format to 24h format
  const convert12to24 = (hour, period) => {
    const h = parseInt(hour);
    if (period === 'AM') {
      return h === 12 ? 0 : h;
    } else {
      return h === 12 ? 12 : h + 12;
    }
  };

  // Convert 24h format to 12h format
  const convert24to12 = (hour) => {
    const h = parseInt(hour);
    if (h === 0) return { hour: '12', period: 'AM' };
    if (h < 12) return { hour: h.toString(), period: 'AM' };
    if (h === 12) return { hour: '12', period: 'PM' };
    return { hour: (h - 12).toString(), period: 'PM' };
  };

  const handleTimeChange = () => {
    if (unitPreference === 'imperial') {
      const hour24 = convert12to24(timeHour, timePeriod);
      const newTime = `${hour24.toString().padStart(2, '0')}:${timeMinute}`;
      setFormData({ ...formData, stopTime: newTime });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'timeHour') {
      setTimeHour(value);
    } else if (name === 'timeMinute') {
      setTimeMinute(value);
    } else if (name === 'timePeriod') {
      setTimePeriod(value);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const addictionName = formData.addictionType === '❓ Other' ? formData.customName : formData.addictionType;

    if (!addictionName || !formData.stopDate || formData.frequencyPerDay === '' || formData.moneySpentPerDay === '') {
      setError('All required fields must be filled');
      return;
    }

    // Handle time format based on unit preference
    let finalStopTime = formData.stopTime;
    if (unitPreference === 'imperial') {
      const hour24 = convert12to24(timeHour, timePeriod);
      finalStopTime = `${hour24.toString().padStart(2, '0')}:${timeMinute}`;
    }

    // Combine date and time
    const [hours, minutes] = finalStopTime.split(':');
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
            <option value="❓ Other">❓ Other</option>
          </select>
        </div>

        {formData.addictionType === '❓ Other' && (
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
          <label>Time You Stopped ({unitPreference === 'imperial' ? '12h format (AM/PM)' : '24h format'}) *</label>
          {unitPreference === 'imperial' ? (
            <div className="time-picker-12h">
              <select
                name="timeHour"
                value={timeHour}
                onChange={(e) => {
                  setTimeHour(e.target.value);
                  handleTimeChange();
                }}
                required
              >
                {[...Array(12)].map((_, i) => {
                  const hour = i + 1;
                  return <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>;
                })}
              </select>
              <span className="time-separator">:</span>
              <select
                name="timeMinute"
                value={timeMinute}
                onChange={(e) => {
                  setTimeMinute(e.target.value);
                  handleTimeChange();
                }}
                required
              >
                {[...Array(60)].map((_, i) => {
                  const minute = i;
                  return <option key={minute} value={minute.toString().padStart(2, '0')}>{minute.toString().padStart(2, '0')}</option>;
                })}
              </select>
              <select
                name="timePeriod"
                value={timePeriod}
                onChange={(e) => {
                  setTimePeriod(e.target.value);
                  handleTimeChange();
                }}
                required
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          ) : (
            <input
              type="time"
              name="stopTime"
              value={formData.stopTime}
              onChange={handleChange}
              required
            />
          )}
        </div>

        <div className="form-group">
          <label>Frequency ({formData.addictionType ? getFrequencyLabel(formData.addictionType) : 'times per day'}) *</label>
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
          <label>Money ({getCostLabel(formData.addictionType)}) *</label>
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
