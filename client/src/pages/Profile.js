import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';
import LanguageSelector from '../components/LanguageSelector';
import './Profile.css';
import apiClient from '../api/axiosConfig';

const Profile = () => {
  const { user, setUser, loading } = useAuth();
  const { t } = useTranslation(['profile', 'messages']);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unitPreference, setUnitPreference] = useState('metric');

  useEffect(() => {
    if (user) {
      setUnitPreference(user.unitPreference || 'metric');
    }
  }, [user]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUnitPreferenceChange = async (preference) => {
    try {
      await apiClient.put('/api/auth/unit-preference', 
        { unitPreference: preference }
      );
      setUnitPreference(preference);
      setUser({ ...user, unitPreference: preference });
      setMessage(t('messages:updated'));
    } catch (err) {
      setError(err.response?.data?.message || t('messages:error'));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t('common:passwordMismatch'));
      setIsSubmitting(false);
      return;
    }

    try {
      await apiClient.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setMessage(t('passwordChanged'));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || t('messages:error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await apiClient.delete('/api/auth/profile');

      // Logout the user
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.message || t('messages:error'));
    }
  };

  const handleResetProgress = async () => {
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      await apiClient.post('/api/auth/reset-progress');
      setShowResetModal(false);
      setMessage(t('messages:updated'));
    } catch (err) {
      setError(err.response?.data?.message || t('messages:error'));
      setShowResetModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return <div className="profile-loading">{t('common:loading')}</div>;
  }

  return (
    <div className="profile-page">
      <h1>{t('pageTitle')}</h1>
      
      {message && <div className="profile-message success">{message}</div>}
      {error && <div className="profile-message error">{error}</div>}
      
      <div className="profile-card">
        <h2>{t('unitPreference')}</h2>
        <div className="unit-preference-section">
          <p>Choose your preferred unit of measurement:</p>
          <div className="unit-buttons">
            <button 
              className={`unit-button ${unitPreference === 'metric' ? 'active' : ''}`}
              onClick={() => handleUnitPreferenceChange('metric')}
            >
              <span>🌍</span>
              <span>{t('metricUnits')}</span>
            </button>
            <button 
              className={`unit-button ${unitPreference === 'imperial' ? 'active' : ''}`}
              onClick={() => handleUnitPreferenceChange('imperial')}
            >
              <span>🇺🇸</span>
              <span>{t('imperialUnits')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <LanguageSelector />
      </div>
      
      <div className="profile-card">
        <h2>{t('changePassword')}</h2>
        <form onSubmit={handlePasswordSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="currentPassword">{t('currentPassword')}</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">{t('newPassword')}</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('confirmNewPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
            />
          </div>
          
          <button type="submit" disabled={loading} className="profile-button">
            {loading ? t('common:loading') : t('changePassword')}
          </button>
        </form>
      </div>
      
      <div className="profile-section">
        <h2>Account Management</h2>
        <div className="account-actions">
          <button
            onClick={() => setShowResetModal(true)}
            className="reset-account-button"
          >
            Reset Everything
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="delete-account-button"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Account</h3>
            <p>Are you sure you want to delete your account? This will permanently remove all your data and cannot be undone.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="confirm-delete-button"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Progress Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reset Everything</h3>
            <p>This will permanently delete your addictions, achievements, trophies, moods, diary, memories, and weight logs. Your account will stay active so you can start fresh.</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowResetModal(false)}
                className="cancel-button"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleResetProgress}
                className="confirm-reset-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resetting...' : 'Yes, Reset Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;