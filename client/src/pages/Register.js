import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './Auth.css';
import apiClient from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';
import createLogger from '../utils/logger';

const logger = createLogger('frontend:register');

export default function Register() {
  const { t } = useTranslation(['common', 'auth', 'validation', 'messages']);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    logger.info('Submitting registration form', {
      username: formData.username,
      hasPassword: Boolean(formData.password),
      passwordsMatch: formData.password === formData.confirmPassword,
    });

    if (formData.password !== formData.confirmPassword) {
      logger.warn('Registration blocked because passwords do not match', {
        username: formData.username,
      });
      setError(t('auth:passwordsNotMatch'));
      return;
    }

    try {
      const response = await apiClient.post('/api/auth/register', {
        username: formData.username,
        password: formData.password
      });

      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      logger.info('Registration completed successfully', {
        username: response.data.user?.username,
        userId: response.data.user?.id,
      });
      navigate('/');
    } catch (err) {
      logger.error('Registration request failed in UI', {
        username: formData.username,
        message: err.message,
        status: err.response?.status,
        response: err.response?.data,
      });
      setError(err.response?.data?.message || err.message || t('common:error'));
    }
  };

  return (
    <div className="auth-container">
      <div className="disclaimer-banner">
        <p>💚 <strong>100% Open Source • Completely Free • No Ads • No Tracking</strong></p>
      </div>
      <div className="auth-card">
        <h1>{t('header.title')}</h1>
        <h2>{t('auth:register')}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder={t('auth:username')}
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder={t('auth:password')}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder={t('auth:confirmPassword')}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">{t('auth:register')}</button>
        </form>
        <p>{t('auth:alreadyHaveAccount')} <a href="/login">{t('auth:login')}</a></p>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Not sure if this is for you? <a href="/self-assessment">Take our self-assessment quiz</a>
        </p>
      </div>
      <Footer />
    </div>
  );
}
