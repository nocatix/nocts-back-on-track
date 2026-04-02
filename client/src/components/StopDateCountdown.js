import React, { useMemo } from 'react';
import './StopDateCountdown.css';

const ENCOURAGEMENTS = {
  30: '🎯 Just a month away! You can do this!',
  21: '💪 Three weeks! The finish line is getting closer!',
  14: '⏰ Two weeks! Start preparing now!',
  7: '🔥 One week! The moment is almost here!',
  5: '🚀 Five days! Get your support network ready!',
  3: '⚡ Three days! You are so close!',
  2: '😤 Two days! You\'ve got this in the bag!',
  1: '🌟 Tomorrow is the day! Believe in yourself!',
  0: '💪 TODAY IS THE DAY! YOU\'VE GOT THIS!'
};

const MILESTONE_MESSAGES = {
  30: 'A month of preparation sets you up for success',
  21: 'Three weeks to build your strength',
  14: 'Two weeks to create unshakeable commitment',
  7: 'One week to finalize your plan',
  5: 'Five days to rally your support',
  3: 'Three days until your new life begins',
  2: 'Two days until freedom',
  1: 'One day until you take control',
  0: 'The day has arrived. You\'ve prepared. Now execute.'
};

export default function StopDateCountdown({ addiction }) {
  const daysRemaining = addiction?.daysUntilPlannedStop;

  const getColorForDays = (days) => {
    if (days > 14) return 'green';
    if (days > 7) return 'yellow';
    if (days > 3) return 'orange';
    if (days > 1) return 'red';
    return 'critical';
  };

  const getIntensity = (days) => {
    if (days === 0) return 'critical';
    if (days <= 2) return 'high';
    if (days <= 7) return 'medium';
    return 'low';
  };

  const countdownData = useMemo(() => {
    if (daysRemaining === null || daysRemaining === undefined || daysRemaining < 0) {
      return null;
    }

    let encouragement = ENCOURAGEMENTS[0];
    let milestone = MILESTONE_MESSAGES[0];

    // Find the appropriate encouragement and milestone
    const key = Math.min(daysRemaining, 30);
    if (daysRemaining <= 30) {
      encouragement = ENCOURAGEMENTS[daysRemaining] || ENCOURAGEMENTS[0];
      milestone = MILESTONE_MESSAGES[daysRemaining] || MILESTONE_MESSAGES[0];
    } else {
      encouragement = `🎯 ${daysRemaining} days to go! You're going to crush this!`;
      milestone = `${daysRemaining} days of preparation - you've got plenty of time to get ready`;
    }

    return {
      daysRemaining,
      encouragement,
      milestone,
      color: getColorForDays(daysRemaining)
    };
  }, [daysRemaining]);

  if (!countdownData) {
    return null;
  }

  return (
    <div className={`stop-date-countdown ${getIntensity(daysRemaining)}`}>
      <div className="countdown-header">
        <span className="countdown-label">Planned Stop Date</span>
        <span className="countdown-date">
          {addiction.plannedStopDate ? new Date(addiction.plannedStopDate).toLocaleDateString() : ''}
        </span>
      </div>

      <div className="countdown-timer">
        <div className="days-circle">
          <span className="days-number">{daysRemaining}</span>
          <span className="days-label">{daysRemaining === 1 ? 'day' : 'days'}</span>
        </div>
      </div>

      <div className="countdown-content">
        <p className="encouragement-text">{countdownData.encouragement}</p>
        <p className="milestone-message">{countdownData.milestone}</p>
      </div>

      <div className={`countdown-progress ${getColorForDays(daysRemaining)}`}>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{
              width: `${Math.min(((30 - daysRemaining) / 30) * 100, 100)}%`
            }}
          />
        </div>
        <span className="progress-text">
          {daysRemaining === 0 ? 'Now or Never!' : `${30 - daysRemaining} days prepared`}
        </span>
      </div>

      {daysRemaining > 0 && (
        <div className="countdown-tips">
          <p className="tip-header">💡 What to do now:</p>
          {daysRemaining > 14 && (
            <ul>
              <li>Get your support network in place</li>
              <li>Plan your coping strategies</li>
              <li>Schedule a doctor's appointment if needed</li>
            </ul>
          )}
          {daysRemaining <= 14 && daysRemaining > 7 && (
            <ul>
              <li>Tell your support people your quit date</li>
              <li>Remove temptations from your environment</li>
              <li>Save emergency helpline numbers</li>
            </ul>
          )}
          {daysRemaining <= 7 && daysRemaining > 3 && (
            <ul>
              <li>Create your personal Crisis Toolkit</li>
              <li>Plan your first 48 hours hour-by-hour</li>
              <li>Confirm support is ready to help</li>
            </ul>
          )}
          {daysRemaining <= 3 && (
            <ul>
              <li>Double-check your support network</li>
              <li>Review your Crisis Toolkit</li>
              <li>Get plenty of rest and hydration</li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
