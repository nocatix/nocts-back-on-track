import React, { useState, useEffect, useContext } from 'react';
import './Diary.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Diary() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fetch diary entry for current date
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const formattedDate = currentDate.toISOString().split('T')[0];
        const response = await axios.get(`/api/diary/${formattedDate}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContent(response.data.content || '');
        setLastSaved(response.data.updatedAt);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to fetch diary entry:', error);
        setContent('');
      }
    };

    fetchEntry();
  }, [currentDate, token]);

  // Save diary entry
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formattedDate = currentDate.toISOString().split('T')[0];
      const response = await axios.post(
        `/api/diary/${formattedDate}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLastSaved(response.data.updatedAt);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save diary entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate to previous day
  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  // Navigate to next day
  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Navigate to today
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Simple markdown to HTML converter
  const parseMarkdown = (text) => {
    let html = text
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');
    return html;
  };

  return (
    <div className="diary-page">
      <div className="diary-header">
        <button onClick={handlePreviousDay} className="btn btn-small">&larr; Previous</button>
        <div className="date-display">
          <h2>{formatDate(currentDate)}</h2>
          {lastSaved && (
            <p className="last-saved">
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </p>
          )}
        </div>
        <button onClick={handleNextDay} className="btn btn-small">Next &rarr;</button>
      </div>

      <button onClick={handleToday} className="btn btn-accent today-btn">
        Today
      </button>

      {isEditing ? (
        <div className="diary-editor">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here... You can use markdown:&#10;# Heading 1&#10;## Heading 2&#10;**bold** *italic*&#10;- bullet points"
            className="diary-textarea"
          />
          
          <div className="editor-info">
            <p className="markdown-hint">💡 Tip: Use markdown for formatting - **bold**, *italic*, # headings, - bullets</p>
          </div>

          <div className="editor-buttons">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary"
            >
              {isSaving ? 'Saving...' : '💾 Save Entry'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="diary-viewer">
          {content ? (
            <div
              className="diary-content"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
            />
          ) : (
            <p className="no-entry">No entry for this day yet.</p>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
          >
            ✏️ Edit Entry
          </button>
        </div>
      )}

      <div className="diary-tips">
        <h3>💭 Journaling Tips for Recovery</h3>
        <ul>
          <li><strong>Gratitude:</strong> Each day, write 3 things you're grateful for</li>
          <li><strong>Progress:</strong> Track how many days you've stayed strong</li>
          <li><strong>Triggers:</strong> Note what triggered cravings and how you handled them</li>
          <li><strong>Emotions:</strong> Write about your feelings to process them</li>
          <li><strong>Goals:</strong> Remind yourself why you're on this journey</li>
          <li><strong>Victories:</strong> Celebrate every small win, no matter how small</li>
        </ul>
      </div>
    </div>
  );
}
