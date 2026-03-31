import React from 'react';
import './WithdrawalTimeline.css';

export default function WithdrawalTimeline({ daysStopped, timeline }) {
  // Ensure daysStopped has a default value
  const safeDaysStopped = daysStopped || 0;
  
  // Convert timeline object to array if needed
  let timelineArray = [];
  
  if (timeline && (Object.keys(timeline).length > 0 || Array.isArray(timeline))) {
    if (Array.isArray(timeline)) {
      timelineArray = timeline;
    } else if (typeof timeline === 'object') {
      // Convert object to array (e.g., { day1: {...}, day3: {...}, day7: {...} })
      timelineArray = Object.entries(timeline)
        .map(([key, value]) => {
          const dayMatch = key.match(/\d+/);
          const dayNum = dayMatch ? parseInt(dayMatch[0]) : 0;
          return {
            day: dayNum,
            symptom: value.symptom || '',
            tip: value.tip || ''
          };
        })
        .filter(item => item.day > 0)
        .sort((a, b) => a.day - b.day);
    }
  }

  // Handle empty timeline
  if (!timelineArray || timelineArray.length === 0) {
    return (
      <div className="withdrawal-timeline">
        <p className="timeline-empty">Loading withdrawal timeline...</p>
      </div>
    );
  }

  return (
    <div className="withdrawal-timeline">
      <div className="timeline-container">
        {timelineArray.map((milestone, index) => {
          const isReached = safeDaysStopped >= milestone.day;
          
          return (
            <div
              key={index}
              className={`milestone ${isReached ? 'reached' : 'upcoming'}`}
            >
              <div className="milestone-marker">
                <div className="marker-circle">
                  {isReached ? '✓' : milestone.day}
                </div>
              </div>
              <div className="milestone-content">
                <h4>Day {milestone.day}</h4>
                <p className="symptom">{milestone.symptom}</p>
                {milestone.tip && <p className="tip">💡 {milestone.tip}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
