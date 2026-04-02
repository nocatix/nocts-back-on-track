process.env.JWT_SECRET = 'test-secret';
process.env.IP_WHITELIST = '127.0.0.0/8';

require('../setup');
const request = require('supertest');
const app = require('../../app');

describe('Addictions routes', () => {
  let token;

  const registerAndLogin = async (suffix = '') => {
    const user = {
      username: `addictuser${suffix}`,
      fullName: 'Addict User',
      password: 'password123',
    };
    const res = await request(app).post('/api/auth/register').send(user);
    return res.body.token;
  };

  const addictionPayload = () => ({
    name: '🍺 Alcohol',
    stopDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    frequencyPerDay: 2,
    moneySpentPerDay: 15,
    notes: 'Trying to stay clean',
  });

  beforeEach(async () => {
    token = await registerAndLogin();
  });

  describe('POST /api/addictions', () => {
    it('creates a new addiction', async () => {
      const res = await request(app)
        .post('/api/addictions')
        .set('Authorization', `Bearer ${token}`)
        .send(addictionPayload());
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('🍺 Alcohol');
      expect(res.body).toHaveProperty('_id');
    });

    it('returns 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/addictions')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '🍺 Alcohol' });
      expect(res.status).toBe(400);
    });

    it('returns 401 when not authenticated', async () => {
      const res = await request(app).post('/api/addictions').send(addictionPayload());
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/addictions', () => {
    it('returns an empty array when no addictions exist', async () => {
      const res = await request(app)
        .get('/api/addictions')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns the created addictions', async () => {
      await request(app)
        .post('/api/addictions')
        .set('Authorization', `Bearer ${token}`)
        .send(addictionPayload());

      const res = await request(app)
        .get('/api/addictions')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('🍺 Alcohol');
    });

    it('returns 401 when not authenticated', async () => {
      const res = await request(app).get('/api/addictions');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/addictions/:id', () => {
    it('returns a single addiction by ID', async () => {
      const created = await request(app)
        .post('/api/addictions')
        .set('Authorization', `Bearer ${token}`)
        .send(addictionPayload());

      const res = await request(app)
        .get(`/api/addictions/${created.body._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(created.body._id);
    });

    it('returns 404 for a non-existent ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/addictions/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    it('does not return another user\'s addiction', async () => {
      const otherToken = await registerAndLogin('_other');
      const created = await request(app)
        .post('/api/addictions')
        .set('Authorization', `Bearer ${otherToken}`)
        .send(addictionPayload());

      const res = await request(app)
        .get(`/api/addictions/${created.body._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/addictions/:id', () => {
    it('updates an addiction', async () => {
      const created = await request(app)
        .post('/api/addictions')
        .set('Authorization', `Bearer ${token}`)
        .send(addictionPayload());

      const res = await request(app)
        .put(`/api/addictions/${created.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ moneySpentPerDay: 25 });
      expect(res.status).toBe(200);
      expect(res.body.moneySpentPerDay).toBe(25);
    });

    it('returns 404 for a non-existent addiction', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/addictions/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ moneySpentPerDay: 25 });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/addictions/:id', () => {
    it('deletes an addiction', async () => {
      const created = await request(app)
        .post('/api/addictions')
        .set('Authorization', `Bearer ${token}`)
        .send(addictionPayload());

      const res = await request(app)
        .delete(`/api/addictions/${created.body._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Addiction deleted successfully');
    });

    it('returns 404 when trying to delete a non-existent addiction', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .delete(`/api/addictions/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('calculated fields', () => {
    it('returns daysStopped and totalMoneySaved in the response', async () => {
      const res = await request(app)
        .post('/api/addictions')
        .set('Authorization', `Bearer ${token}`)
        .send(addictionPayload());
      expect(res.body).toHaveProperty('daysStopped');
      expect(res.body).toHaveProperty('totalMoneySaved');
      expect(typeof res.body.daysStopped).toBe('number');
    });

    it('includes addictionType without the emoji', async () => {
      const res = await request(app)
        .post('/api/addictions')
        .set('Authorization', `Bearer ${token}`)
        .send(addictionPayload());
      expect(res.body.addictionType).toBe('Alcohol');
    });
  });
});
