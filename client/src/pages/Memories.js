import React, { useState, useEffect, useContext } from 'react';
import './Memories.css';
import apiClient from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Memories() {
  const { t } = useTranslation(['resources', 'common']);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMemoryId, setDeleteMemoryId] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchMemories();
  }, [token]);

  const fetchMemories = async () => {
    try {
      const response = await apiClient.get('/api/memories');
      setMemories(response.data);
    } catch (error) {
      setNotification(t('memories.failedToLoadMemories'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && !imageUrl) {
      setNotification(t('memories.requiresMessageOrImage'));
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post(
        '/api/memories',
        { message, imageUrl }
      );
      
      setMessage('');
      setImageUrl('');
      setPreview('');
      setShowForm(false);
      setNotification(t('memories.memorySavedSuccessfully'));
      setTimeout(() => setNotification(''), 3000);
      
      fetchMemories();
    } catch (error) {
      setNotification(t('memories.failedToSaveMemory'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (memoryId) => {
    setDeleteMemoryId(memoryId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/api/memories/${deleteMemoryId}`);
      
      setNotification(t('memories.memoryDeleted'));
      setTimeout(() => setNotification(''), 3000);
      setShowDeleteConfirm(false);
      setDeleteMemoryId(null);
      fetchMemories();
    } catch (error) {
      setNotification(t('memories.failedToDeleteMemory'));
      setShowDeleteConfirm(false);
      setDeleteMemoryId(null);
    }
  };

  if (loading) return <div className="loading">{t('common:loading')}...</div>;

  return (
    <div className="memories-page">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      <h1>{t('memories.title')}</h1>
      <p className="memories-description">
        {t('memories.description')}
      </p>

      <div className="memories-actions">
        {!showForm ? (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            {t('memories.addNewMemory')}
          </button>
        ) : (
          <div className="memory-form">
            <h2>{t('memories.addMemoryTitle')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('memories.message')} {t('common:optional')}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('memories.messagePlaceholder')}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>{t('memories.uploadImage')} {t('common:optional')}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {preview && (
                  <div className="preview-container">
                    <img src={preview} alt="Preview" className="preview-image" />
                  </div>
                )}
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn btn-success" disabled={submitting}>
                  {submitting ? t('common:saving') : t('memories.saveMemory')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setMessage('');
                    setImageUrl('');
                    setPreview('');
                  }}
                >
                  {t('common:cancel')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {memories.length > 0 ? (
        <div className="memories-grid">
          {memories.map((memory) => (
            <div key={memory._id} className="memory-card">
              {memory.imageUrl && (
                <img src={memory.imageUrl} alt="Memory" className="memory-image" />
              )}
              <div className="memory-content">
                {memory.message && (
                  <p className="memory-message">{memory.message}</p>
                )}
                {!memory.imageUrl && !memory.message && (
                  <p className="memory-message">{t('memories.contentUnavailable')}</p>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(memory._id)}
                  title={t('memories.deleteMemory')}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-memories">
          <p>{t('memories.noMemoriesYet')}</p>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>{t('memories.confirmDelete')}</h3>
            <p>{t('memories.deleteWarning')}</p>
            <div className="confirm-buttons">
              <button onClick={confirmDelete} className="btn btn-danger">
                {t('common:yes')}
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">
                {t('common:no')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
