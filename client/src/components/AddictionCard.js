import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './AddictionCard.css';

export default function AddictionCard({ addiction }) {
  const { t } = useTranslation('addictions');
  const daysStopped = Math.floor((Date.now() - new Date(addiction.stopDate)) / (1000 * 60 * 60 * 24));
  const moneySaved = daysStopped * addiction.moneySpentPerDay;

  return (
    <Link to={`/addiction/${addiction._id}`} className="addiction-card">
      <h3>{addiction.name}</h3>
      <div className="card-stats">
        <div className="stat">
          <span className="label">{t('addictionCard.days')}</span>
          <span className="value">{daysStopped}</span>
        </div>
        <div className="stat">
          <span className="label">{t('addictionCard.saved')}</span>
          <span className="value">${moneySaved.toFixed(2)}</span>
        </div>
      </div>
      <p className="encouragement">{t('addictionCard.encouragement')}</p>
    </Link>
  );
}
