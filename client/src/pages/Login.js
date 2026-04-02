import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './Auth.css';
import apiClient from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function Login() {
  const { t } = useTranslation(['common', 'auth']);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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

    try {
      const response = await apiClient.post('/api/auth/login', formData);
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('auth:invalidCredentials'));
    }
  };

  return (
    <div className="auth-container">
      <div className="disclaimer-banner">
        <p>💚 <strong>100% Open Source • Completely Free • No Ads • No Tracking</strong></p>
      </div>
      <div className="auth-card">
        <h1>{t('header.title')}</h1>
        <h2>{t('auth:login')}</h2>
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
          <button type="submit">{t('auth:login')}</button>
        </form>
        <p>{t('auth:noAccount')} <a href="/register">{t('auth:register')}</a></p>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Not sure if this is for you? <a href="/self-assessment">Take our self-assessment quiz</a>
        </p>
      </div>
      <Footer />
    </div>
  );
}
