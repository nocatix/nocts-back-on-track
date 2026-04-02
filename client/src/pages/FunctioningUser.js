import React, { useState } from 'react';
import './Whyusethis.css';

const FunctioningUser = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const SectionBox = ({ id, icon, title, children }) => {
    const isExpanded = expandedSections[id] || false;
    
    return (
      <section className={`why-use-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="why-use-section-header" onClick={() => toggleSection(id)}>
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
    <div className="why-use-container">
      <header className="why-use-header">
        <h1>The Myth of the Functioning User</h1>
        <p>Understanding why "functional addiction" is a dangerous illusion</p>
      </header>

      <div className="why-use-sections">
        <SectionBox id="illusion" icon="🎭" title="What is a Functioning User?">
          <p>
            <strong>A "functioning user" is someone who maintains basic life responsibilities—job, housing, relationships—while regularly using drugs.</strong> On the surface, they appear okay. They show up, they perform, they haven't completely destroyed their life yet.
          </p>
          <p>But this is an illusion. A dangerous one.</p>
          <ul>
            <li><strong>Hidden Damage:</strong> While external functioning continues, internal damage accelerates—brain chemistry, organ damage, mental health deterioration</li>
            <li><strong>Increasing Tolerance:</strong> The body requires more of the substance to achieve the same effect, driving escalating usage</li>
            <li><strong>Erosion of Judgment:</strong> Decision-making capacity degrades so gradually that impaired judgment feels normal</li>
            <li><strong>False Security:</strong> Functioning users often believe they "have it under control," making them less likely to seek help</li>
            <li><strong>Delayed Crisis:</strong> When the crash comes—and it does—it's often catastrophic because the dysfunction was hidden longer</li>
          </ul>
        </SectionBox>

        <SectionBox id="brain" icon="🧠" title="The Brain Chemistry Reality">
          <p>
            <strong>Your brain doesn't care if you're "functioning."</strong> Addiction is fundamentally a brain disorder characterized by changes in neural pathways regardless of your job status.
          </p>
          <ul>
            <li><strong>Reward Pathway Hijacking:</strong> Drugs flood the brain with dopamine, overwriting natural reward systems. Your brain learns to prioritize the drug above food, sex, sleep, and social connection</li>
            <li><strong>Tolerance Development:</strong> The brain auto-adjusts to the constant chemical presence, requiring more substance to achieve the same effect—a direct path to overdose</li>
            <li><strong>Prefrontal Cortex Damage:</strong> Brain imaging shows reduced activity in decision-making regions, explaining why addiction persists despite negative consequences</li>
            <li><strong>Neurodegeneration:</strong> Repeated drug use causes actual structural brain damage. This isn't reversible overnight—recovery requires sustained effort</li>
            <li><strong>Withdrawal Syndrome:</strong> The brain becomes dependent on the drug to maintain chemical balance. Stopping triggers acute physical and psychological distress</li>
            <li><strong>Automatic Behavior Loops:</strong> Your brain stores powerful associations between cues (people, places, emotions) and drug use—these fire automatically</li>
          </ul>
          <p className="research-note">💡 fMRI studies show measurable brain changes in all users, regardless of functional status. The brain doesn't distinguish between a CEO who uses and an unemployed person who uses.</p>
        </SectionBox>

        <SectionBox id="progression" icon="📉" title="The Inevitable Progression">
          <p><strong>Addiction follows a predictable path. Functioning status only delays inevitable consequences.</strong></p>
          <div className="progression-timeline">
            <div className="timeline-item">
              <div className="timeline-marker">Stage 1</div>
              <h4>Recreational Use</h4>
              <p>"I can stop whenever I want" • Full control perceived</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">Stage 2</div>
              <h4>Regular Use</h4>
              <p>"Functioning User" phase • External appearance maintained • Internal damage accelerating</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">Stage 3</div>
              <h4>Dependency</h4>
              <p>Visible problems emerge • Job performance declining • Relationships suffering • Financial strain</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">Stage 4</div>
              <h4>Addiction Crisis</h4>
              <p>Life falling apart • Medical emergencies • Legal consequences • Overdose risk</p>
            </div>
          </div>
          <p><strong>The functioning phase is not stability—it's a ticking time bomb.</strong> The longer someone appears to be "fine," the more damage is accumulating invisibly.</p>
        </SectionBox>

        <SectionBox id="health" icon="⚕️" title="Physical & Mental Health Costs">
          <p><strong>Your body keeps score regardless of your job performance.</strong></p>
          <ul>
            <li><strong>Cardiovascular Damage:</strong> Increased heart rate, blood pressure, arrhythmias, and heart attack risk—even looking "fine" externally</li>
            <li><strong>Lung & Respiratory:</strong> Chronic inflammation, reduced oxygen capacity, and increased infection risk</li>
            <li><strong>Liver & Kidney:</strong> These organs filter toxins. Chronic drug use causes progressive, often irreversible damage</li>
            <li><strong>Immune System Collapse:</strong> Suppressed immunity makes infections more likely and recovery from illness slower</li>
            <li><strong>Sleep Disruption:</strong> Drugs disrupt sleep architecture—even when you appear rested, your body isn't recovering</li>
            <li><strong>Nutritional Deficiency:</strong> Appetite suppression and poor eating habits lead to malnutrition affecting every system</li>
            <li><strong>Mental Health Crisis:</strong> Depression, anxiety, paranoia, and psychosis—these develop gradually but intensify over time</li>
            <li><strong>Overdose Death:</strong> The ultimate consequence. Functioning users often believe "it won't happen to me"—until it does</li>
          </ul>
        </SectionBox>

        <SectionBox id="relationships" icon="💔" title="The Hidden Relationship Cost">
          <p><strong>Addiction is a relational disease. No one recovers in isolation, and no one uses in isolation either.</strong></p>
          <ul>
            <li><strong>Emotional Unavailability:</strong> While appearing present, you're chemically withdrawn from loved ones. Emotional connection becomes impossible</li>
            <li><strong>Broken Trust:</strong> The lies required to hide use accumulate. People closest to you sense something is wrong, eroding trust</li>
            <li><strong>Abandonment:</strong> Loved ones eventually leave—not because they stop caring, but because they can't support active addiction indefinitely</li>
            <li><strong>Parenting Impact:</strong> Children of using parents experience trauma, even when physical needs are met. Emotional neglect is still neglect</li>
            <li><strong>Partner Codependency:</strong> Those close to a functioning user often develop codependent patterns, enabling the addiction</li>
            <li><strong>Social Isolation:</strong> Over time, healthy relationships fade as more time is spent with other users or alone with the drug</li>
            <li><strong>Legacy of Pain:</strong> Your addiction affects generations—children, grandchildren, and everyone in your orbit</li>
          </ul>
        </SectionBox>

        <SectionBox id="cognition" icon="🧩" title="Cognitive Decline & Slow Mental Death">
          <p><strong>Long-term drug use causes measurable cognitive decline—even when functioning.</strong></p>
          <ul>
            <li><strong>Memory Impairment:</strong> Both short-term and long-term memory deteriorate</li>
            <li><strong>Attention Deficit:</strong> Concentration becomes increasingly difficult. Complex thinking becomes impossible</li>
            <li><strong>Decision-Making:</strong> The brain regions responsible for judgment atrophy. Bad decisions feel normal</li>
            <li><strong>Executive Function:</strong> Planning, organizing, and executing multi-step tasks become harder</li>
            <li><strong>Emotional Regulation:</strong> Mood swings, explosions of anger, and emotional instability increase</li>
            <li><strong>Problem-Solving:</strong> Your ability to handle life challenges diminishes, increasing dependence on the drug for coping</li>
            <li><strong>Personality Changes:</strong> People who knew you before notice you're "not the same anymore"—aggressive, withdrawn, paranoid, or erratic</li>
            <li><strong>Recovery Potential:</strong> The longer use continues, the less your brain can recover. Early intervention is critical</li>
          </ul>
          <p className="research-note">💡 PET scans show that chronic drug users have brain activity patterns resembling those with dementia—this is preventable with recovery.</p>
        </SectionBox>

        <SectionBox id="recovery" icon="🎯" title="Why Recovery Matters RIGHT NOW">
          <p><strong>If you're a functioning user, recovery TODAY is infinitely easier than recovery during crisis.</strong></p>
          <ul>
            <li><strong>Brain Plasticity:</strong> Your brain can still recover. Neuroplasticity means your brain can rebuild damaged pathways—but this takes time and sobriety</li>
            <li><strong>Before Total Loss:</strong> Stop while you still have your relationships, your job, your health, your self-respect</li>
            <li><strong>Prevent Overdose:</strong> Every continued use increases overdose risk. Recovery eliminates this risk</li>
            <li><strong>Restore Authenticity:</strong> You can rebuild genuine connections based on who you actually are</li>
            <li><strong>Reverse Damage:</strong> The earlier you stop, the more damage reverses</li>
            <li><strong>Protect Others:</strong> Your recovery protects those who love you from the pain of watching you destroy yourself</li>
          </ul>
        </SectionBox>

        <SectionBox id="final" icon="💪" title="You Can't Stay Here">
          <p><strong>The functioning user phase is temporary.</strong> You're either getting better or getting worse. You can't stay in the middle.</p>
          <p>The good news? <strong>If you're still functioning, recovery is still possible.</strong> Your relationships haven't all dissolved. Your brain can still heal. Your body can still recover. Your life hasn't been completely destroyed.</p>
          <p><strong>Stop now. Get help. Choose recovery. Use Back on Track to track your journey back to yourself.</strong></p>
          <p style={{ marginTop: '15px', fontSize: '16px' }}>Recovery is possible. You can do this. 💪</p>
        </SectionBox>
      </div>
    </div>
  );
};

export default FunctioningUser;
