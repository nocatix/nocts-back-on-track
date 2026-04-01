import React, { useState, useEffect, useContext } from 'react';
import './Memories.css';
import apiClient from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

export default function Memories() {
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
      setNotification('Failed to load memories');
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
      setNotification('Please provide either a message or an image, or both');
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
      setNotification('Memory saved successfully!');
      setTimeout(() => setNotification(''), 3000);
      
      fetchMemories();
    } catch (error) {
      setNotification('Failed to save memory');
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
      
      setNotification('Memory deleted');
      setTimeout(() => setNotification(''), 3000);
      setShowDeleteConfirm(false);
      setDeleteMemoryId(null);
      fetchMemories();
    } catch (error) {
      setNotification('Failed to delete memory');
      setShowDeleteConfirm(false);
      setDeleteMemoryId(null);
    }
  };

  if (loading) return <div className="loading">Loading memories...</div>;

  return (
    <div className="memories-page">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      <h1>💭 My Memories</h1>
      <p className="memories-description">
        Save photos and messages that remind you why you're fighting for recovery. 
        These will inspire you when you're struggling most.
      </p>

      <div className="memories-actions">
        {!showForm ? (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add New Memory
          </button>
        ) : (
          <div className="memory-form">
            <h2>Add a Memory</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your inspiring message here... (e.g., 'I'm stronger than my addiction', 'My family believes in me')"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Upload Image (optional)</label>
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
                  {submitting ? 'Saving...' : 'Save Memory'}
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
                  Cancel
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
                  <p className="memory-message">Memory content unavailable</p>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(memory._id)}
                  title="Delete this memory"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-memories">
          <p>No memories yet. Create one to inspire yourself during difficult moments!</p>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Are you sure?</h3>
            <p>This will permanently delete this memory.</p>
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
