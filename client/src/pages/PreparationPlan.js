import React, { useState } from 'react';
import './PreparationPlan.css';

const PreparationPlan = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="preparation-container">
      {/* Header */}
      <header className="preparation-header">
        <h1>Make Your Plan & Get Ready to Stop</h1>
        <p>Preparation is the foundation of successful recovery. Use this guide to set yourself up for success.</p>
      </header>

      {/* Motivation Section */}
      <section className="preparation-section featured">
        <div className="section-header" onClick={() => toggleSection('motivation')}>
          <div className="section-title">
            <span className="section-emoji">⭐</span>
            <h2>Why Preparation Matters</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'motivation' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'motivation' ? 'expanded' : ''}`}>
          <p>
            <strong>Recovery isn't something that just happens—it's something you build.</strong> The time you spend preparing now will directly determine your success. People who plan their recovery are significantly more likely to stick with it through the difficult first days.
          </p>
          <ul className="section-list">
            <li>Preparation reduces impulsive decisions when you're struggling</li>
            <li>It builds confidence and commitment before you start</li>
            <li>It identifies potential obstacles before they catch you off-guard</li>
            <li>It ensures you have support systems in place from day one</li>
            <li>It demonstrates to yourself that you're serious about change</li>
          </ul>
          <p className="key-insight">💡 Every minute you spend planning now saves you hours of struggle later.</p>
        </div>
      </section>

      {/* 1. Assess Your Current Situation */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('assess')}>
          <div className="section-title">
            <span className="section-emoji">🔍</span>
            <h2>1. Assess Your Current Situation</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'assess' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'assess' ? 'expanded' : ''}`}>
          <p>Before you stop, understand where you are:</p>
          <div className="prep-checklist">
            <div className="checklist-item">
              <input type="checkbox" disabled />
              <label>How often am I using/engaging? (daily, weekly, multiple times daily)</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" disabled />
              <label>How much money am I spending per day/week?</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" disabled />
              <label>What time of day do I use most?</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" disabled />
              <label>What situations trigger my use? (stress, boredom, social, emotional)</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" disabled />
              <label>How has this addiction affected my health, relationships, work, finances?</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" disabled />
              <label>What have been my obstacles to quitting in the past?</label>
            </div>
          </div>
          <p>
            <strong>Tip:</strong> Use this app to track your current usage for a few days before you plan to quit. Real data is more powerful than guesses.
          </p>
        </div>
      </section>

      {/* 2. Set a Quit Date */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('quitdate')}>
          <div className="section-title">
            <span className="section-emoji">📅</span>
            <h2>2. Set a Specific Quit Date</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'quitdate' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'quitdate' ? 'expanded' : ''}`}>
          <p>
            <strong>Pick a date within the next 1-2 weeks.</strong> Give yourself enough time to prepare, but not so much that you lose motivation.
          </p>
          <div className="prep-tips">
            <div className="tip">
              <strong>✓ Good timing:</strong> Pick a day after a stressful event passes (not during)
            </div>
            <div className="tip">
              <strong>✓ Good timing:</strong> Pick a day when you have support available
            </div>
            <div className="tip">
              <strong>✗ Bad timing:</strong> Don't pick when you're already stressed or emotional
            </div>
            <div className="tip">
              <strong>✗ Bad timing:</strong> Don't pick when you'll be alone with easy access
            </div>
          </div>
          <p>
            Once you've picked your date, mark it in your calendar. Tell people about it. Post it somewhere you'll see it daily. Make it real.
          </p>
        </div>
      </section>

      {/* 3. Identify Your Triggers */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('triggers')}>
          <div className="section-title">
            <span className="section-emoji">🎯</span>
            <h2>3. Identify Your Triggers</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'triggers' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'triggers' ? 'expanded' : ''}`}>
          <p>
            <strong>Triggers are situations, emotions, or people that make you want to use.</strong> Knowing them in advance means you can plan for them.
          </p>
          <div className="trigger-categories">
            <div className="trigger-cat">
              <h4>Emotional Triggers</h4>
              <p>Stress, boredom, loneliness, anger, anxiety, sadness... what emotions drive your use?</p>
            </div>
            <div className="trigger-cat">
              <h4>Social Triggers</h4>
              <p>Specific people, places, or groups. Do you use with certain friends? In certain locations?</p>
            </div>
            <div className="trigger-cat">
              <h4>Environmental Triggers</h4>
              <p>Times of day, locations, objects. Does being in your room trigger you? Late nights?</p>
            </div>
            <div className="trigger-cat">
              <h4>Habitual Triggers</h4>
              <p>Things you've always done together. Morning coffee ritual? After work routine?</p>
            </div>
          </div>
          <p>
            <strong>Action:</strong> For each trigger, write down a specific plan for what you'll do instead.
          </p>
        </div>
      </section>

      {/* 4. Build Your Support Network */}
      <section className="preparation-section featured">
        <div className="section-header" onClick={() => toggleSection('support')}>
          <div className="section-title">
            <span className="section-emoji">🫂</span>
            <h2>4. Build Your Support Network</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'support' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'support' ? 'expanded' : ''}`}>
          <p>
            <strong>You cannot do this alone. Successful recovery requires connection and support.</strong> Build your network now, before you quit.
          </p>
          <div className="support-types">
            <div className="support-type">
              <h4>👥 People to Tell</h4>
              <ul>
                <li>At least one person you trust completely who you can call anytime</li>
                <li>Someone who won't judge you if you struggle</li>
                <li>Someone who will celebrate your wins</li>
                <li>Consider telling a therapist, counselor, or doctor</li>
              </ul>
            </div>
            <div className="support-type">
              <h4>📱 Support Resources</h4>
              <ul>
                <li>Support groups (AA, NA, SMART Recovery, etc.)</li>
                <li>Therapy or counseling services</li>
                <li>This app - use ALL its features (Diary, Mood, Meditation)</li>
                <li>Helplines and crisis text lines</li>
              </ul>
            </div>
            <div className="support-type">
              <h4>🏥 Professional Help</h4>
              <ul>
                <li>Medical withdrawal support if needed for alcohol or drugs</li>
                <li>Medication-assisted treatment if recommended</li>
                <li>Mental health treatment for underlying issues</li>
                <li>Don't try to do this without help if it's dangerous</li>
              </ul>
            </div>
          </div>
          <p className="action-step">
            <strong>Write down 3-5 specific people you can call when it gets hard.</strong> Get their numbers now and save them in your phone.
          </p>
        </div>
      </section>

      {/* 5. Plan Your Coping Strategies */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('coping')}>
          <div className="section-title">
            <span className="section-emoji">🛠️</span>
            <h2>5. Plan Your Coping Strategies</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'coping' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'coping' ? 'expanded' : ''}`}>
          <p>
            <strong>Cravings will come. You need concrete tools ready BEFORE they arrive.</strong>
          </p>
          <div className="coping-strategies">
            <div className="strategy">
              <h4>🧘 Meditation & Mindfulness</h4>
              <p>Use this app's Meditation feature. Even 2 minutes helps.</p>
            </div>
            <div className="strategy">
              <h4>🎮 Distraction Strategies</h4>
              <p>Use the Craving Game, watch a movie, call a friend, take a shower, exercise.</p>
            </div>
            <div className="strategy">
              <h4>💪 Physical Activity</h4>
              <p>Walk, run, yoga, dancing—anything to move your body and change your chemistry.</p>
            </div>
            <div className="strategy">
              <h4>📔 Journaling</h4>
              <p>Use the Diary feature to write through cravings and emotions.</p>
            </div>
            <div className="strategy">
              <h4>🎭 Emotional Processing</h4>
              <p>Track your moods, name your feelings, feel them without acting on them.</p>
            </div>
            <div className="strategy">
              <h4>🤝 Connection</h4>
              <p>Call someone, text a friend, attend a support group meeting.</p>
            </div>
          </div>
          <p>
            <strong>Create your personal Crisis Toolkit:</strong> Write down 3-5 things you'll do when cravings hit. Post it somewhere visible.
          </p>
        </div>
      </section>

      {/* 6. Remove Temptations */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('remove')}>
          <div className="section-title">
            <span className="section-emoji">🗑️</span>
            <h2>6. Remove Temptations</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'remove' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'remove' ? 'expanded' : ''}`}>
          <p>
            <strong>Make it as hard as possible to use.</strong> You can't say no to what isn't in front of you.
          </p>
          <div className="removal-actions">
            <div className="action-item">
              <strong>🚭 Clean Your Space</strong>
              <p>Get rid of all supplies, paraphernalia, reminders. Deep clean your room, car, bag.</p>
            </div>
            <div className="action-item">
              <strong>🗑️ Delete Access</strong>
              <p>Delete apps, block websites, unfollow accounts, delete dealer contacts.</p>
            </div>
            <div className="action-item">
              <strong>💳 Limit Money</strong>
              <p>Give control of finances to someone you trust. Remove access cards if needed.</p>
            </div>
            <div className="action-item">
              <strong>📍 Avoid Locations</strong>
              <p>Plan routes that avoid your typical using spots. Go different ways.</p>
            </div>
            <div className="action-item">
              <strong>👥 Distance from People</strong>
              <p>Consider telling friends you're quitting—real friends will support you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Plan for the First 48 Hours */}
      <section className="preparation-section featured">
        <div className="section-header" onClick={() => toggleSection('48hours')}>
          <div className="section-title">
            <span className="section-emoji">⏰</span>
            <h2>7. Plan for the First 48 Hours</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'timeitem' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === '48hours' ? 'expanded' : ''}`}>
          <p>
            <strong>The first 48 hours are the hardest. Plan it hour by hour if needed.</strong>
          </p>
          <div className="first-day-plan">
            <div className="time-block">
              <strong>When You Wake Up</strong>
              <p>Tell someone your quit is starting. Do something healthy (exercise, meditation, healthy breakfast).</p>
            </div>
            <div className="time-block">
              <strong>Morning (After Sleep)</strong>
              <p>Unstructured time is dangerous. Plan something: exercise, meet a friend, hobby, meditation.</p>
            </div>
            <div className="time-block">
              <strong>Afternoon (Peak Craving Time)</strong>
              <p>Call your support person. Use your Crisis Toolkit. This time will pass.</p>
            </div>
            <div className="time-block">
              <strong>Evening (Lonely Time)</strong>
              <p>Be around people or on the phone with someone. Stay occupied. Use the Diary to process.</p>
            </div>
            <div className="time-block">
              <strong>At Night (Hardest for Many)</strong>
              <p>Prepare for sleep: warm bath, tea, meditation, audiobook. You can do this.</p>
            </div>
          </div>
          <p className="key-insight">
            💡 If the first 48 hours pass without using, your odds of long-term success jump dramatically. You've got this.
          </p>
        </div>
      </section>

      {/* 8. Prepare Mentally */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('mental')}>
          <div className="section-title">
            <span className="section-emoji">🧠</span>
            <h2>8. Prepare Mentally</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'mental' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'mental' ? 'expanded' : ''}`}>
          <p>
            <strong>Your mindset determines your success.</strong> Plant these truths now, before you start:
          </p>
          <div className="mental-prep">
            <div className="belief">
              <strong>✓ This is possible.</strong> Millions of people have done it. You can too.
            </div>
            <div className="belief">
              <strong>✓ You're not weak.</strong> Addiction is powerful, and you're strong enough to overcome it.
            </div>
            <div className="belief">
              <strong>✓ Cravings are temporary.</strong> They peak in 15-20 minutes then fade. You just have to ride the wave.
            </div>
            <div className="belief">
              <strong>✓ Withdrawal is natural.</strong> Your body is healing. It will pass.
            </div>
            <div className="belief">
              <strong>✓ Slips happen—but they don't erase your progress.</strong> One mistake doesn't mean failure. Get back up.
            </div>
            <div className="belief">
              <strong>✓ You're worth this.</strong> Your health, freedom, and future are worth any temporary discomfort.
            </div>
          </div>
          <p>
            <strong>Action:</strong> Write these truths down. Put them on your mirror. Read them daily.
          </p>
        </div>
      </section>

      {/* 9. Talk to Your Doctor */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('doctor')}>
          <div className="section-title">
            <span className="section-emoji">⚕️</span>
            <h2>9. Talk to Your Doctor</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'doctor' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'doctor' ? 'expanded' : ''}`}>
          <p>
            <strong>Especially important for alcohol and hard drugs.</strong> Medical supervision can make withdrawal safer and more manageable.
          </p>
          <div className="medical-info">
            <div className="info-box">
              <h4>What Your Doctor Can Provide:</h4>
              <ul>
                <li>Assessment of your addiction severity</li>
                <li>Withdrawal management medication</li>
                <li>Referral to addiction specialists</li>
                <li>Treatment for underlying mental health issues</li>
                <li>Medical detoxification if needed</li>
              </ul>
            </div>
            <div className="info-box">
              <h4>Be Honest With Your Doctor:</h4>
              <ul>
                <li>Tell them what, how much, and how often you've been using</li>
                <li>Tell them your quit date</li>
                <li>Tell them about any medical conditions</li>
                <li>Tell them about medications you're taking</li>
              </ul>
            </div>
          </div>
          <p>
            <strong>This is not judgment—it's healthcare.</strong> Doctors help people quit every day. They want to help you.
          </p>
        </div>
      </section>

      {/* 10. Tell People */}
      <section className="preparation-section featured">
        <div className="section-header" onClick={() => toggleSection('tell')}>
          <div className="section-title">
            <span className="section-emoji">📢</span>
            <h2>10. Tell People (Carefully)</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'tell' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'tell' ? 'expanded' : ''}`}>
          <p>
            <strong>Accountability is powerful.</strong> But choose who you tell carefully.
          </p>
          <div className="tell-people">
            <div className="tell-group">
              <h4>Tell These People:</h4>
              <ul>
                <li>✅ Someone you completely trust</li>
                <li>✅ People who truly support you</li>
                <li>✅ Your support network</li>
                <li>✅ Your therapist or counselor</li>
              </ul>
            </div>
            <div className="tell-group">
              <h4>Be Careful With:</h4>
              <ul>
                <li>⚠️ People who use and might pressure you</li>
                <li>⚠️ People who've been judgmental about this before</li>
                <li>⚠️ People who aren't emotionally healthy themselves</li>
                <li>⚠️ Social media—you don't need to broadcast to everyone</li>
              </ul>
            </div>
          </div>
          <p>
            <strong>What to say:</strong> "I've decided to quit [addiction] on [date]. I'm telling you because I need your support. If I reach out struggling, please be there for me."
          </p>
        </div>
      </section>

      {/* 11. Create a Backup Plan */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('backup')}>
          <div className="section-title">
            <span className="section-emoji">🆘</span>
            <h2>11. Create a Backup Plan</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'backup' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'backup' ? 'expanded' : ''}`}>
          <p>
            <strong>What if everything goes wrong?</strong> Have a plan for crisis moments.
          </p>
          <div className="backup-plan">
            <div className="plan-step">
              <h4>If a Craving Hits Hard</h4>
              <p>1. Call your support person immediately<br/>2. Use your Crisis Toolkit (distraction, exercise, etc.)<br/>3. Get to a safe place if needed<br/>4. Use the Craving Game or Meditation feature</p>
            </div>
            <div className="plan-step">
              <h4>If You Almost Use</h4>
              <p>1. Tell someone what you're experiencing<br/>2. Get professional help (therapist emergency line, doctor)<br/>3. Don't isolate<br/>4. This is not failure—this is you fighting</p>
            </div>
            <div className="plan-step">
              <h4>If You Do Use</h4>
              <p>1. Don't beat yourself up or give up entirely<br/>2. This is a lapse, not a relapse<br/>3. Call your support person immediately<br/>4. Understand what triggered it<br/>5. Restart your quit date—you haven't failed</p>
            </div>
            <div className="plan-step">
              <h4>Emergency Resources</h4>
              <p>SAMHSA National Helpline: <strong>1-800-662-4357</strong><br/>Crisis Text Line: Text HOME to <strong>741741</strong><br/>National Suicide Prevention Lifeline: <strong>988</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Your Pre-Quit Checklist */}
      <section className="preparation-section featured final-checklist">
        <div className="section-header" onClick={() => toggleSection('checklist')}>
          <div className="section-title">
            <span className="section-emoji">✅</span>
            <h2>12. Pre-Quit Checklist</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'checklist' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'checklist' ? 'expanded' : ''}`}>
          <p>Before you start, make sure you've done these things:</p>
          <div className="final-checklist-items">
            <div className="checklist-row">
              <input type="checkbox" disabled />
              <label>✓ I've set a specific quit date (within 1-2 weeks)</label>
            </div>
            <div className="checklist-row">
              <input type="checkbox" disabled />
              <label>✓ I've identified my top 3 triggers</label>
            </div>
            <div className="checklist-row">
              <input type="checkbox" disabled />
              <label>✓ I've made plans for each trigger</label>
            </div>
            <div className="checklist-row">
              <input type="checkbox" disabled />
              <label>✓ I have 3-5 support people identified with their numbers saved</label>
            </div>
            <div className="checklist-row">
              <input type="checkbox" disabled />
              <label>✓ I've created my personal Crisis Toolkit (5+ strategies)</label>
            </div>
            <div className="checklist-row">
              <input type="checkbox" disabled />
              <label>✓ I've removed temptations from my space</label>
            </div>
            <div className="checklist-row">
              <input type="checkbox" disabled />
              <label>✓ I've planned my first 48 hours hour by hour</label>
            </div>
            <div className="checklist-row">
              <input type="checkbox" disabled />
              <label>✓ I've talked to my doctor (or scheduled an appointment)</label>
            </div>
            <div className="checklist-row">
              <input type="checkbox" disabled />
              <label>✓ I've told at least one support person my quit date</label>
            </div>
            <div className="checklist-row">
              <input type="checkbox" disabled />
              <label>✓ I've saved crisis helpline numbers in my phone</label>
            </div>
            <div className="checklist-row">
              <input type="checkbox" disabled />
              <label>✓ I understand that this will be hard—and I'm ready</label>
            </div>
          </div>
        </div>
      </section>

      {/* Final Message */}
      <section className="preparation-section final-message">
        <div className="section-icon">💪</div>
        <h2>You're Ready</h2>
        <div className="section-content">
          <p>
            You've made your plan. You've prepared your mind and your environment. You have support. You have tools. You know what's coming and you have strategies to handle it.
          </p>
          <p>
            <strong>The day you quit isn't the beginning of your recovery—it's just the beginning you can see.</strong> Recovery started when you decided to make this change. Every step you've taken to prepare is recovery.
          </p>
          <p>
            You're going to face difficult moments. Cravings will come. Emotions will be overwhelming. Withdrawal might be uncomfortable. But you're not doing this alone. You have people. You have tools. You have this app. You have yourself—and that's enough.
          </p>
          <p>
            <strong>Welcome to your new life.</strong> It starts now.
          </p>
          <p className="final-encouragement">
            When you're ready to quit, start tracking in this app. Use every tool available. Reach out to your support network. And remember: every single day you don't use is a victory worth celebrating.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PreparationPlan;
