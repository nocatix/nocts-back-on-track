import { withdrawalHelper } from '../../utils/withdrawalHelper';

describe('withdrawalHelper.getTimeline', () => {
  it('returns timeline for nicotine', () => {
    const timeline = withdrawalHelper.getTimeline('nicotine');
    expect(timeline).toEqual({ severe: 3, moderate: 7, mild: 14, recovery: 30 });
  });

  it('returns timeline for alcohol', () => {
    const timeline = withdrawalHelper.getTimeline('alcohol');
    expect(timeline).toEqual({ severe: 7, moderate: 14, mild: 30, recovery: 90 });
  });

  it('returns null for an unknown addiction type', () => {
    expect(withdrawalHelper.getTimeline('unknown_type')).toBeNull();
  });
});

describe('withdrawalHelper.getSymptoms', () => {
  it('returns 5 symptoms for nicotine', () => {
    const symptoms = withdrawalHelper.getSymptoms('nicotine');
    expect(Array.isArray(symptoms)).toBe(true);
    expect(symptoms).toHaveLength(5);
    expect(symptoms).toContain('Irritability');
  });

  it('returns 5 symptoms for alcohol', () => {
    const symptoms = withdrawalHelper.getSymptoms('alcohol');
    expect(symptoms).toHaveLength(5);
    expect(symptoms).toContain('Tremors');
  });

  it('returns empty array for unknown addiction type', () => {
    expect(withdrawalHelper.getSymptoms('unknown_type')).toEqual([]);
  });
});

describe('withdrawalHelper.getPhaseByDays — nicotine', () => {
  it('returns "severe" within the severe window (days ≤ 3)', () => {
    expect(withdrawalHelper.getPhaseByDays('nicotine', 1)).toBe('severe');
    expect(withdrawalHelper.getPhaseByDays('nicotine', 3)).toBe('severe');
  });

  it('returns "moderate" within the moderate window (4–7 days)', () => {
    expect(withdrawalHelper.getPhaseByDays('nicotine', 4)).toBe('moderate');
    expect(withdrawalHelper.getPhaseByDays('nicotine', 7)).toBe('moderate');
  });

  it('returns "mild" within the mild window (8–14 days)', () => {
    expect(withdrawalHelper.getPhaseByDays('nicotine', 8)).toBe('mild');
    expect(withdrawalHelper.getPhaseByDays('nicotine', 14)).toBe('mild');
  });

  it('returns "recovery" within the recovery window (15–30 days)', () => {
    expect(withdrawalHelper.getPhaseByDays('nicotine', 15)).toBe('recovery');
    expect(withdrawalHelper.getPhaseByDays('nicotine', 30)).toBe('recovery');
  });

  it('returns "recovered" beyond the recovery window (> 30 days)', () => {
    expect(withdrawalHelper.getPhaseByDays('nicotine', 31)).toBe('recovered');
    expect(withdrawalHelper.getPhaseByDays('nicotine', 365)).toBe('recovered');
  });

  it('returns "unknown" for an unknown addiction type', () => {
    expect(withdrawalHelper.getPhaseByDays('unknown_type', 5)).toBe('unknown');
  });
});

describe('withdrawalHelper.getPhaseDescription', () => {
  it('returns description for "severe"', () => {
    const desc = withdrawalHelper.getPhaseDescription('severe');
    expect(typeof desc).toBe('string');
    expect(desc.length).toBeGreaterThan(0);
    // The description mentions it's the most intense phase
    expect(desc.toLowerCase()).toContain('intense');
  });

  it('returns description for "recovered"', () => {
    const desc = withdrawalHelper.getPhaseDescription('recovered');
    expect(typeof desc).toBe('string');
    expect(desc.toLowerCase()).toContain('congratulations');
  });

  it('returns description for "unknown" phase', () => {
    const desc = withdrawalHelper.getPhaseDescription('unknown');
    expect(typeof desc).toBe('string');
    expect(desc.length).toBeGreaterThan(0);
  });

  it('returns the unknown fallback for an unrecognised phase', () => {
    const knownUnknown = withdrawalHelper.getPhaseDescription('unknown');
    expect(withdrawalHelper.getPhaseDescription('nonexistent_phase')).toBe(knownUnknown);
  });
});

describe('withdrawalHelper.getMotivationalMessage', () => {
  it('returns a message for "severe" phase', () => {
    const msg = withdrawalHelper.getMotivationalMessage('severe', 1);
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('returns a message for "recovered" phase', () => {
    const msg = withdrawalHelper.getMotivationalMessage('recovered', 45);
    expect(msg).toContain('Congratulations');
  });

  it('returns the fallback message for an unknown phase', () => {
    expect(withdrawalHelper.getMotivationalMessage('unknown_phase', 10)).toBe(
      'Keep pushing forward!'
    );
  });
});

describe('withdrawalHelper.calculateDaysSinceStart', () => {
  it('returns a positive integer for a past date', () => {
    const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    const days = withdrawalHelper.calculateDaysSinceStart(pastDate);
    expect(typeof days).toBe('number');
    expect(days).toBeGreaterThan(0);
    expect(Number.isInteger(days)).toBe(true);
  });

  it('returns 0 or more for today', () => {
    const today = new Date().toISOString();
    const days = withdrawalHelper.calculateDaysSinceStart(today);
    // Math.ceil of a near-zero difference may be 0 or 1 depending on timing
    expect(days).toBeGreaterThanOrEqual(0);
  });
});

describe('withdrawalHelper.calculatePercentageComplete', () => {
  it('returns 0 for an unknown addiction type', () => {
    const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(withdrawalHelper.calculatePercentageComplete('unknown_type', pastDate)).toBe(0);
  });

  it('returns a value between 0 and 100 for a known type mid-recovery', () => {
    // nicotine recovery = 30 days; use 15 days in
    const startDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
    const pct = withdrawalHelper.calculatePercentageComplete('nicotine', startDate);
    expect(pct).toBeGreaterThan(0);
    expect(pct).toBeLessThanOrEqual(100);
  });

  it('caps at 100 when past the full recovery window', () => {
    const longAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
    const pct = withdrawalHelper.calculatePercentageComplete('nicotine', longAgo);
    expect(pct).toBe(100);
  });
});
