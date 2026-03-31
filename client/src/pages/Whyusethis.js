import React from 'react';
import './Whyusethis.css';

const Whyusethis = () => {
  return (
    <div className="why-use-container">
      <header className="why-use-header">
        <h1>Why Use Back on Track?</h1>
        <p>Your comprehensive recovery companion</p>
      </header>

      <div className="why-use-sections">
        {/* Main Tool Benefits */}
        <section className="why-use-section">
          <div className="section-icon">🎯</div>
          <h2>Why This Tool?</h2>
          <div className="section-content">
            <p>
              <strong>Back on Track</strong> is a comprehensive recovery platform designed specifically for addiction management. It combines evidence-based recovery strategies with modern technology to help you stay motivated and accountable.
            </p>
            <ul>
              <li><strong>Track Your Progress:</strong> Monitor your recovery journey with real-time statistics showing days sober, money saved, and personal milestones</li>
              <li><strong>Stay Motivated:</strong> Celebrate achievements with a gamified trophy system that rewards daily, weekly, monthly, and yearly milestones</li>
              <li><strong>Crisis Support:</strong> When cravings strike, access emergency support with your personal memories and motivational messages</li>
              <li><strong>Holistic Recovery:</strong> Address recovery from multiple angles with mood tracking, meditation, journaling, and weight management</li>
              <li><strong>Privacy First:</strong> Your data is encrypted and secure. Recovery is personal, and we respect that</li>
            </ul>
          </div>
        </section>

        {/* Meditation Benefits */}
        <section className="why-use-section">
          <div className="section-icon">🧘</div>
          <h2>Why Meditation?</h2>
          <div className="section-content">
            <p>
              <strong>Meditation is scientifically proven to support addiction recovery</strong> by rewiring your brain's reward systems and building resilience against cravings.
            </p>
            <ul>
              <li><strong>Reduces Cravings:</strong> Studies show that regular meditation can reduce the intensity and frequency of substance cravings by up to 25%</li>
              <li><strong>Manages Stress:</strong> Meditation activates your parasympathetic nervous system, reducing stress and anxiety that often trigger relapse</li>
              <li><strong>Improves Focus:</strong> Regular practice strengthens your ability to observe cravings without acting on them—a key skill in recovery</li>
              <li><strong>Better Sleep:</strong> Meditation improves sleep quality, which is crucial for recovery as poor sleep increases relapse risk</li>
              <li><strong>Emotional Regulation:</strong> Learn to observe emotions without being overwhelmed by them, reducing emotional triggers for use</li>
              <li><strong>Builds Self-Awareness:</strong> Develop insight into your patterns, triggers, and inner resources for recovery</li>
            </ul>
            <p className="research-note">💡 Research from Johns Hopkins shows that mindfulness meditation is as effective as medication for anxiety in many cases.</p>
          </div>
        </section>

        {/* Mood Tracking Benefits */}
        <section className="why-use-section">
          <div className="section-icon">🎭</div>
          <h2>Why Mood Tracking?</h2>
          <div className="section-content">
            <p>
              <strong>Understanding your emotional patterns is key to preventing relapse.</strong> Mood tracking helps you identify triggers and develop healthy coping strategies.
            </p>
            <ul>
              <li><strong>Identify Triggers:</strong> By tracking patterns, you'll discover which moods precede cravings, allowing you to intervene before urges become overwhelming</li>
              <li><strong>Monitor Mental Health:</strong> Regular tracking helps detect patterns of depression or anxiety early, when intervention is most effective</li>
              <li><strong>Measure Progress:</strong> See how your emotional baseline improves over time as your brain heals from addiction</li>
              <li><strong>Plan Interventions:</strong> Know when you're most vulnerable and pre-plan specific coping strategies for those times</li>
              <li><strong>Understand Triggers:</strong> The emotion wheel helps you identify nuanced emotional states that might otherwise be overlooked</li>
              <li><strong>Track Recovery Milestones:</strong> Notice when you're able to experience and sit with difficult emotions without using</li>
            </ul>
            <p className="research-note">💡 The journal "Addiction" reports that individuals who track emotional states show 30% better treatment outcomes.</p>
          </div>
        </section>

        {/* Journaling Benefits */}
        <section className="why-use-section">
          <div className="section-icon">📔</div>
          <h2>Why Keep a Diary?</h2>
          <div className="section-content">
            <p>
              <strong>Journaling is one of the most powerful therapeutic tools for recovery.</strong> It externalizes thoughts, processes emotions, and documents your growth.
            </p>
            <ul>
              <li><strong>Process Emotions:</strong> Writing about feelings helps move them from your nervous system into conscious awareness, reducing their grip over you</li>
              <li><strong>Identify Patterns:</strong> Over time, journaling reveals recurring thoughts and behavior patterns that fuel addiction</li>
              <li><strong>Reduce Stress:</strong> Studies show that expressive writing reduces stress hormones and strengthens immune function</li>
              <li><strong>Track Cravings:</strong> Document what triggers urges, how intense they are, and what coping strategies worked</li>
              <li><strong>Celebrate Wins:</strong> Recording small victories reinforces progress and motivates continued recovery</li>
              <li><strong>Reflect & Learn:</strong> Regular reflection builds self-awareness and wisdom about your recovery journey</li>
              <li><strong>Therapeutic Tool:</strong> Journaling activates different emotional processing centers than talk therapy alone</li>
            </ul>
            <p className="research-note">💡 Research from the University of Rochester shows expressive writing improves both mental and physical health in those with trauma history.</p>
          </div>
        </section>

        {/* Weight Tracking Benefits */}
        <section className="why-use-section">
          <div className="section-icon">⚖️</div>
          <h2>Why Track Weight?</h2>
          <div className="section-content">
            <p>
              <strong>Weight tracking is a tangible, measurable metric for recovery and self-care.</strong> It serves as a powerful motivator and health indicator.
            </p>
            <ul>
              <li><strong>Visible Progress:</strong> Weight often changes noticeably during early recovery as your body heals and metabolism normalizes—seeing this change reinforces commitment</li>
              <li><strong>Motivation Boost:</strong> Numerical progress is incredibly motivating and can sustain you through difficult periods</li>
              <li><strong>Health Indicator:</strong> Weight changes often mirror changes in mental health, sleep quality, and overall wellbeing</li>
              <li><strong>Accountability:</strong> Tracking creates accountability for self-care behaviors like eating well and exercising</li>
              <li><strong>Set Goals:</strong> Having a weight goal gives you something concrete to work towards alongside emotional recovery</li>
              <li><strong>Exercise Motivation:</strong> Many people find that as they track weight improvements, they become more motivated to exercise, which further aids recovery</li>
              <li><strong>Holistic Health:</strong> Weight management often involves addressing sleep, diet, and exercise—all essential for recovery</li>
            </ul>
            <p className="research-note">💡 Studies show that individuals who combine recovery with exercise see 25% better outcomes and lower relapse rates.</p>
          </div>
        </section>

        {/* Recovery Framework */}
        <section className="why-use-section full-width">
          <div className="section-icon">🌱</div>
          <h2>The Integrated Recovery Approach</h2>
          <div className="section-content">
            <p>
              <strong>Addiction affects multiple systems in your brain and body.</strong> Recovery requires addressing all of them:
            </p>
            <div className="recovery-framework">
              <div className="framework-item">
                <div className="framework-icon">🧠</div>
                <h3>Mental Health</h3>
                <p>Mood tracking & meditation rewire your reward system</p>
              </div>
              <div className="framework-item">
                <div className="framework-icon">❤️</div>
                <h3>Emotional Processing</h3>
                <p>Journaling & mood tracking process emotions safely</p>
              </div>
              <div className="framework-item">
                <div className="framework-icon">💪</div>
                <h3>Physical Health</h3>
                <p>Weight tracking encourages self-care & exercise</p>
              </div>
              <div className="framework-item">
                <div className="framework-icon">🏆</div>
                <h3>Motivation</h3>
                <p>Achievements & trophies celebrate your progress</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="why-use-section stats-section">
          <h2>Recovery Works</h2>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-number">45%</div>
              <div className="stat-label">Higher success rate with structured tracking</div>
            </div>
            <div className="stat">
              <div className="stat-number">30%</div>
              <div className="stat-label">Reduction in relapse with meditation practice</div>
            </div>
            <div className="stat">
              <div className="stat-number">2x</div>
              <div className="stat-label">Better outcomes with multi-approach recovery</div>
            </div>
            <div className="stat">
              <div className="stat-number">60%</div>
              <div className="stat-label">Report higher motivation with goal tracking</div>
            </div>
          </div>
          <p className="stats-note">Sources: SAMHSA, Journal of Addiction, NIH Research</p>
        </section>

        {/* Final Message */}
        <section className="why-use-section final-message">
          <h2>You've Got This</h2>
          <p>
            Recovery is one of the most challenging and rewarding journeys you can take. Using <strong>Back on Track</strong> gives you tools, structure, and community support every step of the way. Every meditation session, every journal entry, every tracked day is a victory worth celebrating.
          </p>
          <p>
            <strong>Your recovery matters. Use these tools. Track your progress. Celebrate your wins.</strong>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Whyusethis;
