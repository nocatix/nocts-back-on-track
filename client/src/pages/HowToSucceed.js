import React from 'react';
import './HowToSucceed.css';

const HowToSucceed = () => {
  return (
    <div className="how-to-succeed-container">
      <header className="how-to-succeed-header">
        <h1>How to Succeed in Recovery</h1>
        <p>Essential principles for lasting change</p>
      </header>

      <div className="how-to-succeed-sections">
        {/* Honesty with Yourself */}
        <section className="how-to-succeed-section featured">
          <div className="section-icon">🎯</div>
          <h2>Be Honest With Yourself</h2>
          <div className="section-content">
            <p>
              <strong>Honesty is the foundation of all lasting recovery.</strong> You cannot change what you will not acknowledge. Every moment you choose truth over denial, you strengthen your path to freedom.
            </p>
            <ul>
              <li><strong>Admit Your Reality:</strong> Acknowledge your addiction without judgment. You are not weak or broken—you're human, and you're taking action</li>
              <li><strong>Track Truthfully:</strong> Use this app to log your real moods, cravings, and triggers. The data is only useful if it reflects reality</li>
              <li><strong>Recognize Patterns:</strong> Don't rationalize your behavior. Notice when you're about to rationalize using and pause to examine that moment</li>
              <li><strong>Face Your Triggers:</strong> Honesty means identifying what really makes you want to use—whether it's people, places, emotions, or situations</li>
              <li><strong>Forgive Yourself:</strong> If you slip, be honest about it. Don't hide it or pretend it didn't happen. This is how you learn and grow</li>
              <li><strong>Accept Your Feelings:</strong> You don't have to act on every urge or emotion. Honesty means acknowledging them without judgment, then choosing something different</li>
              <li><strong>Stop the Lies:</strong> Stop lying to yourself about "just one more time" or "I can handle it." These stories destroy recovery. Truth sets you free</li>
            </ul>
            <p className="key-insight">💡 Recovery thrives in the light of truth. Every honest moment is a victory.</p>
          </div>
        </section>

        {/* Self-Kindness */}
        <section className="how-to-succeed-section featured">
          <div className="section-icon">💝</div>
          <h2>Be Kind to Yourself</h2>
          <div className="section-content">
            <p>
              <strong>Self-kindness is not weakness—it's the fuel that keeps you going.</strong> Recovery requires treating yourself with the same compassion you'd offer a friend in crisis. Shame and self-criticism drive relapse; self-kindness drives transformation.
            </p>
            <ul>
              <li><strong>Replace Shame with Compassion:</strong> When you make a mistake, respond with understanding rather than harsh judgment. You deserve kindness at your most vulnerable moments</li>
              <li><strong>Celebrate Small Wins:</strong> Every day sober, every craving resisted, every honest conversation—these deserve celebration. Your wins don't have to be huge to matter</li>
              <li><strong>Practice Self-Care:</strong> Sleep, movement, nutrition, and time in nature aren't luxuries—they're recovery essentials. Prioritize your wellbeing</li>
              <li><strong>Forgive Your Past:</strong> You made choices you may regret. That doesn't define your future. Kindness means releasing the weight of the past</li>
              <li><strong>Speak to Yourself Gently:</strong> Notice your internal dialogue. Would you speak to a loved one the way you speak to yourself? If not, change it</li>
              <li><strong>Set Healthy Boundaries:</strong> Being kind to yourself means saying no to people, places, and situations that threaten your recovery</li>
              <li><strong>Respect Your Process:</strong> Recovery is not linear. Some days will be harder than others. That's normal. You're doing better than you think</li>
              <li><strong>Seek Support Without Shame:</strong> Asking for help is an act of self-kindness and strength, not weakness</li>
            </ul>
            <p className="key-insight">💡 The voice you speak to yourself with matters. Make it a voice of encouragement and love.</p>
          </div>
        </section>

        {/* Additional Success Strategies */}
        <section className="how-to-succeed-section">
          <div className="section-icon">🚀</div>
          <h2>Build Your Support System</h2>
          <div className="section-content">
            <p>
              Recovery is not a solo journey. Connection, accountability, and support are critical ingredients for lasting success.
            </p>
            <ul>
              <li><strong>Find Your People:</strong> Connect with others in recovery—whether through support groups, therapy, or trusted friends. You are not alone</li>
              <li><strong>Get Professional Help:</strong> Therapy, counseling, or medical support can provide tools and insights you can't find alone</li>
              <li><strong>Share Your Journey:</strong> Being vulnerable with safe people diminishes the power of secrecy and shame</li>
              <li><strong>Build Accountability:</strong> Tell someone what you're working toward. Healthy accountability creates positive pressure</li>
              <li><strong>Learn from Others:</strong> Stories of recovery from others inspire hope and show you what's possible</li>
            </ul>
          </div>
        </section>

        {/* Managing Cravings */}
        <section className="how-to-succeed-section">
          <div className="section-icon">🧠</div>
          <h2>Master Your Cravings</h2>
          <div className="section-content">
            <p>
              Cravings are normal. They are not a sign of weakness or failure. Learning to work with cravings—not against them—is a critical skill.
            </p>
            <ul>
              <li><strong>Understand the Craving Curve:</strong> Cravings rise, peak, and fall. If you can ride the wave for 15-20 minutes, it will pass</li>
              <li><strong>Don't Fight—Observe:</strong> Instead of suppressing cravings, notice them with curiosity. "Interesting, my body wants this. I don't have to act on it"</li>
              <li><strong>Have a Crisis Toolkit:</strong> Know exactly what you'll do when cravings hit—call someone, use the Craving Game, meditate, or move your body</li>
              <li><strong>Identify Your Patterns:</strong> Use this app to track when cravings happen. Are they related to specific emotions, people, or situations?</li>
              <li><strong>Address the Root:</strong> Cravings are often telling you something needs attention—you're stressed, lonely, tired, or bored. Address the underlying need</li>
              <li><strong>Change Your Environment:</strong> If possible, remove triggers from your immediate space. You can't say no to what isn't in front of you</li>
            </ul>
          </div>
        </section>

        {/* Emotional Wellness */}
        <section className="how-to-succeed-section">
          <div className="section-icon">🧘</div>
          <h2>Prioritize Emotional Wellness</h2>
          <div className="section-content">
            <p>
              Using was often a way to escape feelings. Recovery means learning to feel your emotions fully and respond with wisdom instead of avoidance.
            </p>
            <ul>
              <li><strong>Feel Your Feelings:</strong> Don't suppress or numb emotions. Feel them, journal about them, talk about them. They won't destroy you</li>
              <li><strong>Use Meditation and Mindfulness:</strong> These practices teach you to observe emotions without being controlled by them</li>
              <li><strong>Track Your Moods:</strong> Understanding your emotional patterns helps you predict and prepare for difficult times</li>
              <li><strong>Develop Coping Skills:</strong> When emotions are overwhelming, use healthy coping tools: movement, music, art, time in nature, or connection</li>
              <li><strong>Process Trauma:</strong> If addiction grew from trauma, healing requires addressing the root. Professional support here is invaluable</li>
              <li><strong>Celebrate Joy:</strong> Recovery isn't just about avoiding the dark—it's about moving toward the light. Notice and savor moments of joy and peace</li>
            </ul>
          </div>
        </section>

        {/* Physical Health */}
        <section className="how-to-succeed-section">
          <div className="section-icon">💪</div>
          <h2>Take Care of Your Body</h2>
          <div className="section-content">
            <p>
              Your body is your home. Addiction harms it; recovery heals it. These physical practices are not optional—they're essential recovery tools.
            </p>
            <ul>
              <li><strong>Sleep Matters:</strong> Prioritize 7-9 hours of quality sleep. Sleep deprivation is one of the strongest relapse triggers</li>
              <li><strong>Move Your Body:</strong> Exercise releases natural endorphins, reduces cravings, and improves mood. Find movement you enjoy</li>
              <li><strong>Eat Well:</strong> Nutrition supports brain healing and stabilizes mood. Feed your body foods that nourish, not just comfort</li>
              <li><strong>Stay Hydrated:</strong> Dehydration impacts mood and cravings. Simple water can make a real difference</li>
              <li><strong>Get Sunlight:</strong> Natural light regulates mood and circadian rhythms. Aim for 20-30 minutes daily</li>
              <li><strong>Manage Your Health:</strong> Regular check-ups help you understand how addiction has impacted your physical health and what needs healing</li>
              <li><strong>Track Your Progress:</strong> Use the weight and wellness tracking features to see how your body is transforming</li>
            </ul>
          </div>
        </section>

        {/* Purpose and Meaning */}
        <section className="how-to-succeed-section">
          <div className="section-icon">✨</div>
          <h2>Find Your Purpose</h2>
          <div className="section-content">
            <p>
              Recovery fills the void that addiction created. Finding meaning, purpose, and goals gives your recovery direction and power.
            </p>
            <ul>
              <li><strong>Reconnect with Values:</strong> What matters to you? Family, creativity, service, learning? Let your values guide your choices</li>
              <li><strong>Set Goals:</strong> Short-term daily wins and long-term life goals give you something to move toward beyond just away from addiction</li>
              <li><strong>Discover Your Gifts:</strong> What are you good at? What do you enjoy? Recovery is an opportunity to rediscover yourself</li>
              <li><strong>Contribute to Others:</strong> Helping others is one of the most powerful recovery practices. Your experience can give hope to someone else</li>
              <li><strong>Keep Learning:</strong> Growth and curiosity give life dimension and excitement beyond the narrow focus of addiction</li>
              <li><strong>Celebrate Milestones:</strong> Use the achievement system to mark important progress. These moments remind you of how far you've come</li>
            </ul>
          </div>
        </section>

        {/* Final Message */}
        <section className="how-to-succeed-section final-message">
          <div className="section-icon">❤️</div>
          <h2>You Are Worth It</h2>
          <div className="section-content">
            <p>
              Recovery is possible. People have walked this path before you and found freedom, joy, and peace on the other side. You can too.
            </p>
            <p>
              Your recovery will not be perfect. You will have hard days. You might need to ask for help. You might stumble. And through it all, what matters is that you keep choosing yourself, keep being honest, and keep treating yourself with kindness.
            </p>
            <p>
              Every moment you choose recovery over addiction is a victory. Every day you treat yourself with compassion is a day you're winning. Every time you ask for help, you're demonstrating strength.
            </p>
            <p>
              <strong>You deserve freedom. You deserve peace. You deserve a life beyond addiction. And recovery is how you get there.</strong>
            </p>
            <p className="encouragement">
              One day at a time. One choice at a time. One act of honesty and kindness at a time. That's how you succeed.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToSucceed;
