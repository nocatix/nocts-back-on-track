import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import './Diary.css';
import apiClient from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { getCookie, setCookie } from '../utils/cookieHelper';

export default function Diary() {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation('diary');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showMarkdownHint, setShowMarkdownHint] = useState(() => {
    const saved = getCookie('showMarkdownHint');
    return saved !== null ? saved : true;
  });
  const [showJournalingTips, setShowJournalingTips] = useState(() => {
    const saved = getCookie('showJournalingTips');
    return saved !== null ? saved : true;
  });
  const [message, setMessage] = useState('');

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
        const response = await apiClient.get(`/api/diary/${formattedDate}`);
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

  // Save markdown hint state to cookie
  useEffect(() => {
    setCookie('showMarkdownHint', showMarkdownHint, 365);
  }, [showMarkdownHint]);

  // Save journaling tips state to cookie
  useEffect(() => {
    setCookie('showJournalingTips', showJournalingTips, 365);
  }, [showJournalingTips]);

  // Save diary entry
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formattedDate = currentDate.toISOString().split('T')[0];
      const response = await apiClient.post(
        `/api/diary/${formattedDate}`,
        { content }
      );
      setLastSaved(response.data.updatedAt);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save diary entry:', error);
      setMessage('Failed to save entry. Please try again.');
      setTimeout(() => setMessage(''), 4000);
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
      {message && <div className="message-notification error">{message}</div>}
      <div className="diary-header">
        <button onClick={handlePreviousDay} className="btn btn-small">{t('previousDay')}</button>
        <div className="date-display">
          <h2>{formatDate(currentDate)}</h2>
          {lastSaved && (
            <p className="last-saved">
              {t('lastSaved')}: {new Date(lastSaved).toLocaleTimeString()}
            </p>
          )}
        </div>
        <button onClick={handleNextDay} className="btn btn-small">{t('nextDay')}</button>
      </div>

      <button onClick={handleToday} className="btn btn-accent today-btn">
        {t('today')}
      </button>

      {isEditing ? (
        <div className="diary-editor">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('writeHere')}
            className="diary-textarea"
          />
          
          <div className="editor-info">
            {showMarkdownHint && (
              <p className="markdown-hint">{t('markdownTip')}</p>
            )}
            <button className="btn-hint-toggle" onClick={() => setShowMarkdownHint(!showMarkdownHint)}>
              {showMarkdownHint ? t('hideTip') : t('showTip')}
            </button>
          </div>

          <div className="editor-buttons">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary"
            >
              {isSaving ? t('savingEntry') : t('saveEntry')}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              {t('common:cancel')}
            </button>
          </div>
        </div>
      ) : (
        <div className="diary-viewer">
          {content ? (
            <div
              className="diary-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(content)) }}
            />
          ) : (
            <p className="no-entry">{t('noEntryForDay')}</p>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
          >
            {t('editEntry')}
          </button>
        </div>
      )}

      <div className="diary-tips">
        <div className="diary-tips-header">
          <h3>{t('journalingTipsTitle')}</h3>
          <button 
            className="btn-hint-toggle-arrow" 
            onClick={() => setShowJournalingTips(!showJournalingTips)}
          >
            {showJournalingTips ? '▼' : '▶'}
          </button>
        </div>
        {showJournalingTips && (
          <ul>
            {t('journalingTips', { returnObjects: true }).map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
