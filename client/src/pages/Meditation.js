import React from 'react';
import './Meditation.css';
import { useNavigate } from 'react-router-dom';
import { getCookie, setCookie } from '../utils/cookieHelper';

export default function Meditation() {
  const navigate = useNavigate();
  const [selectedMeditation, setSelectedMeditation] = React.useState(null);
  const [showMeditationTips, setShowMeditationTips] = React.useState(() => {
    const saved = getCookie('showMeditationTips');
    return saved !== null ? saved : true;
  });
  const [showBreathingGuide, setShowBreathingGuide] = React.useState(false);
  const [breathingPhase, setBreathingPhase] = React.useState('inhale');
  const [breathDuration, setBreathDuration] = React.useState(4);
  const [isBreathing, setIsBreathing] = React.useState(false);
  const [sessionMinutes, setSessionMinutes] = React.useState(5);
  const [timerActive, setTimerActive] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(300);
  const [sessions, setSessions] = React.useState(() => {
    const saved = getCookie('meditationSessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedTool, setSelectedTool] = React.useState(null);

  const meditations = [
    {
      id: 1,
      title: 'Breath Awareness',
      duration: '5 min',
      description: 'Start with basic breath awareness to calm your mind.',
      guide: `Take a comfortable seat. Close your eyes. Breathe naturally through your nose. 
      Count each exhale from 1 to 10, then start again. If your mind wanders, that's okay - just return to counting.
      Continue for 5 minutes. This simple practice helps calm anxiety and cravings.`,
      musicUrl: 'https://www.youtube.com/embed/7qJZy4DpOWA'
    },
    {
      id: 2,
      title: 'Body Scan',
      duration: '7 min',
      description: 'Release tension from your body systematically.',
      guide: `Lie down or sit comfortably. Close your eyes. Start at the top of your head.
      Notice any tension. As you breathe, imagine releasing that tension with each exhale.
      Slowly move down: forehead, jaw, neck, shoulders, arms, chest, stomach, legs, feet.
      Spend 10-15 seconds on each area. This technique reduces physical stress from withdrawal.`,
      musicUrl: 'https://www.youtube.com/embed/2DRyAW0ljHQ'
    },
    {
      id: 3,
      title: 'Craving Release',
      duration: '10 min',
      description: 'Specific meditation for handling cravings.',
      guide: `Sit comfortably. Close your eyes. Notice any craving in your body without judgment.
      Don't try to fight it. Observe: where is it? What does it feel like? Does it have a color, shape, or temperature?
      As you breathe, imagine the craving as a wave passing through you. Watch it rise, peak, and fall.
      Remember: cravings are temporary. This too shall pass. They fade naturally within 15-20 minutes.`,
      musicUrl: 'https://www.youtube.com/embed/sTzHDPqBN-8'
    },
    {
      id: 4,
      title: 'Loving Kindness',
      duration: '8 min',
      description: 'Cultivate compassion and self-love during recovery.',
      guide: `Sit comfortably. Close your eyes. Place hand on heart. Say silently:
      "May I be peaceful. May I be healthy. May I be happy. May I be free from addiction."
      Repeat slowly, feeling each word. Then extend: "May others also find peace and healing."
      This practice builds self-compassion and motivation for recovery.`,
      musicUrl: 'https://www.youtube.com/embed/lE5n6gYzJLo'
    }
  ];

  const tips = [
    'Start with just 5 minutes daily. Consistency matters more than duration.',
    'Practice at the same time each day to build a habit.',
    'Cravings peak 15-20 minutes. Meditate through the peak.',
    'Use meditation when you feel most tempted.',
    'Your mind will wander - that\'s normal. Gently bring it back.',
    'Track your progress. Notice how cravings become easier to handle.'
  ];

  // Breathing guide animation
  React.useEffect(() => {
    if (!isBreathing) return;

    let phase = 'inhale';
    let duration = breathDuration;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 0.1;

      if (phase === 'inhale' && elapsed >= duration) {
        phase = 'hold';
        duration = 4;
        elapsed = 0;
        setBreathingPhase('hold');
      } else if (phase === 'hold' && elapsed >= duration) {
        phase = 'exhale';
        duration = breathDuration;
        elapsed = 0;
        setBreathingPhase('exhale');
      } else if (phase === 'exhale' && elapsed >= duration) {
        phase = 'inhale';
        duration = breathDuration;
        elapsed = 0;
        setBreathingPhase('inhale');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isBreathing, breathDuration]);

  // Timer logic
  React.useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  const completeSession = () => {
    const newSession = {
      date: new Date().toLocaleDateString(),
      duration: sessionMinutes,
      type: selectedMeditation?.title || 'Quick Session'
    };
    setSessions([...sessions, newSession]);
    setCookie('meditationSessions', JSON.stringify([...sessions, newSession]), 365);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTimeLeft(sessionMinutes * 60);
    setTimerActive(true);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(sessionMinutes * 60);
  };

  // Save meditation tips state to cookie
  React.useEffect(() => {
    setCookie('showMeditationTips', showMeditationTips, 365);
  }, [showMeditationTips]);

  return (
    <div className="meditation-page">
      {selectedMeditation ? (
        <div className="meditation-detail">
          <button onClick={() => setSelectedMeditation(null)} className="btn btn-secondary">
            &larr; Back to Meditations
          </button>
          <h2>{selectedMeditation.title}</h2>
          <p className="duration">Duration: {selectedMeditation.duration}</p>

          <div className="meditation-tools">
            <div className="timer-section">
              <h3>⏱️ Session Timer</h3>
              <div className="timer-display">{formatTime(timeLeft)}</div>
              <div className="timer-controls">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={sessionMinutes}
                  onChange={(e) => {
                    setSessionMinutes(parseInt(e.target.value));
                    setTimeLeft(parseInt(e.target.value) * 60);
                  }}
                  disabled={timerActive}
                  className="timer-slider"
                />
                <div className="timer-buttons">
                  <button onClick={startTimer} disabled={timerActive} className="btn btn-primary">Start</button>
                  <button onClick={() => setTimerActive(!timerActive)} className="btn btn-secondary">
                    {timerActive ? 'Pause' : 'Resume'}
                  </button>
                  <button onClick={resetTimer} className="btn btn-outline">Reset</button>
                </div>
                <p className="timer-label">{sessionMinutes} minutes</p>
              </div>
            </div>

            <div className="breathing-section">
              <h3>🫁 Guided Breathing</h3>
              <div className={`breathing-circle ${isBreathing ? 'active' : ''} ${breathingPhase}`}></div>
              <p className="breathing-instruction">{breathingPhase.toUpperCase()}</p>
              <div className="breathing-controls">
                <label>Breathing pace: {breathDuration}s</label>
                <input
                  type="range"
                  min="3"
                  max="6"
                  value={breathDuration}
                  onChange={(e) => setBreathDuration(parseInt(e.target.value))}
                  disabled={isBreathing}
                  className="breathing-slider"
                />
                <button
                  type="button"
                  onClick={() => setIsBreathing(!isBreathing)}
                  className={isBreathing ? 'btn-breathing-stop' : 'btn btn-primary'}
                >
                  {isBreathing ? '⏹ Stop Breathing Guide' : '▶ Start Breathing Guide'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="music-player">
            <h3>🎵 Meditation Music</h3>
            <iframe
              width="100%"
              height="315"
              src={`${selectedMeditation.musicUrl}?autoplay=0`}
              title="Meditation Music"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="meditation-guide">
            <h3>Guide:</h3>
            <p>{selectedMeditation.guide}</p>
          </div>

          <div className="posture-tips">
            <h3>🧘 Posture Tips</h3>
            <ul>
              <li><strong>Spine:</strong> Keep it straight but not rigid - imagine a string from your tail to the top of your head</li>
              <li><strong>Shoulders:</strong> Relax down and back, away from your ears</li>
              <li><strong>Hands:</strong> Rest on your knees or lap, palms up or down as comfortable</li>
              <li><strong>Chin:</strong> Tuck slightly, eyes looking down naturally (open or closed both fine)</li>
              <li><strong>Feet:</strong> If sitting, plant firmly on ground. If lying down, let them naturally fall outward</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="quick-tools">
            <div className="quick-tool-card urgent">
              <h3>🆘 Emergency Calm</h3>
              <p>Instant relief for intense cravings</p>
              <button type="button" className="btn-emergency-calm" onClick={() => {
                setSessionMinutes(3);
                setTimeLeft(180);
                setTimerActive(true);
                setIsBreathing(true);
                setShowBreathingGuide(true);
              }}>3-Min Emergency Calm</button>
            </div>

            <div className="quick-tool-card breathing">
              <h3>🫁 Quick Breathing</h3>
              <p>Reset your nervous system</p>
              <button className="btn btn-primary" onClick={() => setShowBreathingGuide(!showBreathingGuide)}>
                {showBreathingGuide ? 'Hide Breathing Guide' : 'Show Breathing Guide'}
              </button>
            </div>

            <div className="quick-tool-card stats">
              <h3>📈 Your Progress</h3>
              <div className="stats-display">
                <p><strong>{sessions.length}</strong> sessions completed</p>
                <p><strong>{sessions.reduce((sum, s) => sum + s.duration, 0)}</strong> mins total</p>
              </div>
            </div>
          </div>

          {showBreathingGuide && (
            <div className="breathing-guide-full">
              <h2>Guided Breathing Exercise</h2>
              <div className={`breathing-circle large ${isBreathing ? 'active' : ''} ${breathingPhase}`}></div>
              <p className="breathing-instruction large">{breathingPhase.toUpperCase()}</p>
              <div className="breathing-fullpage-controls">
                <label>Breathing pace: {breathDuration}s</label>
                <input
                  type="range"
                  min="3"
                  max="6"
                  value={breathDuration}
                  onChange={(e) => setBreathDuration(parseInt(e.target.value))}
                  disabled={isBreathing}
                  className="breathing-slider"
                />
                <button
                  type="button"
                  onClick={() => setIsBreathing(!isBreathing)}
                  className={isBreathing ? 'btn-breathing-stop-large' : 'btn btn-large btn-primary'}
                >
                  {isBreathing ? '⏹ Stop' : '▶ Start'} Breathing Guide
                </button>
              </div>
              <div className="breathing-tips">
                <p>👉 Breathe in slowly through your nose, hold gently, then exhale through your mouth</p>
                <p>💡 This calms your nervous system and reduces cravings naturally</p>
              </div>
            </div>
          )}

          <div className="meditation-grid">
            {meditations.map(med => (
              <div
                key={med.id}
                className="meditation-card"
                onClick={() => setSelectedMeditation(med)}
              >
                <h3>{med.title}</h3>
                <p className="duration">{med.duration}</p>
                <p className="description">{med.description}</p>
                <button className="btn btn-small">Start →</button>
              </div>
            ))}
          </div>

          <div className="music-section">
            <h2>🎵 Recommended Meditation Music</h2>
            <p>Listen to ambient music while meditating:</p>
            <div className="music-links">
              <a href="https://www.youtube.com/results?search_query=meditation+music+10+hours" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                YouTube: Meditation Music
              </a>
              <a href="https://open.spotify.com/search/meditation" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Spotify: Meditation Playlists
              </a>
              <a href="https://www.calm.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Calm App
              </a>
            </div>
          </div>

          {sessions.length > 0 && (
            <div className="sessions-history">
              <h2>📝 Recent Sessions</h2>
              <div className="sessions-list">
                {sessions.slice(-5).reverse().map((session, idx) => (
                  <div key={idx} className="session-item">
                    <span className="session-date">{session.date}</span>
                    <span className="session-type">{session.type}</span>
                    <span className="session-duration">{session.duration} min</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="tips-section">
            <div className="tips-header">
              <h2>💡 Tips for Successful Meditation</h2>
              <button className="btn-hint-toggle-arrow" onClick={() => setShowMeditationTips(!showMeditationTips)} title={showMeditationTips ? 'Hide tips' : 'Show tips'}>
                {showMeditationTips ? '▼' : '▶'}
              </button>
            </div>
            {showMeditationTips && (
              <ul>
                {tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
