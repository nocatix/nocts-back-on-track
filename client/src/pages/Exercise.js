import React, { useState } from 'react';
import './Exercise.css';

const Exercise = () => {
  const [expandedSections, setExpandedSections] = useState({
    why: true,
    physical: true,
    mental: true,
    getting: false,
    tips: false,
    types: false,
    barriers: false
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
      <section className={`exercise-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="exercise-section-header" onClick={() => toggleSection(id)}>
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
    <div className="exercise-container">
      <header className="exercise-header">
        <h1>💪 The Power of Exercise in Recovery</h1>
        <p>Move your body, transform your mind, rebuild your life</p>
      </header>

      <div className="exercise-sections">
        <SectionBox id="why" icon="🎯" title="Why Exercise Matters for Recovery">
          <p>
            Exercise is one of the most powerful tools for addiction recovery. It's not just about physical fitness—it's about rewiring your brain, rebuilding confidence, and creating a sustainable foundation for lasting change.
          </p>
          <p>
            When you're in recovery, your brain needs new ways to create dopamine and feel good. For years, your addiction provided that chemical reward. Exercise naturally triggers the same reward pathways in your brain, but in a healthy way.
          </p>
          <div className="highlight-box">
            <h4>The Science:</h4>
            <p>
              Research shows that regular exercise is <strong>as effective as medication for depression and anxiety</strong> in many cases. It normalizes dopamine levels, reduces cravings, and strengthens the prefrontal cortex—the part of your brain responsible for decision-making and impulse control.
            </p>
          </div>
        </SectionBox>

        <SectionBox id="physical" icon="🏃" title="Physical Benefits of Exercise">
          <p>Beyond mental health, exercise transforms your body and overall wellbeing:</p>
          <ul>
            <li><strong>Restores Physical Health</strong> - Addiction damages your body. Exercise reverses that damage, strengthening your cardiovascular system, improving sleep quality, and boosting immunity</li>
            <li><strong>Increases Energy Levels</strong> - Regular exercise paradoxically makes you feel MORE energized, not exhausted. Better sleep and improved circulation mean you wake up ready to tackle the day</li>
            <li><strong>Improves Sleep</strong> - One of the biggest struggles in early recovery is poor sleep. Exercise regulates your circadian rhythm and deepens sleep quality</li>
            <li><strong>Reduces Chronic Pain</strong> - Many people use substances to self-medicate pain. Exercise releases endorphins that naturally manage pain without drugs</li>
            <li><strong>Normalizes Appetite</strong> - Addiction disrupts hunger cues. Regular exercise helps regulate appetite and body weight</li>
            <li><strong>Builds Physical Strength</strong> - You literally become stronger. This builds confidence and a sense of mastery over your body</li>
            <li><strong>Improves Brain Health</strong> - Exercise increases brain-derived neurotrophic factor (BDNF), essentially fertilizing your brain and promoting new neural growth</li>
          </ul>
        </SectionBox>

        <SectionBox id="mental" icon="🧠" title="Mental & Emotional Benefits">
          <p>The psychological gains from exercise are often more powerful than the physical:</p>
          <ul>
            <li><strong>Natural Dopamine Release</strong> - Exercise triggers endorphins and dopamine release. You get HIGH naturally. This rewards sobriety and trains your brain to seek healthy activities</li>
            <li><strong>Reduces Anxiety & Depression</strong> - Exercise is proven to be as effective as antidepressants for mild to moderate depression. It calms the nervous system and improves mood</li>
            <li><strong>Manages Cravings</strong> - When a craving strikes, 20 minutes of exercise can completely shift your neurochemistry and take the edge off urges</li>
            <li><strong>Builds Confidence</strong> - Setting a fitness goal and achieving it = confidence. Each workout is proof that you can commit and follow through</li>
            <li><strong>Provides Structure</strong> - Recovery needs routine. Exercise gives you a non-negotiable anchor point in your day</li>
            <li><strong>Creates Mindfulness Naturally</strong> - During exercise, your mind quiets. You're present with your body and breath—this is meditation in motion</li>
            <li><strong>Improves Self-Image</strong> - Addiction damages self-worth. Exercise rebuilds your relationship with your body and how you see yourself</li>
            <li><strong>Processes Difficult Emotions</strong> - Movement is a way to process emotions that might otherwise trigger relapse. You literally RUN through your feelings</li>
          </ul>

          <div className="highlight-box">
            <h4>Key Insight:</h4>
            <p>
              Your brain doesn't distinguish between a "natural high" from exercise and the high from substances—it just knows it feels good. By exercising regularly, you're retraining your reward system to value healthy behaviors.
            </p>
          </div>
        </SectionBox>

        <SectionBox id="getting" icon="🚀" title="How to Get Started with Exercise">
          <p>
            You don't need to go from zero to marathon runner. Starting small and building gradually is how you create lasting change.
          </p>

          <div className="step-section">
            <div className="step-item">
              <div className="step-number">1</div>
              <h4>Start Absurdly Small</h4>
              <p>
                If you haven't exercised in years, your goal is NOT to get fit. Your goal is to build the HABIT. 
                <br/><br/>
                <strong>Start with 10 minutes.</strong> Just 10. A short walk. Some stretching. Dancing to your favorite song. The point is consistency, not intensity. You can always do more, but starting big guarantees you'll quit.
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <h4>Choose Something You Actually Enjoy</h4>
              <p>
                If you hate running, don't run. If you hate the gym, don't go to the gym. Exercise is only sustainable if you enjoy it.
                <br/><br/>
                <strong>Options:</strong> Walking, dancing, swimming, yoga, cycling, hiking, basketball, tennis, gardening, rock climbing, martial arts, boxing, dancing, skateboarding. The best exercise is the one you'll actually do.
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <h4>Create a Trigger/Habit Loop</h4>
              <p>
                Attach exercise to an existing habit. After your morning coffee, you go for a walk. After work, you do 15 minutes of yoga. After dinner, you take a bike ride.
                <br/><br/>
                <strong>Habit Stack:</strong> "[EXISTING HABIT] + THEN I [NEW EXERCISE HABIT]"
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <h4>Make it Social (Optional but Powerful)</h4>
              <p>
                Accountability is huge. Find a friend, join a class, or use an app that connects you to others. Having someone waiting for you makes you show up even on days you don't feel like it.
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">5</div>
              <h4>Track Your Progress</h4>
              <p>
                Keep a simple log of when you exercise. Just checking it off builds motivation. After 2 weeks, you'll have visible proof of commitment. After 8 weeks, it becomes hardwired as habit.
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">6</div>
              <h4>Slowly Increase Duration</h4>
              <p>
                After 1-2 weeks of 10 minutes, try 15. After another week, try 20-30. The progression should feel easy, not forced. You're building on success, not forcing yourself.
              </p>
            </div>
          </div>
        </SectionBox>

        <SectionBox id="tips" icon="💡" title="Tips for Building a Lasting Exercise Habit">
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">📅</div>
              <h4>Schedule It</h4>
              <p>Treat exercise like a non-negotiable appointment. Put it in your calendar. This removes the decision-making and makes it automatic.</p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">⏰</div>
              <h4>Best Time is Morning</h4>
              <p>Exercising early means nothing can derail you. Morning workouts set a positive tone for the whole day and prevent the "I'll do it later" trap.</p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">🎵</div>
              <h4>Use Music</h4>
              <p>Great music makes exercise FUN. Create a playlist of songs that energize you. You're not just exercising—you're having an experience.</p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">👥</div>
              <h4>Find Your People</h4>
              <p>Join a class, find a workout buddy, or go to the gym at a consistent time. Community and accountability are powerful motivators.</p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">🎁</div>
              <h4>Reward Yourself</h4>
              <p>After 1 week, treat yourself (non-food reward). After 4 weeks, do something bigger. Celebrating consistency reinforces the behavior.</p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">😤</div>
              <h4>Embrace the Struggle</h4>
              <p>That burning feeling, that breathlessness? That's your body getting stronger. That discomfort = growth. The pain is temporary; the strength is permanent.</p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">💪</div>
              <h4>You Don't Need Equipment</h4>
              <p>Bodyweight exercises are FREE and effective: push-ups, squats, running, yoga. You need zero equipment to completely transform your fitness. YouTube has thousands of free workouts.</p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">⚖️</div>
              <h4>It's Not About Looking Good</h4>
              <p>Yes, you'll look better with time, but that's a side effect. Exercise is about how you FEEL. More energy. Better sleep. Clearer mind. Emotional stability. Health is the real goal.</p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">📊</div>
              <h4>Track How You Feel</h4>
              <p>More important than tracking calories burned: How's your mood? Your energy? Your sleep? Your cravings? These are the metrics of real change.</p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">❌</div>
              <h4>One Missed Day Isn't Failure</h4>
              <p>You WILL miss workouts. Life happens. The key: get back to it the next day. Don't turn one missed day into a week of inactivity. Recovery and fitness are about resilience, not perfection.</p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">🧘</div>
              <h4>Listen to Your Body</h4>
              <p>There's a difference between "I don't feel like it" and "my body needs rest." Learn the difference. Some days you push harder; some days you do gentle movement. Both matter.</p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">🔄</div>
              <h4>Variety Prevents Boredom</h4>
              <p>Mix it up: some days walk, some days strength train, some days yoga, some days dance. Variety keeps it fresh and works different parts of your body and mind.</p>
            </div>
          </div>
        </SectionBox>

        <SectionBox id="types" icon="🤸" title="Types of Exercise to Consider">
          <p>
            Different types of exercise offer different benefits. A balanced approach combines several types:
          </p>

          <div className="exercise-types">
            <div className="type-card">
              <h4>🚶 Cardio (Walking, Running, Cycling, Swimming)</h4>
              <p><strong>Benefits:</strong> Cardiovascular health, mood boost, stress relief, burns calories, improves endurance</p>
              <p><strong>How to start:</strong> 20-30 minute walks are perfect. No equipment needed. You can do this anytime, anywhere.</p>
            </div>

            <div className="type-card">
              <h4>💪 Strength Training (Weights, Bodyweight)</h4>
              <p><strong>Benefits:</strong> Builds muscle, increases metabolism, improves confidence, functional strength for daily life</p>
              <p><strong>How to start:</strong> Bodyweight exercises (push-ups, squats) at home. Or join a gym. Sessions can be 20-30 minutes, 3x per week.</p>
            </div>

            <div className="type-card">
              <h4>🧘 Yoga & Stretching</h4>
              <p><strong>Benefits:</strong> Flexibility, mindfulness, gentle strength, stress relief, better sleep, body awareness</p>
              <p><strong>How to start:</strong> YouTube has free classes. Start with beginner videos (15-20 minutes). Can do daily, even as a wind-down before bed.</p>
            </div>

            <div className="type-card">
              <h4>🕺 Dance</h4>
              <p><strong>Benefits:</strong> FUN, cardiovascular fitness, coordination, creative expression, mood boost, stress relief</p>
              <p><strong>How to start:</strong> Play your favorite music and dance for 15 minutes. Sounds silly? It works. And it's genuinely enjoyable.</p>
            </div>

            <div className="type-card">
              <h4>⛹️ Sports & Group Activities (Basketball, Tennis, Soccer)</h4>
              <p><strong>Benefits:</strong> Social connection, competitive motivation, full-body workout, FUN, accountability through teammates</p>
              <p><strong>How to start:</strong> Join a league or casual pickup game. Even beginner-friendly groups exist.</p>
            </div>

            <div className="type-card">
              <h4>🧗 Outdoor Activities (Hiking, Rock Climbing, Trail Running)</h4>
              <p><strong>Benefits:</strong> Connection to nature, mental clarity, adventure, full-body workout, stress relief</p>
              <p><strong>How to start:</strong> Start with easy trails. Local parks often have beginner hikes. Outdoor exercise has unique mental health benefits.</p>
            </div>
          </div>

          <p className="recommendation">
            <strong>Sweet Spot:</strong> Combine 3-4 days of cardio/movement (walking, running, dancing) + 2 days of strength training + daily stretching/mobility work. This covers all aspects of fitness and keeps it interesting.
          </p>
        </SectionBox>

        <SectionBox id="barriers" icon="🚧" title="Overcoming Barriers to Exercise">
          <p>
            Most people don't fail at exercise because of laziness. They fail because they hit predictable barriers. Here's how to overcome them:
          </p>

          <div className="barrier-section">
            <div className="barrier-item">
              <h4>❌ "I Don't Have Time"</h4>
              <p>
                <strong>Reality:</strong> You make time for what matters. 10-20 minutes a day is only ~2% of your day.
                <br/>
                <strong>Solution:</strong> Start small and attach it to existing habits. Before coffee → 10-minute walk. Lunch break → 15-minute walk. Evening → 10-minute yoga. It adds up.
              </p>
            </div>

            <div className="barrier-item">
              <h4>❌ "I'm Too Out of Shape"</h4>
              <p>
                <strong>Reality:</strong> Everyone starts somewhere. Couch-to-fit people all began exactly where you are.
                <br/>
                <strong>Solution:</strong> Focus on progress, not perfection. If you can walk for 5 minutes today, walk for 6 tomorrow. That's winning.
              </p>
            </div>

            <div className="barrier-item">
              <h4>❌ "It's Boring"</h4>
              <p>
                <strong>Reality:</strong> You chose a boring activity.
                <br/>
                <strong>Solution:</strong> Switch it up. Dance instead of running. Hike instead of the gym. Sports instead of solo workouts. Exercise should be FUN.
              </p>
            </div>

            <div className="barrier-item">
              <h4>❌ "I Don't See Results"</h4>
              <p>
                <strong>Reality:</strong> You're looking at the wrong metrics. Body changes take weeks; mood changes take days.
                <br/>
                <strong>Solution:</strong> Track how you FEEL. Sleep quality. Energy levels. Mood. Cravings. These shift in days to weeks, not months.
              </p>
            </div>

            <div className="barrier-item">
              <h4>❌ "I Keep Giving Up"</h4>
              <p>
                <strong>Reality:</strong> You're probably going too hard too fast.
                <br/>
                <strong>Solution:</strong> Start with ridiculously small goals. 10 minutes. That's it. Build from there. Consistency beats intensity every single time.
              </p>
            </div>

            <div className="barrier-item">
              <h4>❌ "Exercise Feels Painful"</h4>
              <p>
                <strong>Reality:</strong> Addiction has disconnected you from your body.
                <br/>
                <strong>Solution:</strong> Start with gentle movement (walking, yoga, swimming). Reconnect with your body gently. As you heal, you'll be able to push harder.
              </p>
            </div>

            <div className="barrier-item">
              <h4>❌ "I Feel Self-Conscious"</h4>
              <p>
                <strong>Reality:</strong> Most people in gyms are focused on their own workout, not judging you.
                <br/>
                <strong>Solution:</strong> Start at home if the gym feels scary. Walk outside. YouTube workout videos in your living room. Build confidence before going to a gym.
              </p>
            </div>
          </div>
        </SectionBox>

        <div className="closing-section">
          <h3>🎯 Your Exercise Commitment for Recovery</h3>
          <p>
            Exercise isn't optional in recovery. It's a TOOL as important as therapy or support groups. It's medication without side effects. It's free (or cheap). It's accessible. And it works.
          </p>
          <p>
            You didn't use substances for the cravings—you used them because of how they made you feel. Exercise gives you that feeling naturally. You're not giving up a reward; you're trading it for a better one.
          </p>
          <p className="commitment-text">
            <strong>Start today.</strong> Not tomorrow. Today. 10 minutes. Walk around your neighborhood. Dance in your living room. Do some stretches. Do SOMETHING.
          </p>
          <p className="commitment-text">
            Then do it again tomorrow. And the day after. Eight weeks from now, you won't recognize yourself—physically, mentally, or emotionally. That's the power of consistency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
