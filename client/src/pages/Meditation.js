import React from 'react';
import './Meditation.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCookie, setCookie } from '../utils/cookieHelper';

export default function Meditation() {
  const navigate = useNavigate();
  const { t } = useTranslation('resources');
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

  const meditations = t('meditation.meditations', { returnObjects: true });
  const tips = t('meditation.tips', { returnObjects: true });
  const postureTips = t('meditation.postureTipsList', { returnObjects: true });

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
            {t('meditation.backToMeditations')}
          </button>
          <h2>{selectedMeditation.title}</h2>
          <p className="duration">Duration: {selectedMeditation.duration}</p>

          <div className="meditation-tools">
            <div className="timer-section">
              <h3>{t('meditation.sessionTimer')}</h3>
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
                  <button onClick={startTimer} disabled={timerActive} className="btn btn-primary">{t('meditation.start')}</button>
                  <button onClick={() => setTimerActive(!timerActive)} className="btn btn-secondary">
                    {timerActive ? t('meditation.pause') : t('meditation.resume')}
                  </button>
                  <button onClick={resetTimer} className="btn btn-outline">{t('meditation.reset')}</button>
                </div>
                <p className="timer-label">{sessionMinutes} {t('meditation.minutes')}</p>
              </div>
            </div>

            <div className="breathing-section">
              <h3>{t('meditation.guidedBreathing')}</h3>
              <div className={`breathing-circle ${isBreathing ? 'active' : ''} ${breathingPhase}`}></div>
              <p className="breathing-instruction">{breathingPhase.toUpperCase()}</p>
              <div className="breathing-controls">
                <label>{t('meditation.breathingPace')}: {breathDuration}s</label>
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
                  {isBreathing ? t('meditation.stopBreathingGuide') : t('meditation.startBreathingGuide')}
                </button>
              </div>
            </div>
          </div>
          
          <div className="music-player">
            <h3>{t('meditation.meditationMusic')}</h3>
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
            <h3>{t('meditation.guide')}:</h3>
            <p>{selectedMeditation.guide}</p>
          </div>

          <div className="posture-tips">
            <h3>{t('meditation.postureTips')}</h3>
            <ul>
              {postureTips.map((tip, idx) => (
                <li key={idx}><strong>{tip.label}:</strong> {tip.text}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="quick-tools">
            <div className="quick-tool-card urgent">
              <h3>{t('meditation.emergencyCalmTitle')}</h3>
              <p>{t('meditation.emergencyCalmDesc')}</p>
              <button type="button" className="btn-emergency-calm" onClick={() => {
                setSessionMinutes(3);
                setTimeLeft(180);
                setTimerActive(true);
                setIsBreathing(true);
                setShowBreathingGuide(true);
              }}>{t('meditation.emergencyCalm3Min')}</button>
            </div>

            <div className="quick-tool-card breathing">
              <h3>{t('meditation.quickBreathingTitle')}</h3>
              <p>{t('meditation.quickBreathingDesc')}</p>
              <button className="btn btn-primary" onClick={() => setShowBreathingGuide(!showBreathingGuide)}>
                {showBreathingGuide ? t('meditation.hideBreathingGuide') : t('meditation.showBreathingGuide')}
              </button>
            </div>

            <div className="quick-tool-card stats">
              <h3>{t('meditation.progressTitle')}</h3>
              <div className="stats-display">
                <p><strong>{sessions.length}</strong> {t('meditation.sessionsCompleted')}</p>
                <p><strong>{sessions.reduce((sum, s) => sum + s.duration, 0)}</strong> {t('meditation.minsTotal')}</p>
              </div>
            </div>
          </div>

          {showBreathingGuide && (
            <div className="breathing-guide-full">
              <h2>{t('meditation.guidedBreathingExercise')}</h2>
              <div className={`breathing-circle large ${isBreathing ? 'active' : ''} ${breathingPhase}`}></div>
              <p className="breathing-instruction large">{breathingPhase.toUpperCase()}</p>
              <div className="breathing-fullpage-controls">
                <label>{t('meditation.breathingPace')}: {breathDuration}s</label>
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
                  {isBreathing ? t('meditation.stopBreathingGuide') : t('meditation.startBreathingGuide')}
                </button>
              </div>
              <div className="breathing-tips">
                <p>{t('meditation.breathingTip1')}</p>
                <p>{t('meditation.breathingTip2')}</p>
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
            <h2>{t('meditation.recommendedMusicTitle')}</h2>
            <p>{t('meditation.listenToMusic')}</p>
            <div className="music-links">
              <a href="https://www.youtube.com/results?search_query=meditation+music+10+hours" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {t('meditation.youtubeMusic')}
              </a>
              <a href="https://open.spotify.com/search/meditation" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {t('meditation.spotifyMusic')}
              </a>
              <a href="https://www.calm.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {t('meditation.calmApp')}
              </a>
            </div>
          </div>

          {sessions.length > 0 && (
            <div className="sessions-history">
              <h2>{t('meditation.recentSessionsTitle')}</h2>
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
              <h2>{t('meditation.tipsForMeditation')}</h2>
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
