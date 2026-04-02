import React, { useState } from 'react';
import './Mindfulness.css';

const Mindfulness = () => {
  const [expandedSections, setExpandedSections] = useState({
    intro: true,
    multitasking: true,
    diningTable: true,
    practices: false,
    integration: false
  });

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const SectionBox = ({ id, icon, title, children }) => {
    const isExpanded = expandedSections[id] || false;
    
    return (
      <section className={`mindfulness-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="mindfulness-section-header" onClick={() => toggleSection(id)}>
          <div className="section-title">
            <div className="section-icon">{icon}</div>
            <h2>{title}</h2>
          </div>
          <div className="toggle-arrow">▼</div>
        </div>
        <div className="section-content">
          {children}
        </div>
      </section>
    );
  };

  return (
    <div className="mindfulness-container">
      <header className="mindfulness-header">
        <h1>🧠 Mindfulness for Recovery</h1>
        <p>Be present. Be aware. Be free from distractions.</p>
      </header>

      <div className="mindfulness-sections">
        <SectionBox id="intro" icon="✨" title="What is Mindfulness?">
          <p>
            Mindfulness is the practice of being fully present and engaged in the moment, without judgment. It's about paying attention to your thoughts, feelings, and surroundings with awareness and compassion.
          </p>
          <p>
            In recovery, mindfulness is powerful because it helps you:
          </p>
          <ul>
            <li><strong>Break the autopilot cycle</strong> - Many addictions thrive when we're on autopilot, not paying attention to what we're doing</li>
            <li><strong>Manage cravings</strong> - By observing urges without reacting to them, you can let them pass naturally</li>
            <li><strong>Reduce stress and anxiety</strong> - Mindfulness calms the nervous system and builds resilience</li>
            <li><strong>Reconnect with yourself</strong> - Recovery is about rediscovering who you are beyond the addiction</li>
            <li><strong>Improve decision-making</strong> - Present-moment awareness leads to better choices</li>
          </ul>
        </SectionBox>

        <SectionBox id="multitasking" icon="⚡" title="Multi-tasking: The Enemy of Mindfulness">
          <p>
            Multi-tasking is one of the biggest obstacles to mindfulness. When you're juggling multiple things at once, your attention is divided, and you're never truly present in any moment.
          </p>
          
          <div className="highlight-box">
            <h4>Why Multi-tasking Destroys Mindfulness:</h4>
            <ul>
              <li><strong>Fragmented attention</strong> - Your mind jumps between tasks, never settling into the present</li>
              <li><strong>Increased stress</strong> - Splitting your focus creates mental overload and anxiety</li>
              <li><strong>Poor quality outcomes</strong> - Nothing gets your full attention, so nothing gets done well</li>
              <li><strong>Enables addictive behavior</strong> - Multi-tasking creates the perfect environment for addictions to develop unnoticed</li>
              <li><strong>Reduced self-awareness</strong> - You miss warning signs and emotional cues</li>
            </ul>
          </div>

          <p>
            <strong>The Recovery Connection:</strong> Many people use multi-tasking as a distraction tool. You scroll social media while working, watch TV while eating, or check your phone while talking to friends. This constant mental fragmentation keeps you from noticing triggers, cravings, and your own emotional needs—all of which are crucial for recovery.
          </p>

          <p>
            <strong>The Mindfulness Solution:</strong> Do one thing at a time, with full attention. When you eat, just eat. When you work, just work. When you have a conversation, truly listen. This single-tasking approach honors both the activity and yourself.
          </p>
        </SectionBox>

        <SectionBox id="diningTable" icon="🍽️" title="The Power of Eating at the Table">
          <p>
            One of the most transformative mindfulness practices is eating dinner at the table without distractions. This simple act has profound benefits for recovery.
          </p>

          <div className="highlight-box">
            <h4>Benefits of Table Dining (No Screens):</h4>
            <ul>
              <li><strong>Mindful eating awareness</strong> - You notice flavors, textures, and satiation cues you normally miss</li>
              <li><strong>Better digestion</strong> - Eating slowly and attentively improves your body's ability to digest food</li>
              <li><strong>Enhanced gratitude</strong> - Slowing down helps you appreciate the effort that went into preparing the meal</li>
              <li><strong>Real connection</strong> - Eating with others at the table strengthens relationships and provides genuine human connection</li>
              <li><strong>Interrupts automaticity</strong> - Eating in front of the TV is often mindless and excessive; the table is intentional</li>
              <li><strong>Reduces emotional eating</strong> - When you're present with food, not distracted, you eat for hunger, not to fill emotional voids</li>
              <li><strong>Creates space for reflection</strong> - A meal without screens gives your mind a chance to process the day</li>
            </ul>
          </div>

          <p>
            <strong>TV Eating vs. Table Eating Comparison:</strong>
          </p>
          <div className="comparison-table">
            <div className="comparison-row header-row">
              <div className="comparison-cell header">Eating in Front of TV</div>
              <div className="comparison-cell header">Eating at the Table</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">❌ Mindless consumption, often excessive</div>
              <div className="comparison-cell">✅ Intentional and present</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">❌ Distracted from flavors and textures</div>
              <div className="comparison-cell">✅ Naturally creates connection</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">❌ Often triggers emotional eating</div>
              <div className="comparison-cell">✅ You're truly present with yourself and food</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">❌ Isolating (even if others are present)</div>
              <div className="comparison-cell">✅ Better digestion through mindful eating</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">❌ Your mind is with the screen, not your body</div>
              <div className="comparison-cell">✅ Reduces emotional eating triggers</div>
            </div>
          </div>

          <p className="tip">
            <strong>💡 Try This:</strong> For one week, commit to eating at least one meal per day at the table without any screens. Notice how different the experience feels. Pay attention to hunger, fullness cues, and how the food tastes.
          </p>
        </SectionBox>

        <SectionBox id="practices" icon="🌿" title="Other Meaningful Mindfulness Practices">
          <p>
            Beyond eating at the table, here are other powerful ways to cultivate mindfulness in your daily life:
          </p>

          <div className="practice-grid">
            <div className="practice-card">
              <div className="practice-icon">☕</div>
              <h4>Mindful Coffee/Tea</h4>
              <p>Instead of gulping your morning beverage while checking emails, sit down. Feel the warmth of the cup, savor each sip, notice the aroma. This 5-minute ritual starts your day with intention.</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon">🚶</div>
              <h4>Intentional Walking</h4>
              <p>Take a walk without your phone, or at least without distractions. Notice the ground beneath your feet, the air on your skin, the sounds around you. Walking becomes meditation.</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon">💬</div>
              <h4>Full Listening in Conversation</h4>
              <p>When someone speaks to you, truly listen. Don't plan your response or check your phone. Make eye contact. Listen to understand, not to reply. This builds deeper relationships.</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon">🧘</div>
              <h4>Meditation Practice</h4>
              <p>Even 5-10 minutes of sitting quietly, focusing on your breath, builds the mental muscle of mindfulness. Start small. Your brain learns to notice when it wanders, and gently bring it back—just like managing cravings.</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon">🛁</div>
              <h4>Mindful Bathing/Showering</h4>
              <p>Notice the temperature of the water, the scent of soap, the sensation on your skin. A shower can be meditation instead of autopilot. Leave your phone outside the bathroom.</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon">📝</div>
              <h4>Journaling</h4>
              <p>Write without editing or judgment. Observe your thoughts and feelings on paper. This builds self-awareness and helps you process emotions that might otherwise trigger cravings.</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon">🎨</div>
              <h4>Creative Activities</h4>
              <p>Painting, drawing, crafting, or any creative pursuit done without distractions. When you're absorbed in creating, you're fully present. Time disappears—this is mindfulness in flow.</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon">🌍</div>
              <h4>Nature Connection</h4>
              <p>Sit outside and observe nature. Watch birds, trees, clouds, or plants. This quiet observation of natural cycles reminds you of rhythms beyond your immediate cravings and needs.</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon">✋</div>
              <h4>One-Tasking</h4>
              <p>Commitment to single-tasking throughout your day. One thing at a time, with full attention. This is mindfulness in action—it applies to work, hobbies, and relationships.</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon">🤝</div>
              <h4>Mindful Social Time</h4>
              <p>Spend time with people you care about without phones present. Go for a walk together, have a meal, or just sit and talk. Real presence strengthens connections that support recovery.</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon">🎵</div>
              <h4>Music Listening</h4>
              <p>Put on a song and listen to it fully—no scrolling, no other activities. Pay attention to instruments, rhythm, and lyrics. Music becomes an experience, not background noise.</p>
            </div>

            <div className="practice-card">
              <div className="practice-icon">🫂</div>
              <h4>Mindful Hugging</h4>
              <p>When you hug someone, fully be present. Feel the embrace. Let go of your to-do list for those few seconds. Human connection is a powerful tool for emotional regulation in recovery.</p>
            </div>
          </div>
        </SectionBox>

        <SectionBox id="integration" icon="🔗" title="Integrating Mindfulness Into Your Recovery">
          <p>
            Mindfulness isn't separate from recovery—it IS part of recovery. Each moment of mindfulness is a moment you're not on autopilot, not following old patterns.
          </p>

          <div className="integration-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Start Small</h4>
              <p>You don't need to overhaul your entire life. Choose one mindfulness practice this week. Maybe it's eating one meal at the table, or a 5-minute walk.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h4>Notice the Difference</h4>
              <p>Observe how you feel after mindful activities. Do you feel calmer? More aware? More connected? This positive experience makes mindfulness sustainable.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h4>Use It for Craving Management</h4>
              <p>When a craving strikes, pause and observe it mindfully. Don't judge it. Just notice it like a cloud passing in the sky. Observation deflates the power of urges.</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h4>Build a Habit</h4>
              <p>After 2-3 weeks of consistent practice, mindfulness becomes a habit. Your brain learns it as a refuge you can return to anytime.</p>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <h4>Expand Gradually</h4>
              <p>As one mindfulness practice becomes natural, add another. Over time, mindfulness moves from a deliberate practice to a way of being.</p>
            </div>
          </div>

          <p className="closing-reflection">
            Recovery is about reclaiming your life from autopilot. Every moment of mindfulness is a moment you're truly alive, truly yourself, and truly free.
          </p>
        </SectionBox>
      </div>
    </div>
  );
};

export default Mindfulness;
