process.env.JWT_SECRET = 'test-secret';
process.env.IP_WHITELIST = '127.0.0.0/8';

require('../setup');
const request = require('supertest');
const app = require('../../app');

describe('Auth routes', () => {
  const testUser = {
    username: 'testuser',
    fullName: 'Test User',
    password: 'password123',
  };

  describe('POST /api/auth/register', () => {
    it('registers a new user and returns a token', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.username).toBe(testUser.username);
    });

    it('returns 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'onlyusername' });
      expect(res.status).toBe(400);
    });

    it('returns 409 when username is already taken', async () => {
      await request(app).post('/api/auth/register').send(testUser);
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('logs in with valid credentials and returns a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: testUser.password });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('returns 401 for incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: 'wrongpass' });
      expect(res.status).toBe(401);
    });

    it('returns 401 for unknown username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nobody', password: 'pass' });
      expect(res.status).toBe(401);
    });

    it('returns 400 when fields are missing', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      token = res.body.token;
    });

    it('returns user info for a valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe(testUser.username);
    });

    it('returns 401 when no token is provided', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/auth/profile', () => {
    let token;

    beforeEach(async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      token = res.body.token;
    });

    it('updates the full name', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ fullName: 'Updated Name' });
      expect(res.status).toBe(200);
      expect(res.body.user.fullName).toBe('Updated Name');
    });

    it('returns 400 when fullName is missing', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/auth/change-password', () => {
    let token;

    beforeEach(async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      token = res.body.token;
    });

    it('changes the password successfully', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: testUser.password, newPassword: 'newpass123' });
      expect(res.status).toBe(200);
    });

    it('returns 401 for incorrect current password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'wrongpass', newPassword: 'newpass123' });
      expect(res.status).toBe(401);
    });

    it('returns 400 when new password is too short', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: testUser.password, newPassword: '123' });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/auth/unit-preference', () => {
    let token;

    beforeEach(async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      token = res.body.token;
    });

    it('updates unit preference to metric', async () => {
      const res = await request(app)
        .put('/api/auth/unit-preference')
        .set('Authorization', `Bearer ${token}`)
        .send({ unitPreference: 'metric' });
      expect(res.status).toBe(200);
      expect(res.body.unitPreference).toBe('metric');
    });

    it('returns 400 for an invalid unit preference', async () => {
      const res = await request(app)
        .put('/api/auth/unit-preference')
        .set('Authorization', `Bearer ${token}`)
        .send({ unitPreference: 'stones' });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/auth/profile', () => {
    it('deletes the account', async () => {
      const regRes = await request(app).post('/api/auth/register').send(testUser);
      const token = regRes.body.token;

      const res = await request(app)
        .delete('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });
});
