import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SelfAssessment.css';

const SelfAssessment = () => {
  const { t } = useTranslation('resources');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [result, setResult] = useState(null);

  // Build questions from translations instead of hardcoded
  const buildQuestions = () => {
    const questionsData = t('selfAssessment.questions', { returnObjects: true });
    const questionsList = [];
    Object.entries(questionsData).forEach(([key, data]) => {
      questionsList.push({
        id: key,
        question: data.question,
        options: data.options.map((opt, idx) => ({
          text: opt.text,
          score: idx
        }))
      });
    });
    return questionsList;
  };

  const questions = buildQuestions();

  const handleAnswer = (score) => {
    const questionId = questions[currentQuestion].id;
    setScores({
      ...scores,
      [questionId]: score
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const maxScore = questions.length * 4;
    const percentageScore = (totalScore / maxScore) * 100;

    let category = '';
    let description = '';
    let severity = '';
    let isFunctioningUser = false;
    let recommendations = [];

    const functioningScore = scores.functioning || 0;

    if (percentageScore < 15) {
      category = t('selfAssessment.categories.atRisk');
      severity = t('selfAssessment.severities.low');
      description = t('selfAssessment.descriptions.atRisk');
      recommendations = [
        { title: 'Why Use This', path: '/why-use-this', reason: 'Learn about evidence-based tracking methods' },
        { title: 'How to Succeed in Recovery', path: '/how-to-succeed', reason: 'Build healthy habits now before dependency deepens' }
      ];
    } else if (percentageScore < 30) {
      category = t('selfAssessment.categories.earlyStage');
      severity = t('selfAssessment.severities.mild');
      description = t('selfAssessment.descriptions.earlyStage');
      recommendations = [
        { title: 'Why Use This', path: '/why-use-this', reason: 'Understand how tracking helps interrupt addiction cycles' },
        { title: 'How to Succeed in Recovery', path: '/how-to-succeed', reason: 'Learn proven strategies for breaking patterns' }
      ];
    } else if (percentageScore < 50) {
      category = t('selfAssessment.categories.moderate');
      severity = t('selfAssessment.severities.moderate');
      description = t('selfAssessment.descriptions.moderate');
      recommendations = [
        { title: 'The Myth of the Functioning User', path: '/functioning-user', reason: 'Understand the hidden costs of continuing' },
        { title: 'How to Succeed in Recovery', path: '/how-to-succeed', reason: 'Comprehensive strategies for this stage' },
        { title: 'Why Use This', path: '/why-use-this', reason: 'Tools to help you track and understand your patterns' }
      ];
    } else if (percentageScore < 70) {
      category = t('selfAssessment.categories.severe');
      severity = t('selfAssessment.severities.severe');
      description = t('selfAssessment.descriptions.severe');
      recommendations = [
        { title: 'The Myth of the Functioning User', path: '/functioning-user', reason: 'Understand the progression and urgency of your situation' },
        { title: 'How to Succeed in Recovery', path: '/how-to-succeed', reason: 'Intensive strategies and support needed now' },
        { title: 'Crisis Support', path: '/crisis', reason: 'Immediate help when you need it most' }
      ];
    } else {
      category = t('selfAssessment.categories.severe');
      severity = t('selfAssessment.severities.critical');
      description = t('selfAssessment.descriptions.critical');
      recommendations = [
        { title: 'Crisis Support', path: '/crisis', reason: 'Get immediate help and resources' },
        { title: 'The Myth of the Functioning User', path: '/functioning-user', reason: 'Understand what\'s really happening to you' },
        { title: 'How to Succeed in Recovery', path: '/how-to-succeed', reason: 'Begin your path to freedom today' }
      ];
    }

    // Check if functioning user (high life impact but low life management score)
    if (functioningScore <= 2 && (percentageScore > 40)) {
      isFunctioningUser = true;
      description += '\n\n' + t('selfAssessment.functioning');
    }

    setResult({
      category,
      severity,
      description,
      percentageScore: Math.round(percentageScore),
      isFunctioningUser,
      recommendations,
      totalScore,
      maxScore
    });

    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({});
    setShowResults(false);
    setQuizStarted(false);
    setResult(null);
  };

  if (showResults && result) {
    return (
      <div className="self-assessment-container">
        <header className="assessment-header">
          <h1>{t('selfAssessment.resultsTitle')}</h1>
          <p>{t('selfAssessment.resultsSubtitle')}</p>
        </header>

        <div className="results-content">
          <div className={`result-card severity-${result.severity.toLowerCase()}`}>
            <div className="result-category">
              <h2>{result.category}</h2>
              <p className="severity-label">{result.severity} {t('selfAssessment.severityLabel')}</p>
            </div>

            <div className="result-score">
              <div className="score-circle">
                <span className="score-percentage">{result.percentageScore}%</span>
              </div>
            </div>

            <div className="result-description">
              {result.description.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className={paragraph.includes('🚨') ? 'warning-text' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>

            {result.isFunctioningUser && (
              <div className="functioning-user-alert">
                <h3>{t('selfAssessment.functioningUserAlert')}</h3>
                <p>
                  {t('selfAssessment.functioningDescription')}
                </p>
              </div>
            )}

            <div className="result-message">
              <h3>{t('selfAssessment.remember')}</h3>
              <ul>
                {t('selfAssessment.rememberItems', { returnObjects: true }).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="recommendations-section">
              <h3>{t('selfAssessment.recommendations')}</h3>
              <div className="recommendations-list">
                {result.recommendations.map((rec, idx) => (
                  <Link key={idx} to={rec.path} className="recommendation-item">
                    <div className="rec-title">{rec.title}</div>
                    <div className="rec-reason">{rec.reason}</div>
                    <div className="rec-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={resetQuiz} className="btn btn-secondary">
                {t('selfAssessment.takeAgain')}
              </button>
              <Link to="/add-addiction" className="btn btn-primary">
                {t('selfAssessment.startTracking')}
              </Link>
            </div>
          </div>

          <div className="closing-message">
            <p>
              {t('selfAssessment.closingMessage')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults === false && currentQuestion === 0 && !quizStarted) {
    return (
      <div className="self-assessment-container">
        <header className="assessment-header">
          <h1>{t('selfAssessment.quizTitle')}</h1>
          <p>{t('selfAssessment.quizSubtitle')}</p>
        </header>

        <div className="intro-content">
          <div className="intro-card">
            <h2>{t('selfAssessment.what')}</h2>
            <ul>
              {t('selfAssessment.introItems', { returnObjects: true }).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h2 style={{ marginTop: '30px' }}>{t('selfAssessment.important')}</h2>
            <ul>
              {t('selfAssessment.importantItems', { returnObjects: true }).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <div className="introduction-message">
              <p>
                {t('selfAssessment.introMessage')}
              </p>
            </div>

            <button onClick={() => setQuizStarted(true)} className="btn btn-primary btn-large">
              {t('selfAssessment.startQuiz')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="self-assessment-container">
      <header className="assessment-header">
        <h1>{t('selfAssessment.quizTitle')}</h1>
        <p>{t('selfAssessment.questionFormat', { current: currentQuestion + 1, total: questions.length })}</p>
      </header>

      <div className="quiz-content">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="question-card">
          <h2 className="question-text">{questions[currentQuestion].question}</h2>

          <div className="options-container">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.score)}
                className="option-button"
              >
                <span className="option-text">{option.text}</span>
                <span className="option-arrow">→</span>
              </button>
            ))}
          </div>

          <div className="question-navigation">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="btn btn-secondary"
            >
              {t('selfAssessment.back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfAssessment;
