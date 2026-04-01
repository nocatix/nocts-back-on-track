import React, { useState } from 'react';
import './Crisis.css';

const Crisis = () => {
  const [expandedRegion, setExpandedRegion] = useState('global');

  const hotlines = {
    global: {
      title: 'Global Resources',
      resources: [
        {
          name: 'International Association for Suicide Prevention',
          description: 'Worldwide directory of crisis services',
          link: 'https://www.iasp.info/resources/Crisis_Centres/',
          type: 'Directory'
        },
        {
          name: 'Befrienders International',
          description: 'Network of crisis support services across 30+ countries',
          link: 'https://www.befrienders.org/',
          type: 'Helpline Network'
        }
      ],
      hotlines: []
    },
    usa: {
      title: 'United States',
      resources: [
        {
          name: 'Crisis Text Line',
          description: 'Text HOME to 741741',
          type: 'Text Support'
        }
      ],
      hotlines: [
        {
          name: 'National Suicide Prevention Lifeline',
          numbers: ['988', '1-800-273-8255'],
          available: '24/7',
          description: 'Free, confidential support'
        },
        {
          name: 'SAMHSA National Helpline',
          numbers: ['1-800-662-4357'],
          available: '24/7',
          description: 'Substance abuse & mental health services'
        },
        {
          name: 'National Crisis Hotline',
          numbers: ['1-800-784-2433'],
          available: '24/7',
          description: 'Crisis counseling'
        },
        {
          name: 'Veterans Crisis Line',
          numbers: ['988 then press 1', '1-800-273-8255 ext. 1'],
          available: '24/7',
          description: 'For military veterans'
        }
      ]
    },
    canada: {
      title: 'Canada',
      resources: [
        {
          name: 'Canada Suicide Prevention Service',
          description: 'Text TALK to 741741',
          type: 'Text Support'
        }
      ],
      hotlines: [
        {
          name: 'National Suicide Prevention Service',
          numbers: ['1-833-456-4566'],
          available: '24/7',
          description: 'Free, confidential support'
        },
        {
          name: 'Distress Centre Toronto',
          numbers: ['416-408-4357', '1-888-408-4357'],
          available: '24/7',
          description: 'Crisis support and suicide prevention'
        }
      ]
    },
    uk: {
      title: 'United Kingdom',
      resources: [],
      hotlines: [
        {
          name: 'National Suicide Prevention Helpline',
          numbers: ['116 123'],
          available: '24/7',
          description: 'Samaritans - free, confidential support'
        },
        {
          name: 'Crisis Text Line UK',
          description: 'Text SHOUT to 85258',
          type: 'Text Support'
        },
        {
          name: 'Rethink Mental Illness',
          numbers: ['0300 5000 927'],
          available: 'Business hours',
          description: 'Mental health crisis support'
        }
      ]
    },
    ie: {
      title: 'Ireland',
      resources: [],
      hotlines: [
        {
          name: 'Samaritans Ireland',
          numbers: ['116 123', '0818 22 7247'],
          available: '24/7',
          description: 'Free, confidential support'
        },
        {
          name: 'Pieta House',
          numbers: ['1800 247 247', '01 2101 247'],
          available: '24/7',
          description: 'Suicide & self-harm crisis support'
        }
      ]
    },
    australia: {
      title: 'Australia',
      resources: [
        {
          name: 'Lifeline Crisis Text',
          description: 'Text 0477 13 11 14',
          type: 'Text Support'
        }
      ],
      hotlines: [
        {
          name: 'Lifeline',
          numbers: ['13 11 14'],
          available: '24/7',
          description: 'Crisis support & suicide prevention'
        },
        {
          name: 'Beyond Blue',
          numbers: ['1300 224 636'],
          available: '24/7',
          description: 'Mental health & psychological support'
        },
        {
          name: 'Headspace',
          numbers: ['1800 650 890'],
          available: '24/7',
          description: 'Youth mental health support'
        }
      ]
    },
    nz: {
      title: 'New Zealand',
      resources: [],
      hotlines: [
        {
          name: '1737 Need to Talk?',
          numbers: ['1737', '0800 273 8255'],
          available: '24/7',
          description: 'Call or text for free support'
        },
        {
          name: 'Samaritans NZ',
          numbers: ['0800 726 666'],
          available: '24/7',
          description: 'Trained volunteers'
        }
      ]
    },
    europe: {
      title: 'Europe',
      resources: [],
      hotlines: [
        {
          name: 'Germany - TelefonSeelsorge',
          numbers: ['0800-111 0 111', '0800-111 0 222'],
          available: '24/7',
          description: 'Free telephone counseling'
        },
        {
          name: 'France - SOS Amitié',
          numbers: ['09 72 39 40 50'],
          available: '24/7',
          description: 'Emotional support'
        },
        {
          name: 'Spain - Telèfono de la Esperanza',
          numbers: ['024', '914 59 00 50'],
          available: '24/7',
          description: 'Crisis counseling'
        },
        {
          name: 'Netherlands - Stichting 113Online',
          numbers: ['0900 0113'],
          available: 'Daily',
          description: 'Suicide prevention service'
        },
        {
          name: 'Italy - Telefono Azzurro',
          numbers: ['19696'],
          available: '24/7',
          description: 'Crisis support'
        }
      ]
    },
    asia: {
      title: 'Asia & Pacific',
      resources: [],
      hotlines: [
        {
          name: 'Hong Kong - The Samaritans',
          numbers: ['2389 2222'],
          available: '24/7',
          description: 'Crisis support'
        },
        {
          name: 'Singapore - Suicidal Ideation Counsel',
          numbers: ['1800 221 4444'],
          available: '24/7',
          description: 'Support for suicidal crisis'
        },
        {
          name: 'Japan - Tell Lifeline',
          numbers: ['03-5774-0992'],
          available: 'Daily',
          description: 'English support available'
        },
        {
          name: 'India - AASRA',
          numbers: ['9820466726'],
          available: '24/7',
          description: 'Suicide prevention'
        }
      ]
    }
  };

  const onlineResources = [
    {
      title: 'Crisis Text Line',
      description: 'Text-based crisis support available in multiple countries',
      link: 'https://www.crisistextline.org',
      icon: '💬'
    },
    {
      title: 'International Association for Suicide Prevention',
      description: 'Database of crisis centers and prevention resources worldwide',
      link: 'https://www.iasp.info',
      icon: '🌍'
    },
    {
      title: 'NAMI (National Alliance on Mental Illness)',
      description: 'Mental health support and crisis resources',
      link: 'https://www.nami.org',
      icon: '🧠'
    },
    {
      title: 'The Trevor Project',
      description: 'Crisis support for LGBTQ+ youth',
      link: 'https://www.thetrevorproject.org',
      icon: '🏳️‍🌈'
    },
    {
      title: 'Crisis.chat',
      description: 'Free online support through trained counselors',
      link: 'https://www.crisis.chat',
      icon: '💻'
    },
    {
      title: 'BetterHelp',
      description: 'Online therapy and counseling services',
      link: 'https://www.betterhelp.com',
      icon: '👥'
    }
  ];

  const renderHotlineNumber = (numbers) => {
    if (Array.isArray(numbers)) {
      return numbers.join(' / ');
    }
    return numbers;
  };

  return (
    <div className="crisis-container">
      <header className="crisis-header">
        <h1>Crisis Support & Resources</h1>
        <p>You are not alone. Help is available 24/7.</p>
      </header>

      {/* Immediate Action Section */}
      <section className="immediate-action">
        <div className="action-card emergency">
          <div className="icon">🚨</div>
          <h3>If You're in Immediate Danger</h3>
          <p>Call emergency services:</p>
          <div className="emergency-numbers">
            <span>🇺🇸 911 (USA)</span>
            <span>🇨🇦 911 (Canada)</span>
            <span>🇬🇧 999 (UK)</span>
            <span>🇦🇺 000 (Australia)</span>
            <span>🌍 112 (Most countries)</span>
          </div>
        </div>

        <div className="action-card support">
          <div className="icon">❤️</div>
          <h3>If You're Having Thoughts of Suicide</h3>
          <p>Reach out immediately to a crisis hotline. Your life has value and meaning.</p>
          <ul>
            <li>Call a crisis hotline in your country</li>
            <li>Text a support service</li>
            <li>Tell someone you trust</li>
            <li>Go to your nearest emergency room</li>
            <li>Reach out to a counselor or therapist</li>
          </ul>
        </div>

        <div className="action-card reach-out">
          <div className="icon">🤝</div>
          <h3>If You're Struggling With Addiction</h3>
          <p>Recovery is possible. You deserve support.</p>
          <ul>
            <li>Contact SAMHSA National Helpline (USA): 1-800-662-4357</li>
            <li>Reach out to a local support group or sponsor</li>
            <li>Talk to a therapist or counselor</li>
            <li>Stay connected to your recovery community</li>
            <li>Use this app to track your recovery journey</li>
          </ul>
        </div>
      </section>

      {/* Crisis Hotlines by Region */}
      <section className="crisis-hotlines">
        <h2>Crisis Hotlines by Region</h2>
        
        <div className="region-tabs">
          {Object.entries(hotlines).map(([key, region]) => (
            <button
              key={key}
              className={`region-tab ${expandedRegion === key ? 'active' : ''}`}
              onClick={() => setExpandedRegion(expandedRegion === key ? null : key)}
            >
              {region.title}
            </button>
          ))}
        </div>

        <div className="region-content">
          {expandedRegion && hotlines[expandedRegion] && (
            <div className="region-detail">
              <h3>{hotlines[expandedRegion].title}</h3>

              {/* Online Resources for this region */}
              {hotlines[expandedRegion].resources && hotlines[expandedRegion].resources.length > 0 && (
                <div className="online-support">
                  <h4>📱 Online & Text Support</h4>
                  {hotlines[expandedRegion].resources.map((resource, idx) => (
                    <div key={idx} className="resource-item">
                      <div className="resource-header">
                        <span className="resource-name">{resource.name}</span>
                        {resource.type && <span className="badge">{resource.type}</span>}
                      </div>
                      <p>{resource.description}</p>
                      {resource.link && (
                        <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-link">
                          Learn more →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Phone Hotlines */}
              {hotlines[expandedRegion].hotlines && hotlines[expandedRegion].hotlines.length > 0 && (
                <div className="hotline-list">
                  <h4>☎️ Phone Hotlines</h4>
                  {hotlines[expandedRegion].hotlines.map((hotline, idx) => (
                    <div key={idx} className="hotline-item">
                      <div className="hotline-header">
                        <h5>{hotline.name}</h5>
                        <span className="availability">{hotline.available}</span>
                      </div>
                      <div className="hotline-numbers">
                        <span className="number">{renderHotlineNumber(hotline.numbers)}</span>
                      </div>
                      {hotline.description && (
                        <p className="hotline-description">{hotline.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Online Resources */}
      <section className="online-resources-section">
        <h2>Online Resources & Support</h2>
        <div className="resources-grid">
          {onlineResources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card"
            >
              <div className="resource-icon">{resource.icon}</div>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <span className="visit-link">Visit →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Important Information */}
      <section className="important-info">
        <h2>Important Information</h2>
        
        <div className="info-card">
          <h3>🆘 What to Expect When You Call</h3>
          <ul>
            <li><strong>Trained counselors:</strong> You'll speak with trained professionals who understand crises</li>
            <li><strong>No judgment:</strong> Crisis services are non-judgmental and confidential</li>
            <li><strong>Privacy:</strong> Your privacy is protected (with rare exceptions for imminent danger)</li>
            <li><strong>Always free:</strong> All crisis hotlines are free to call</li>
            <li><strong>Listening:</strong> Counselors are there to listen, not judge</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>💪 Reasons to Reach Out</h3>
          <ul>
            <li>You're having thoughts of suicide</li>
            <li>You're in emotional or physical pain</li>
            <li>You're feeling hopeless or trapped</li>
            <li>You're struggling with addiction or cravings</li>
            <li>You've recently experienced trauma or loss</li>
            <li>You feel alone or disconnected</li>
            <li>You need someone to talk to</li>
          </ul>
        </div>

        <div className="info-card hope">
          <h3>🌈 There Is Hope</h3>
          <p>
            If you are having suicidal thoughts, please know that this feeling is temporary. Many people who have felt this way have gone on to recover and find meaning and joy in their lives.
          </p>
          <p>
            Help is available right now, in this moment. You deserve to live, to recover, and to experience peace and healing.
          </p>
          <p>
            <strong>Please reach out. You don't have to face this alone.</strong>
          </p>
        </div>
      </section>

      {/* Crisis Safety Plan */}
      <section className="safety-plan">
        <h2>Personal Safety Plan</h2>
        <p>Consider creating your own safety plan:</p>
        <div className="plan-items">
          <div className="plan-item">
            <span className="number">1</span>
            <div>
              <h4>Identify Warning Signs</h4>
              <p>What thoughts, feelings, or situations trigger crisis thoughts?</p>
            </div>
          </div>
          <div className="plan-item">
            <span className="number">2</span>
            <div>
              <h4>Internal Coping Strategies</h4>
              <p>What can you do to help yourself? (meditate, journal, exercise, etc.)</p>
            </div>
          </div>
          <div className="plan-item">
            <span className="number">3</span>
            <div>
              <h4>People & Social Settings</h4>
              <p>Who can you reach out to? Safe places you can go?</p>
            </div>
          </div>
          <div className="plan-item">
            <span className="number">4</span>
            <div>
              <h4>Professional Support</h4>
              <p>Therapist, counselor, or crisis line numbers to call</p>
            </div>
          </div>
          <div className="plan-item">
            <span className="number">5</span>
            <div>
              <h4>Keep Safe</h4>
              <p>Ways to secure your space and reduce access to means</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Crisis;
