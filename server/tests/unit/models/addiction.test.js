const mongoose = require('mongoose');
const Addiction = require('../../../models/Addiction');

describe('Addiction model', () => {
  describe('instance methods', () => {
    it('getDaysStopped returns the number of days since stop date', () => {
      const daysAgo = 10;
      const stopDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const addiction = new Addiction({
        userId: new mongoose.Types.ObjectId(),
        name: '🍺 Alcohol',
        stopDate,
        frequencyPerDay: 2,
        moneySpentPerDay: 10,
      });
      // Allow ±1 day tolerance due to sub-day precision
      expect(addiction.getDaysStopped()).toBeGreaterThanOrEqual(daysAgo - 1);
      expect(addiction.getDaysStopped()).toBeLessThanOrEqual(daysAgo);
    });

    it('getTotalMoneySaved returns days * moneySpentPerDay', () => {
      const daysAgo = 5;
      const stopDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const addiction = new Addiction({
        userId: new mongoose.Types.ObjectId(),
        name: '🍺 Alcohol',
        stopDate,
        frequencyPerDay: 1,
        moneySpentPerDay: 20,
      });
      const daysStopped = addiction.getDaysStopped();
      expect(addiction.getTotalMoneySaved()).toBe(daysStopped * 20);
    });
  });

  describe('required fields validation', () => {
    it('fails validation when required fields are missing', async () => {
      const addiction = new Addiction({});
      await expect(addiction.validate()).rejects.toThrow();
    });

    it('passes validation when all required fields are present', async () => {
      const addiction = new Addiction({
        userId: new mongoose.Types.ObjectId(),
        name: '🚬 Nicotine',
        stopDate: new Date(),
        frequencyPerDay: 20,
        moneySpentPerDay: 8,
      });
      await expect(addiction.validate()).resolves.toBeUndefined();
    });
  });
});
