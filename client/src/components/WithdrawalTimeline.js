import React from 'react';
import './WithdrawalTimeline.css';

export default function WithdrawalTimeline({ daysStopped, timeline }) {
  return (
    <div className="withdrawal-timeline">
      <div className="timeline-container">
        {timeline.map((milestone, index) => {
          const isReached = daysStopped >= milestone.day;
          
          return (
            <div
              key={index}
              className={`milestone ${isReached ? 'reached' : 'upcoming'} severity-${milestone.severity}`}
            >
              <div className="milestone-marker">
                <div className="marker-circle">
                  {isReached ? '✓' : milestone.day}
                </div>
              </div>
              <div className="milestone-content">
                <h4>Day {milestone.day}</h4>
                <p>{milestone.symptom}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
