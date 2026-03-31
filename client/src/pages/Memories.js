import React, { useState, useEffect, useContext } from 'react';
import './Memories.css';
import axios from 'axios';
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
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchMemories();
  }, [token]);

  const fetchMemories = async () => {
    try {
      const response = await axios.get('/api/memories', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      await axios.post(
        '/api/memories',
        { message, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
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
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        await axios.delete(`/api/memories/${memoryId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setNotification('Memory deleted');
        setTimeout(() => setNotification(''), 3000);
        fetchMemories();
      } catch (error) {
        setNotification('Failed to delete memory');
      }
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
    </div>
  );
}
