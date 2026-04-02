import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './PreparationPlan.css';
import SetStopDateModal from '../components/SetStopDateModal';
import apiClient from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const PreparationPlan = () => {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation(['resources', 'common']);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showStopDateModal, setShowStopDateModal] = useState(false);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const saveTimers = useRef({});

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  // Load preparation data on mount
  useEffect(() => {
    const loadPreparationData = async () => {
      try {
        if (!token) {
          console.log('[PreparationPlan] No token available, skipping load');
          return;
        }
        console.log('[PreparationPlan] Loading preparation data...');
        const response = await apiClient.get('/api/preparation');
        console.log('[PreparationPlan] Loaded preparation data:', response.data);
        if (response.data && response.data.responses) {
          console.log('[PreparationPlan] Setting responses:', response.data.responses);
          setResponses(response.data.responses);
        }
      } catch (err) {
        console.error('[PreparationPlan] Error loading preparation data:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPreparationData();
  }, [token]);

  // Auto-save function with debouncing
  const handleResponseChange = (fieldId, text) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: text
    }));

    // Clear existing timer for this field
    if (saveTimers.current[fieldId]) {
      clearTimeout(saveTimers.current[fieldId]);
    }

    // Set new timer for auto-save (500ms delay)
    saveTimers.current[fieldId] = setTimeout(async () => {
      try {
        console.log(`[PreparationPlan] Saving field ${fieldId}:`, text);
        const response = await apiClient.put(`/api/preparation/${fieldId}`, { text });
        console.log(`[PreparationPlan] Save successful for ${fieldId}:`, response.data);
      } catch (err) {
        console.error(`[PreparationPlan] Error saving preparation field ${fieldId}:`, err.response?.data || err.message);
      }
    }, 500);
  };

  return (
    <>
      <div className="preparation-container">
      {/* Header */}
      <header className="preparation-header">
        <h1>{t('preparationPlan.header.title')}</h1>
        <p>{t('preparationPlan.header.subtitle')}</p>
      </header>

      {/* Motivation Section */}
      <section className="preparation-section featured">
        <div className="section-header" onClick={() => toggleSection('motivation')}>
          <div className="section-title">
            <span className="section-emoji">⭐</span>
            <h2>{t('preparationPlan.motivation.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'motivation' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'motivation' ? 'expanded' : ''}`}>
          <p>
            <strong>{t('preparationPlan.motivation.mainMessage')}</strong> {t('preparationPlan.motivation.description')}
          </p>
          <ul className="section-list">
            {t('preparationPlan.motivation.benefits', { returnObjects: true }).map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
          <p className="key-insight">{t('preparationPlan.motivation.insight')}</p>
        </div>
      </section>

      {/* 1. Assess Your Current Situation */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('assess')}>
          <div className="section-title">
            <span className="section-emoji">🔍</span>
            <h2>{t('preparationPlan.assess.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'assess' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'assess' ? 'expanded' : ''}`}>
          <p>{t('preparationPlan.assess.intro')}</p>
          <div className="prep-checklist">
            <div className="checklist-item-group">
              <div className="checklist-item">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.assess.questions.frequency')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['assess_frequency'] || ''}
                onChange={(e) => handleResponseChange('assess_frequency', e.target.value)}
                placeholder={t('preparationPlan.assess.placeholder')}
                rows={3}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-item">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.assess.questions.money')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['assess_money'] || ''}
                onChange={(e) => handleResponseChange('assess_money', e.target.value)}
                placeholder={t('preparationPlan.assess.placeholder')}
                rows={3}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-item">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.assess.questions.time')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['assess_time'] || ''}
                onChange={(e) => handleResponseChange('assess_time', e.target.value)}
                placeholder={t('preparationPlan.assess.placeholder')}
                rows={3}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-item">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.assess.questions.triggers')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['assess_triggers'] || ''}
                onChange={(e) => handleResponseChange('assess_triggers', e.target.value)}
                placeholder={t('preparationPlan.assess.placeholder')}
                rows={3}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-item">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.assess.questions.impact')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['assess_impact'] || ''}
                onChange={(e) => handleResponseChange('assess_impact', e.target.value)}
                placeholder={t('preparationPlan.assess.placeholder')}
                rows={3}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-item">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.assess.questions.obstacles')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['assess_obstacles'] || ''}
                onChange={(e) => handleResponseChange('assess_obstacles', e.target.value)}
                placeholder={t('preparationPlan.assess.placeholder')}
                rows={3}
              />
            </div>
          </div>
          <p>
            <strong>{t('common:save')}:</strong> {t('preparationPlan.assess.tip')}
          </p>
        </div>
      </section>

      {/* 2. Set a Quit Date */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('quitdate')}>
          <div className="section-title">
            <span className="section-emoji">📅</span>
            <h2>{t('preparationPlan.quitDate.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'quitdate' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'quitdate' ? 'expanded' : ''}`}>
          <p>
            <strong>{t('preparationPlan.quitDate.mainAdvice')}</strong>
          </p>
          <div className="prep-tips">
            {t('preparationPlan.quitDate.goodTiming', { returnObjects: true }).map((tip, idx) => (
              <div key={`good-${idx}`} className="tip">{tip}</div>
            ))}
            {t('preparationPlan.quitDate.badTiming', { returnObjects: true }).map((tip, idx) => (
              <div key={`bad-${idx}`} className="tip">{tip}</div>
            ))}
          </div>
          <p>{t('preparationPlan.quitDate.finalAdvice')}</p>
        </div>
      </section>

      {/* 3. Identify Your Triggers */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('triggers')}>
          <div className="section-title">
            <span className="section-emoji">🎯</span>
            <h2>{t('preparationPlan.triggers.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'triggers' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'triggers' ? 'expanded' : ''}`}>
          <p>
            <strong>{t('preparationPlan.triggers.intro')}</strong>
          </p>
          <div className="trigger-categories">
            <div className="trigger-cat">
              <h4>{t('preparationPlan.triggers.categories.emotional.title')}</h4>
              <p>{t('preparationPlan.triggers.categories.emotional.description')}</p>
            </div>
            <div className="trigger-cat">
              <h4>{t('preparationPlan.triggers.categories.social.title')}</h4>
              <p>{t('preparationPlan.triggers.categories.social.description')}</p>
            </div>
            <div className="trigger-cat">
              <h4>{t('preparationPlan.triggers.categories.environmental.title')}</h4>
              <p>{t('preparationPlan.triggers.categories.environmental.description')}</p>
            </div>
            <div className="trigger-cat">
              <h4>{t('preparationPlan.triggers.categories.habitual.title')}</h4>
              <p>{t('preparationPlan.triggers.categories.habitual.description')}</p>
            </div>
          </div>
          <p>
            <strong>{t('preparationPlan.triggers.action')}</strong>
          </p>
        </div>
      </section>

      {/* 4. Build Your Support Network */}
      <section className="preparation-section featured">
        <div className="section-header" onClick={() => toggleSection('support')}>
          <div className="section-title">
            <span className="section-emoji">🫂</span>
            <h2>{t('preparationPlan.support.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'support' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'support' ? 'expanded' : ''}`}>
          <p>
            <strong>{t('preparationPlan.support.intro')}</strong>
          </p>
          <div className="support-types">
            <div className="support-type">
              <h4>{t('preparationPlan.support.people.title')}</h4>
              <ul>
                {t('preparationPlan.support.people.items', { returnObjects: true }).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="support-type">
              <h4>{t('preparationPlan.support.resources.title')}</h4>
              <ul>
                {t('preparationPlan.support.resources.items', { returnObjects: true }).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="support-type">
              <h4>{t('preparationPlan.support.professional.title')}</h4>
              <ul>
                {t('preparationPlan.support.professional.items', { returnObjects: true }).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="action-step">
            <strong>{t('preparationPlan.support.action')}</strong>
          </p>
        </div>
      </section>

      {/* 5. Plan Your Coping Strategies */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('coping')}>
          <div className="section-title">
            <span className="section-emoji">🛠️</span>
            <h2>{t('preparationPlan.coping.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'coping' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'coping' ? 'expanded' : ''}`}>
          <p>
            <strong>{t('preparationPlan.coping.intro')}</strong>
          </p>
          <div className="coping-strategies">
            <div className="strategy">
              <h4>{t('preparationPlan.coping.strategies.meditation.title')}</h4>
              <p>{t('preparationPlan.coping.strategies.meditation.description')}</p>
            </div>
            <div className="strategy">
              <h4>{t('preparationPlan.coping.strategies.distraction.title')}</h4>
              <p>{t('preparationPlan.coping.strategies.distraction.description')}</p>
            </div>
            <div className="strategy">
              <h4>{t('preparationPlan.coping.strategies.physical.title')}</h4>
              <p>{t('preparationPlan.coping.strategies.physical.description')}</p>
            </div>
            <div className="strategy">
              <h4>{t('preparationPlan.coping.strategies.journaling.title')}</h4>
              <p>{t('preparationPlan.coping.strategies.journaling.description')}</p>
            </div>
            <div className="strategy">
              <h4>{t('preparationPlan.coping.strategies.emotions.title')}</h4>
              <p>{t('preparationPlan.coping.strategies.emotions.description')}</p>
            </div>
            <div className="strategy">
              <h4>{t('preparationPlan.coping.strategies.connection.title')}</h4>
              <p>{t('preparationPlan.coping.strategies.connection.description')}</p>
            </div>
          </div>
          <p>
            <strong>{t('preparationPlan.coping.action')}</strong>
          </p>
        </div>
      </section>

      {/* 6. Remove Temptations */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('remove')}>
          <div className="section-title">
            <span className="section-emoji">🗑️</span>
            <h2>{t('preparationPlan.remove.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'remove' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'remove' ? 'expanded' : ''}`}>
          <p>
            <strong>{t('preparationPlan.remove.intro')}</strong>
          </p>
          <div className="removal-actions">
            <div className="action-item">
              <strong>{t('preparationPlan.remove.actions.clean.title')}</strong>
              <p>{t('preparationPlan.remove.actions.clean.description')}</p>
            </div>
            <div className="action-item">
              <strong>{t('preparationPlan.remove.actions.delete.title')}</strong>
              <p>{t('preparationPlan.remove.actions.delete.description')}</p>
            </div>
            <div className="action-item">
              <strong>{t('preparationPlan.remove.actions.money.title')}</strong>
              <p>{t('preparationPlan.remove.actions.money.description')}</p>
            </div>
            <div className="action-item">
              <strong>{t('preparationPlan.remove.actions.avoid.title')}</strong>
              <p>{t('preparationPlan.remove.actions.avoid.description')}</p>
            </div>
            <div className="action-item">
              <strong>{t('preparationPlan.remove.actions.distance.title')}</strong>
              <p>{t('preparationPlan.remove.actions.distance.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Plan for the First 48 Hours */}
      <section className="preparation-section featured">
        <div className="section-header" onClick={() => toggleSection('48hours')}>
          <div className="section-title">
            <span className="section-emoji">⏰</span>
            <h2>{t('preparationPlan.fortyEightHours.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === '48hours' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === '48hours' ? 'expanded' : ''}`}>
          <p>
            <strong>{t('preparationPlan.fortyEightHours.intro')}</strong>
          </p>
          <div className="first-day-plan">
            <div className="time-block">
              <strong>{t('preparationPlan.fortyEightHours.blocks.wakeUp.title')}</strong>
              <p>{t('preparationPlan.fortyEightHours.blocks.wakeUp.description')}</p>
            </div>
            <div className="time-block">
              <strong>{t('preparationPlan.fortyEightHours.blocks.morning.title')}</strong>
              <p>{t('preparationPlan.fortyEightHours.blocks.morning.description')}</p>
            </div>
            <div className="time-block">
              <strong>{t('preparationPlan.fortyEightHours.blocks.afternoon.title')}</strong>
              <p>{t('preparationPlan.fortyEightHours.blocks.afternoon.description')}</p>
            </div>
            <div className="time-block">
              <strong>{t('preparationPlan.fortyEightHours.blocks.evening.title')}</strong>
              <p>{t('preparationPlan.fortyEightHours.blocks.evening.description')}</p>
            </div>
            <div className="time-block">
              <strong>{t('preparationPlan.fortyEightHours.blocks.night.title')}</strong>
              <p>{t('preparationPlan.fortyEightHours.blocks.night.description')}</p>
            </div>
          </div>
          <p className="key-insight">
            {t('preparationPlan.fortyEightHours.insight')}
          </p>
        </div>
      </section>

      {/* 8. Prepare Mentally */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('mental')}>
          <div className="section-title">
            <span className="section-emoji">🧠</span>
            <h2>{t('preparationPlan.mental.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'mental' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'mental' ? 'expanded' : ''}`}>
          <p>
            <strong>{t('preparationPlan.mental.intro')}</strong>
          </p>
          <div className="mental-prep">
            {t('preparationPlan.mental.beliefs', { returnObjects: true }).map((belief, idx) => (
              <div key={idx} className="belief">{belief}</div>
            ))}
          </div>
          <p>
            <strong>{t('preparationPlan.mental.action')}</strong>
          </p>
        </div>
      </section>

      {/* 9. Talk to Your Doctor */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('doctor')}>
          <div className="section-title">
            <span className="section-emoji">⚕️</span>
            <h2>{t('preparationPlan.doctor.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'doctor' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'doctor' ? 'expanded' : ''}`}>
          <p>
            <strong>{t('preparationPlan.doctor.intro')}</strong>
          </p>
          <div className="medical-info">
            <div className="info-box">
              <h4>{t('preparationPlan.doctor.canProvide.title')}</h4>
              <ul>
                {t('preparationPlan.doctor.canProvide.items', { returnObjects: true }).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="info-box">
              <h4>{t('preparationPlan.doctor.beHonest.title')}</h4>
              <ul>
                {t('preparationPlan.doctor.beHonest.items', { returnObjects: true }).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p>
            <strong>{t('preparationPlan.doctor.closing')}</strong>
          </p>
        </div>
      </section>

      {/* 10. Tell People */}
      <section className="preparation-section featured">
        <div className="section-header" onClick={() => toggleSection('tell')}>
          <div className="section-title">
            <span className="section-emoji">📢</span>
            <h2>{t('preparationPlan.tell.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'tell' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'tell' ? 'expanded' : ''}`}>
          <p>
            <strong>{t('preparationPlan.tell.intro')}</strong>
          </p>
          <div className="tell-people">
            <div className="tell-group">
              <h4>{t('preparationPlan.tell.positive.title')}</h4>
              <ul>
                {t('preparationPlan.tell.positive.items', { returnObjects: true }).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="tell-group">
              <h4>{t('preparationPlan.tell.beCareful.title')}</h4>
              <ul>
                {t('preparationPlan.tell.beCareful.items', { returnObjects: true }).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p>
            <strong>{t('preparationPlan.tell.whatToSay')}</strong>
          </p>
        </div>
      </section>

      {/* 11. Create a Backup Plan */}
      <section className="preparation-section">
        <div className="section-header" onClick={() => toggleSection('backup')}>
          <div className="section-title">
            <span className="section-emoji">🆘</span>
            <h2>{t('preparationPlan.backup.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'backup' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'backup' ? 'expanded' : ''}`}>
          <p>
            <strong>{t('preparationPlan.backup.intro')}</strong>
          </p>
          <div className="backup-plan">
            <div className="plan-step">
              <h4>{t('preparationPlan.backup.cravingHits.title')}</h4>
              <p>
                {t('preparationPlan.backup.cravingHits.steps', { returnObjects: true }).map((step, idx) => (
                  <div key={idx}>{step}</div>
                ))}
              </p>
            </div>
            <div className="plan-step">
              <h4>{t('preparationPlan.backup.almostUse.title')}</h4>
              <p>
                {t('preparationPlan.backup.almostUse.steps', { returnObjects: true }).map((step, idx) => (
                  <div key={idx}>{step}</div>
                ))}
              </p>
            </div>
            <div className="plan-step">
              <h4>{t('preparationPlan.backup.doUse.title')}</h4>
              <p>
                {t('preparationPlan.backup.doUse.steps', { returnObjects: true }).map((step, idx) => (
                  <div key={idx}>{step}</div>
                ))}
              </p>
            </div>
            <div className="plan-step">
              <h4>{t('preparationPlan.backup.emergencyResources.title')}</h4>
              <p>
                {t('preparationPlan.backup.emergencyResources.samhsa')}<br/>
                {t('preparationPlan.backup.emergencyResources.crisisText')}<br/>
                {t('preparationPlan.backup.emergencyResources.suicide')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Your Pre-Quit Checklist */}
      <section className="preparation-section featured final-checklist">
        <div className="section-header" onClick={() => toggleSection('checklist')}>
          <div className="section-title">
            <span className="section-emoji">✅</span>
            <h2>{t('preparationPlan.checklist.title')}</h2>
          </div>
          <span className="toggle-icon">{expandedSection === 'checklist' ? '−' : '+'}</span>
        </div>
        <div className={`section-content ${expandedSection === 'checklist' ? 'expanded' : ''}`}>
          <p>{t('preparationPlan.checklist.intro')}</p>
          <div className="final-checklist-items">
            <div className="checklist-item-group">
              <div className="checklist-row">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.checklist.items.quitDate')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['checklist_quit_date'] || ''}
                onChange={(e) => handleResponseChange('checklist_quit_date', e.target.value)}
                placeholder={t('preparationPlan.checklist.placeholders.quitDate')}
                rows={2}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-row">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.checklist.items.triggers')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['checklist_triggers'] || ''}
                onChange={(e) => handleResponseChange('checklist_triggers', e.target.value)}
                placeholder={t('preparationPlan.checklist.placeholders.triggers')}
                rows={2}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-row">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.checklist.items.triggerPlans')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['checklist_trigger_plans'] || ''}
                onChange={(e) => handleResponseChange('checklist_trigger_plans', e.target.value)}
                placeholder={t('preparationPlan.checklist.placeholders.triggerPlans')}
                rows={2}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-row">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.checklist.items.supportPeople')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['checklist_support_people'] || ''}
                onChange={(e) => handleResponseChange('checklist_support_people', e.target.value)}
                placeholder={t('preparationPlan.checklist.placeholders.supportPeople')}
                rows={2}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-row">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.checklist.items.crisisToolkit')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['checklist_crisis_toolkit'] || ''}
                onChange={(e) => handleResponseChange('checklist_crisis_toolkit', e.target.value)}
                placeholder={t('preparationPlan.checklist.placeholders.crisisToolkit')}
                rows={2}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-row">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.checklist.items.cleanSpace')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['checklist_clean_space'] || ''}
                onChange={(e) => handleResponseChange('checklist_clean_space', e.target.value)}
                placeholder={t('preparationPlan.checklist.placeholders.cleanSpace')}
                rows={2}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-row">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.checklist.items.fortyEightHours')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['checklist_48hours'] || ''}
                onChange={(e) => handleResponseChange('checklist_48hours', e.target.value)}
                placeholder={t('preparationPlan.checklist.placeholders.fortyEightHours')}
                rows={2}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-row">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.checklist.items.doctor')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['checklist_doctor'] || ''}
                onChange={(e) => handleResponseChange('checklist_doctor', e.target.value)}
                placeholder={t('preparationPlan.checklist.placeholders.doctor')}
                rows={2}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-row">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.checklist.items.toldSupport')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['checklist_told_support'] || ''}
                onChange={(e) => handleResponseChange('checklist_told_support', e.target.value)}
                placeholder={t('preparationPlan.checklist.placeholders.toldSupport')}
                rows={2}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-row">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.checklist.items.helplines')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['checklist_helplines'] || ''}
                onChange={(e) => handleResponseChange('checklist_helplines', e.target.value)}
                placeholder={t('preparationPlan.checklist.placeholders.helplines')}
                rows={2}
              />
            </div>
            <div className="checklist-item-group">
              <div className="checklist-row">
                <input type="checkbox" disabled />
                <label>{t('preparationPlan.checklist.items.ready')}</label>
              </div>
              <textarea
                className="checklist-response-field"
                value={responses['checklist_ready'] || ''}
                onChange={(e) => handleResponseChange('checklist_ready', e.target.value)}
                placeholder={t('preparationPlan.checklist.placeholders.ready')}
                rows={2}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final Message */}
      <section className="preparation-section final-message">
        <div className="section-icon">{t('preparationPlan.final.emoji')}</div>
        <h2>{t('preparationPlan.final.title')}</h2>
        <div className="section-content">
          <p>{t('preparationPlan.final.message1')}</p>
          <p>
            <strong>{t('preparationPlan.final.message2')}</strong>
          </p>
          <p>{t('preparationPlan.final.message3')}</p>
          <p>
            <strong>{t('preparationPlan.final.message4')}</strong>
          </p>
          <p className="final-encouragement">
            {t('preparationPlan.final.encouragement')}
          </p>
          <button 
            className="btn-set-stop-date"
            onClick={() => setShowStopDateModal(true)}
          >
            {t('preparationPlan.final.buttonText')}
          </button>
        </div>
      </section>
    </div>

    {showStopDateModal && (
      <SetStopDateModal
        onClose={() => setShowStopDateModal(false)}
        onSuccess={() => {
          // Optional: you could add a success toast here
        }}
      />
    )}
  </>
  );
};

export default PreparationPlan;
