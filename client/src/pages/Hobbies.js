import React, { useState } from 'react';
import './Hobbies.css';
import { useTranslation } from 'react-i18next';

const Hobbies = () => {
  const { t } = useTranslation('hobbies');
  const [activeFilter, setActiveFilter] = useState('all');

  const hobbies = t('hobbies', { returnObjects: true });
  const filterOptions = t('filterOptions', { returnObjects: true });
  const benefitsData = t('benefits', { returnObjects: true });
  const categoryLabels = t('categoryLabels', { returnObjects: true });
  const finalMessages = t('finalMessages', { returnObjects: true });

  const filteredHobbies = activeFilter === 'all' 
    ? hobbies 
    : hobbies.filter(hobby => hobby.category.includes(activeFilter));

  return (
    <div className="hobbies-container">
      {/* Header */}
      <header className="hobbies-header">
        <h1>{t('pageTitle')}</h1>
        <p>{t('subtitle')}</p>
      </header>

      {/* Why Hobbies Matter */}
      <section className="why-hobbies">
        <h2>{t('whyHobbiesTitle')}</h2>
        <div className="benefits-grid">
          {benefitsData.map((benefit, idx) => (
            <div key={idx} className="benefit">
              <span className="benefit-emoji">{benefit.emoji}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Buttons */}
      <div className="filter-section">
        <h2>{t('filterTitle')}</h2>
        <div className="filter-buttons">
          {filterOptions.map(option => (
            <button
              key={option.value}
              className={`filter-btn ${activeFilter === option.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(option.value)}
            >
              <span className="filter-label">{option.label}</span>
              {option.subtext && <span className="filter-subtext">{option.subtext}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Hobbies Grid */}
      <div className="hobbies-grid">
        {filteredHobbies.map(hobby => (
          <div key={hobby.id} className="hobby-card">
            {/* Header */}
            <div className="hobby-header">
              <span className="hobby-emoji">{hobby.emoji}</span>
              <div className="hobby-title-section">
                <h3 className="hobby-name">{hobby.name}</h3>
                <div className="hobby-duration">{hobby.duration}</div>
              </div>
            </div>

            {/* Description */}
            <p className="hobby-description">{hobby.description}</p>

            {/* Recovery Benefits */}
            <div className="recovery-benefits">
              <h4>{t('recoveryBenefitsTitle')}</h4>
              <ul className="benefits-list">
                {hobby.recovery_benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>

            {/* Get Started */}
            <div className="get-started">
              <h4>{t('getStartedTitle')}</h4>
              <p>{hobby.get_started}</p>
            </div>

            {/* Tags */}
            <div className="hobby-tags">
              {hobby.category.map(cat => (
                <span key={cat} className={`tag tag-${cat}`}>
                  {categoryLabels[cat] || cat}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Final Message */}
      <section className="hobbies-final">
        <h2>{t('finalTitle')}</h2>
        {finalMessages.map((message, idx) => (
          <p key={idx} style={idx === finalMessages.length - 1 ? { fontWeight: "bold" } : {}}>
            {message}
          </p>
        ))}
      </section>
    </div>
  );
};

export default Hobbies;
