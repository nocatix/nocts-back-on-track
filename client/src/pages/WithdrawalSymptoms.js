import React, { useState } from 'react';
import { symptomCategories, getSymptomsByCategory } from '../data/withdrawalSymptoms';
import './WithdrawalSymptoms.css';

const WithdrawalSymptoms = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Symptoms');
  
  const displayedSymptoms = getSymptomsByCategory(selectedCategory);

  return (
    <div className="withdrawal-symptoms-container">
      {/* Header */}
      <header className="symptoms-header">
        <h1>Withdrawal Symptoms & Relief</h1>
        <p>Understanding what to expect and how to manage common withdrawal symptoms during your recovery journey</p>
      </header>

      {/* Category Selector */}
      <div className="category-selector-container">
        <div className="category-selector">
          {symptomCategories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              {selectedCategory === category && (
                <span className="count">
                  {getSymptomsByCategory(category).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms Grid (Bento Box Layout) */}
      <div className="symptoms-grid">
        {displayedSymptoms.map(symptom => (
          <div key={symptom.id} className="symptom-box">
            {/* Symptom Header */}
            <div className="symptom-header">
              <span className="symptom-emoji">{symptom.emoji}</span>
              <div className="symptom-title-section">
                <h3 className="symptom-name">{symptom.name}</h3>
                <div className="symptom-meta">
                  <span className="timing">{symptom.timingWeek}</span>
                  <span className={`severity severity-${symptom.severity.toLowerCase().replace(' to ', '-').replace(' ', '-')}`}>
                    {symptom.severity}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="symptom-description">{symptom.description}</p>

            {/* What to Do Section */}
            <div className="what-to-do-section">
              <h4 className="what-to-do-title">💡 What to Do:</h4>
              <ul className="what-to-do-list">
                {symptom.whatToDo.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Addictions Footer */}
            <div className="symptom-addictions">
              <p className="addictions-label">Associated with:</p>
              <div className="addictions-tags">
                {symptom.addictions.map(addiction => (
                  <span key={addiction} className="addiction-tag">
                    {addiction}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="general-tips-section">
        <h2>💪 General Recovery Tips</h2>
        <div className="tips-grid">
          <div className="tip-box">
            <div className="tip-icon">🫂</div>
            <h3>Reach Out for Support</h3>
            <p>Don't isolate. Connect with friends, family, support groups, or therapy. Everyone needs help sometimes.</p>
          </div>
          <div className="tip-box">
            <div className="tip-icon">💤</div>
            <h3>Prioritize Sleep</h3>
            <p>Your brain is healing. Sleep is when that healing happens. Aim for 7-9 hours each night.</p>
          </div>
          <div className="tip-box">
            <div className="tip-icon">🚴</div>
            <h3>Move Your Body</h3>
            <p>Exercise releases natural endorphins and reduces cravings. Find movement you enjoy.</p>
          </div>
          <div className="tip-box">
            <div className="tip-icon">⏰</div>
            <h3>Remember: This Is Temporary</h3>
            <p>The peak of withdrawal typically lasts 3-14 days. It gets easier every single day.</p>
          </div>
          <div className="tip-box">
            <div className="tip-icon">🧘</div>
            <h3>Use Your Tools</h3>
            <p>Use the Craving Game, Meditation, Diary, and Mood tracker to manage difficult moments.</p>
          </div>
          <div className="tip-box">
            <div className="tip-icon">🎯</div>
            <h3>Be Patient With Yourself</h3>
            <p>Recovery is not linear. Bad days don't erase your progress. Keep going.</p>
          </div>
        </div>
      </div>

      {/* Crisis Info */}
      <div className="crisis-notice">
        <h3>⚠️ When to Seek Emergency Help</h3>
        <p>
          If you experience severe symptoms like chest pain, difficulty breathing, suicidal thoughts, or severe confusion,
          please contact emergency services or go to the nearest emergency room immediately. You can also reach the
          Substance Abuse and Mental Health Services Administration (SAMHSA) helpline at <strong>1-800-662-4357</strong> for
          free, confidential support 24/7.
        </p>
      </div>
    </div>
  );
};

export default WithdrawalSymptoms;
