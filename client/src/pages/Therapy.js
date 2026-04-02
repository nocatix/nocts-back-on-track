import React, { useState } from 'react';
import './Therapy.css';

const Therapy = () => {
  const [expandedSections, setExpandedSections] = useState({
    0: true,
    1: true,
    2: true,
    3: false,
    4: false,
  });

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const SectionBox = ({ index, icon, title, children }) => (
    <div className={`therapy-section ${expandedSections[index] ? 'expanded' : 'collapsed'}`}>
      <div className="therapy-section-header" onClick={() => toggleSection(index)}>
        <div className="section-title">
          <span className="section-icon">{icon}</span>
          <h2>{title}</h2>
        </div>
        <span className="toggle-arrow">▶</span>
      </div>
      <div className="section-content">{children}</div>
    </div>
  );

  return (
    <div className="therapy-container">
      <div className="therapy-header">
        <h1>💊 Therapy & Medication in Recovery</h1>
        <p>Understanding the powerful combination of professional support and treatment options</p>
      </div>

      <div className="therapy-sections">
        {/* Section 1: Why Therapy Matters */}
        <SectionBox
          index={0}
          icon="🧑‍⚕️"
          title="Why Therapy is Essential in Healing"
        >
          <p>
            Therapy is one of the most powerful tools in your recovery journey. A trained therapist provides more than just a sympathetic ear—they offer evidence-based techniques, professional guidance, and a structured environment where you can safely explore your addiction.
          </p>

          <div className="therapy-benefits">
            <div className="benefit-card">
              <h4>🔍 Understanding Root Causes</h4>
              <p>
                Therapists help you identify the underlying emotional, behavioral, and situational patterns that drive your addiction. By understanding the "why," you can address real issues instead of just managing symptoms.
              </p>
            </div>

            <div className="benefit-card">
              <h4>🛡️ Developing Coping Strategies</h4>
              <p>
                You'll learn practical, evidence-based techniques to manage cravings, stress, and triggers. Therapists teach skills like cognitive restructuring, mindfulness, and emotional regulation that you'll use for life.
              </p>
            </div>

            <div className="benefit-card">
              <h4>💪 Accountability & Support</h4>
              <p>
                Regular therapy sessions create accountability. Your therapist tracks your progress, celebrates wins, and helps you stay committed to recovery when motivation wavers.
              </p>
            </div>

            <div className="benefit-card">
              <h4>🧠 Mental Health Treatment</h4>
              <p>
                Many addictions are connected to depression, anxiety, trauma, or other conditions. Therapy addresses these co-occurring issues, which are essential for lasting recovery.
              </p>
            </div>

            <div className="benefit-card">
              <h4>👥 Relationship Healing</h4>
              <p>
                Addiction damages relationships. Therapists help repair trust with loved ones, improve communication, and rebuild the social connections that support your recovery.
              </p>
            </div>

            <div className="benefit-card">
              <h4>🎯 Relapse Prevention</h4>
              <p>
                Through therapy, you create a concrete relapse prevention plan. Your therapist helps you recognize warning signs and develop strategies before situations become dangerous.
              </p>
            </div>
          </div>

          <div className="highlight-box">
            <strong>The Science:</strong> Research shows that therapy combined with other treatments produces the best outcomes. People who engage in regular therapy have significantly higher recovery success rates than those managing addiction alone.
          </div>
        </SectionBox>

        {/* Section 2: How Your Therapist Guides You */}
        <SectionBox
          index={1}
          icon="🗣️"
          title="How Your Therapist Guides Your Recovery"
        >
          <p>
            A good therapist is a collaborator in your recovery. Here's what you can expect and how they'll support you:
          </p>

          <div className="step-section">
            <div className="step-item">
              <span className="step-number">1</span>
              <h4>Assessment & Planning</h4>
              <p>
                Your therapist starts by understanding your complete picture: your addiction history, triggers, mental health, and goals. Together, you develop a personalized treatment plan.
              </p>
            </div>

            <div className="step-item">
              <span className="step-number">2</span>
              <h4>Evidence-Based Interventions</h4>
              <p>
                They use proven therapies like Cognitive Behavioral Therapy (CBT), Motivational Interviewing, or Dialectical Behavior Therapy (DBT). These aren't just talking—they're structured, goal-oriented approaches.
              </p>
            </div>

            <div className="step-item">
              <span className="step-number">3</span>
              <h4>Identifying Triggers & Patterns</h4>
              <p>
                Through exploration, your therapist helps you see patterns you might miss: emotional triggers, situations, times of day, or thoughts that lead to use. Awareness is the first step to change.
              </p>
            </div>

            <div className="step-item">
              <span className="step-number">4</span>
              <h4>Building New Skills</h4>
              <p>
                You'll practice new coping mechanisms in session and then apply them in real life. Your therapist coaches you on managing stress, communicating effectively, and handling cravings.
              </p>
            </div>

            <div className="step-item">
              <span className="step-number">5</span>
              <h4>Monitoring Progress</h4>
              <p>
                Your therapist tracks your progress regularly, adjusting the approach if needed. This ensures your treatment stays effective and addresses emerging challenges.
              </p>
            </div>

            <div className="step-item">
              <span className="step-number">6</span>
              <h4>Relapse Prevention</h4>
              <p>
                As you progress, therapy shifts to preventing relapse. You'll develop concrete strategies for high-risk situations and learn how to respond quickly if you slip.
              </p>
            </div>
          </div>

          <div className="highlight-box">
            <strong>What to Look For:</strong> A good therapeutic relationship is built on trust, respect, and collaboration. You should feel heard, not judged. If you don't feel comfortable with your therapist after a few sessions, it's okay to find someone else.
          </div>
        </SectionBox>

        {/* Section 3: Medication & Therapy Partnership */}
        <SectionBox
          index={2}
          icon="💉"
          title="Why Medication Complements Therapy"
        >
          <p>
            Many people misunderstand medication in recovery. Medication isn't "cheating" or avoiding the real work—it's a powerful tool that often makes therapy more effective. Here's why:
          </p>

          <div className="therapy-benefits">
            <div className="benefit-card">
              <h4>🧠 Treating Chemical Imbalances</h4>
              <p>
                Addiction often involves changes in brain chemistry. Medications can correct imbalances in dopamine, serotonin, and other neurotransmitters, reducing cravings and making it easier to engage in therapy.
              </p>
            </div>

            <div className="benefit-card">
              <h4>😌 Managing Co-Occurring Conditions</h4>
              <p>
                Depression, anxiety, PTSD, and ADHD often accompany addiction. Treating these conditions with medication removes barriers to recovery and gives you the mental clarity to benefit from therapy.
              </p>
            </div>

            <div className="benefit-card">
              <h4>🛑 Reducing Cravings</h4>
              <p>
                Some medications specifically reduce cravings for alcohol, opioids, or other substances. This gives you breathing room to focus on therapy and life rebuilding instead of fighting constant urges.
              </p>
            </div>

            <div className="benefit-card">
              <h4>🔄 Preventing Relapse</h4>
              <p>
                Medication can be crucial in early recovery. It provides stability while you're learning new coping skills, increasing your chances of staying abstinent long-term.
              </p>
            </div>

            <div className="benefit-card">
              <h4>🤝 Supporting Therapy Work</h4>
              <p>
                When you're not in constant crisis or battling overwhelming urges, you can actually absorb and practice what you learn in therapy. Medication removes blocks to progress.
              </p>
            </div>

            <div className="benefit-card">
              <h4>📊 Evidence-Based Approach</h4>
              <p>
                Research consistently shows that combining therapy with medication produces better outcomes than either alone. This isn't optional for many people—it's optimal care.
              </p>
            </div>
          </div>

          <div className="highlight-box">
            <strong>Common Medications in Recovery:</strong> Depending on your specifics:
            <ul>
              <li><strong>For Alcohol:</strong> Naltrexone, Acamprosate, Disulfiram</li>
              <li><strong>For Opioids:</strong> Buprenorphine, Methadone, Naltrexone</li>
              <li><strong>For Co-Occurring Issues:</strong> SSRIs for depression/anxiety, Buspar for anxiety, Mood stabilizers for bipolar disorder</li>
            </ul>
            Your physician will recommend what fits your situation.
          </div>
        </SectionBox>

        {/* Section 4: Your General Physician as Part of Your Team */}
        <SectionBox
          index={3}
          icon="👨‍⚕️"
          title="How Your General Physician Supports Recovery"
        >
          <p>
            You don't need a psychiatrist to manage medication during recovery. Your general physician (GP) can be an effective part of your treatment team, especially during therapy.
          </p>

          <div className="physician-roles">
            <div className="role-card">
              <h4>📋 Medical Assessment</h4>
              <p>
                Your GP can evaluate your physical and mental health, understand your addiction history, and determine if medication is appropriate. They understand your full medical picture.
              </p>
            </div>

            <div className="role-card">
              <h4>💊 Prescribing & Monitoring</h4>
              <p>
                Many GPs prescribe recovery medications and monitor their effectiveness. Regular check-ins ensure the medication is helping and adjust dosages if needed.
              </p>
            </div>

            <div className="role-card">
              <h4>🔗 Team Communication</h4>
              <p>
                With your permission, your GP can communicate with your therapist. This coordination ensures everyone is working toward the same goals and avoids conflicts.
              </p>
            </div>

            <div className="role-card">
              <h4>🎯 Treating Co-Occurring Issues</h4>
              <p>
                Your GP can address depression, anxiety, sleep problems, or other issues that complicate recovery. Treating these removes obstacles to your therapy work.
              </p>
            </div>

            <div className="role-card">
              <h4>📞 Ongoing Support</h4>
              <p>
                Regular appointments with your GP provide accountability and continuity of care. They track your progress over months and years, not just sessions.
              </p>
            </div>

            <div className="role-card">
              <h4>🚨 Crisis Response</h4>
              <p>
                If you're struggling or having thoughts of relapse, your GP can provide immediate intervention, adjusted medication, or referrals to specialty care if needed.
              </p>
            </div>
          </div>

          <div className="highlight-box">
            <strong>When to See a Specialist:</strong> If medication management becomes complex (multiple conditions, severe side effects, medication interactions), you might benefit from seeing a psychiatrist. But many people recover beautifully with their GP managing medication and a therapist handling the psychological work.
          </div>

          <p style={{ marginTop: '1.5rem', fontStyle: 'italic' }}>
            <strong>Key Point:</strong> Your GP treating your mental health isn't a backup plan—it's a legitimate, evidence-supported approach. The combination of your GP's medication management + your therapist's guidance creates a powerful recovery team.
          </p>
        </SectionBox>

        {/* Section 5: Getting Started */}
        <SectionBox
          index={4}
          icon="🚀"
          title="Getting Started: Finding Therapy & Medical Support"
        >
          <p>
            Ready to engage therapy and medical support in your recovery? Here's a practical starting point:
          </p>

          <div className="getting-started-steps">
            <div className="step-item">
              <span className="step-number">1</span>
              <h4>Schedule with Your General Physician</h4>
              <p>
                Tell your doctor about your addiction and your interest in therapy. Ask about medication options. Be honest about your full substance use history.
              </p>
            </div>

            <div className="step-item">
              <span className="step-number">2</span>
              <h4>Explore Therapy Options</h4>
              <p>
                Ask your GP for referrals to therapists. You can also search Psychology Today or SAMHSA's National Helpline (1-800-662-4357) for providers. Consider specialties: addiction counselors, CBT therapists, psychologists.
              </p>
            </div>

            <div className="step-item">
              <span className="step-number">3</span>
              <h4>Evaluate Fit</h4>
              <p>
                Many therapists offer a free consultation call. Use this to gauge if you connect. You want someone experienced with addiction and someone you feel comfortable being honest with.
              </p>
            </div>

            <div className="step-item">
              <span className="step-number">4</span>
              <h4>Start Medication (If Recommended)</h4>
              <p>
                If your GP suggests medication, start it with a clear understanding of what to expect: timeline for effectiveness, potential side effects, and follow-up appointments.
              </p>
            </div>

            <div className="step-item">
              <span className="step-number">5</span>
              <h4>Commit to Regular Sessions</h4>
              <p>
                Most therapy is weekly initially. Build it into your schedule like any other important appointment. Consistency matters—healing happens over time through repeated work.
              </p>
            </div>

            <div className="step-item">
              <span className="step-number">6</span>
              <h4>Give It Time</h4>
              <p>
                Recovery isn't overnight. Plan to engage therapy for at least 3-6 months minimum. Many people benefit from longer-term support. Medication effects often take 2-4 weeks, so be patient.
              </p>
            </div>
          </div>

          <div className="highlight-box">
            <strong>Resources:</strong>
            <ul>
              <li><strong>SAMHSA National Helpline:</strong> 1-800-662-4357 (free, confidential, 24/7)</li>
              <li><strong>Psychology Today Therapist Finder:</strong> psychologytoday.com</li>
              <li><strong>NAMI Helpline:</strong> 1-800-950-6264 (mental health support)</li>
              <li><strong>SMART Recovery:</strong> Smart way to participate in mutual support</li>
            </ul>
          </div>

          <div className="closing-section">
            <h3>You Don't Have to Do This Alone</h3>
            <p>
              Seeking therapy and working with your physician aren't signs of weakness—they're signs of wisdom. The most successful people in recovery have professional support. Invest in yourself. Your future self will thank you.
            </p>
          </div>
        </SectionBox>
      </div>
    </div>
  );
};

export default Therapy;
