const jwt = require('jsonwebtoken');
const auth = require('../../../middleware/auth');

process.env.JWT_SECRET = 'test-secret';

describe('auth middleware', () => {
  const mockNext = jest.fn();

  beforeEach(() => {
    mockNext.mockClear();
  });

  function makeRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  }

  it('calls next() and sets req.user when token is valid', () => {
    const token = jwt.sign({ userId: 'user123' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();

    auth(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toEqual({ userId: 'user123' });
  });

  it('returns 401 when no authorization header is provided', () => {
    const req = { headers: {} };
    const res = makeRes();

    auth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('returns 401 when the token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalid.token.here' } };
    const res = makeRes();

    auth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('returns 401 when the token is expired', () => {
    const token = jwt.sign({ userId: 'user123' }, process.env.JWT_SECRET, { expiresIn: '-1s' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();

    auth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('returns 401 when the token is signed with a different secret', () => {
    const token = jwt.sign({ userId: 'user123' }, 'wrong-secret', { expiresIn: '1h' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();

    auth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
