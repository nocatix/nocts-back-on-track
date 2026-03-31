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
        </div>
      ) : (
        <>
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
