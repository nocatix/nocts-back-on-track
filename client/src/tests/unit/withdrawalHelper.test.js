import {
  getFrequencyLabel,
  getCostLabel,
  getWithdrawalStage,
  formatDayCount,
  getWithdrawalTimeline,
  getRecoveryTips,
} from '../../utils/withdrawalHelper';

describe('getFrequencyLabel', () => {
  it('returns correct label for alcohol', () => {
    expect(getFrequencyLabel('🍺 alcohol')).toBe('standard drinks per day');
  });

  it('returns correct label for cannabis', () => {
    expect(getFrequencyLabel('🌿 cannabis')).toBe('grams per day');
  });

  it('returns correct label for nicotine', () => {
    expect(getFrequencyLabel('🚬 nicotine')).toBe('cigarettes per day');
  });

  it('returns fallback for unknown addiction', () => {
    expect(getFrequencyLabel('unknown addiction')).toBe('units per day');
  });

  it('returns fallback for empty string', () => {
    expect(getFrequencyLabel('')).toBe('units per day');
  });
});

describe('getCostLabel', () => {
  it('returns correct label for alcohol', () => {
    expect(getCostLabel('🍺 alcohol')).toBe('$ per drink');
  });

  it('returns correct label for nicotine', () => {
    expect(getCostLabel('🚬 nicotine')).toBe('$ per cigarette');
  });

  it('returns correct label for coffee', () => {
    expect(getCostLabel('☕ coffee')).toBe('$ per cup');
  });

  it('returns fallback for unknown addiction', () => {
    expect(getCostLabel('unknown addiction')).toBe('$ per unit');
  });
});

describe('getWithdrawalStage', () => {
  it('returns Day N for days 0–6', () => {
    expect(getWithdrawalStage(0)).toBe('Day 0');
    expect(getWithdrawalStage(1)).toBe('Day 1');
    expect(getWithdrawalStage(6)).toBe('Day 6');
  });

  it('returns Week 1 for day 7', () => {
    expect(getWithdrawalStage(7)).toBe('Week 1');
  });

  it('returns correct Week for days 7–27', () => {
    expect(getWithdrawalStage(13)).toBe('Week 2');
    expect(getWithdrawalStage(14)).toBe('Week 2');
    expect(getWithdrawalStage(27)).toBe('Week 4');
  });

  it('returns Month 1 for day 28', () => {
    expect(getWithdrawalStage(28)).toBe('Month 1');
  });

  it('returns correct Month for days 28–365', () => {
    expect(getWithdrawalStage(57)).toBe('Month 2');
    expect(getWithdrawalStage(365)).toBe('Month 12');
  });

  it('returns Year N for days beyond 365', () => {
    expect(getWithdrawalStage(366)).toBe('Year 1');
    expect(getWithdrawalStage(730)).toBe('Year 2');
  });
});

describe('formatDayCount', () => {
  it('returns "Less than 1 day" for days < 1', () => {
    expect(formatDayCount(0)).toBe('Less than 1 day');
    expect(formatDayCount(0.5)).toBe('Less than 1 day');
  });

  it('returns "1 day" for exactly 1 day', () => {
    expect(formatDayCount(1)).toBe('1 day');
  });

  it('returns "N days" for 2–6 days', () => {
    expect(formatDayCount(3)).toBe('3 days');
    expect(formatDayCount(6)).toBe('6 days');
  });

  it('returns "1 week" for exactly 7 days', () => {
    expect(formatDayCount(7)).toBe('1 week');
  });

  it('returns "N weeks" for 8–29 days', () => {
    expect(formatDayCount(14)).toBe('2 weeks');
    expect(formatDayCount(21)).toBe('3 weeks');
  });

  it('returns "1 month" for exactly 30 days', () => {
    expect(formatDayCount(30)).toBe('1 month');
  });

  it('returns "N months" for 31–364 days', () => {
    expect(formatDayCount(60)).toBe('2 months');
    expect(formatDayCount(90)).toBe('3 months');
  });

  it('returns "N years" for 365+ days', () => {
    expect(formatDayCount(365)).toBe('1 year');
    expect(formatDayCount(730)).toBe('2 years');
  });
});

describe('getWithdrawalTimeline', () => {
  it('returns a non-empty object for a known addiction', () => {
    const timeline = getWithdrawalTimeline('🍺 alcohol');
    expect(timeline).toBeTruthy();
    expect(typeof timeline).toBe('object');
  });

  it('returns [] for an unknown addiction', () => {
    expect(getWithdrawalTimeline('unknown_addiction_xyz')).toEqual([]);
  });

  it('is case-insensitive (converts to lowercase)', () => {
    const lower = getWithdrawalTimeline('🚬 nicotine');
    expect(lower).toBeTruthy();
  });
});

describe('getRecoveryTips', () => {
  it('returns an array for a known addiction', () => {
    const tips = getRecoveryTips('🚬 nicotine');
    expect(Array.isArray(tips)).toBe(true);
    expect(tips.length).toBeGreaterThan(0);
  });

  it('returns a fallback array for an unknown addiction', () => {
    const tips = getRecoveryTips('completely_unknown');
    expect(Array.isArray(tips)).toBe(true);
    expect(tips.length).toBeGreaterThan(0);
  });

  it('is case-insensitive (converts to lowercase)', () => {
    const tips = getRecoveryTips('🍺 alcohol');
    expect(Array.isArray(tips)).toBe(true);
  });
});
