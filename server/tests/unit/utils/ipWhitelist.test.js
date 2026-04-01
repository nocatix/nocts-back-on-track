const { isIPInRange, parseCIDR, createIPWhitelistMiddleware } = require('../../../utils/ipWhitelist');

describe('ipWhitelist utils', () => {
  describe('isIPInRange', () => {
    it('returns true for an IP inside a /24 CIDR range', () => {
      expect(isIPInRange('192.168.1.100', '192.168.1.0/24')).toBe(true);
    });

    it('returns false for an IP outside a /24 CIDR range', () => {
      expect(isIPInRange('192.168.2.100', '192.168.1.0/24')).toBe(false);
    });

    it('returns true for a loopback address in 127.0.0.0/8', () => {
      expect(isIPInRange('127.0.0.1', '127.0.0.0/8')).toBe(true);
    });

    it('returns true for an IP inside a /8 range', () => {
      expect(isIPInRange('10.20.30.40', '10.0.0.0/8')).toBe(true);
    });

    it('returns false for an IP outside a /8 range', () => {
      expect(isIPInRange('11.0.0.1', '10.0.0.0/8')).toBe(false);
    });

    it('returns false for an invalid CIDR', () => {
      expect(isIPInRange('192.168.1.1', 'not-valid-cidr')).toBe(false);
    });

    it('returns false for an invalid IP', () => {
      expect(isIPInRange('999.999.999.999', '192.168.1.0/24')).toBe(false);
    });
  });

  describe('parseCIDR', () => {
    it('returns a range object for valid CIDR', () => {
      const result = parseCIDR('192.168.2.0/24');
      expect(result).not.toBeNull();
    });

    it('returns null for an invalid CIDR string', () => {
      const result = parseCIDR('invalid');
      expect(result).toBeNull();
    });
  });

  describe('createIPWhitelistMiddleware', () => {
    const mockNext = jest.fn();

    beforeEach(() => {
      mockNext.mockClear();
    });

    it('allows all IPs when no whitelist is configured', () => {
      const middleware = createIPWhitelistMiddleware(null);
      const req = { ip: '1.2.3.4' };
      const res = {};
      middleware(req, res, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('allows a request from a whitelisted IP', () => {
      const middleware = createIPWhitelistMiddleware('127.0.0.0/8');
      const req = { ip: '127.0.0.1' };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      middleware(req, res, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('blocks a request from a non-whitelisted IP', () => {
      const middleware = createIPWhitelistMiddleware('192.168.1.0/24');
      const req = { ip: '8.8.8.8' };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      middleware(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('strips IPv6-mapped IPv4 prefix (::ffff:) before checking', () => {
      const middleware = createIPWhitelistMiddleware('127.0.0.0/8');
      const req = { ip: '::ffff:127.0.0.1' };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      middleware(req, res, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('maps IPv6 loopback (::1) to 127.0.0.1 before checking', () => {
      const middleware = createIPWhitelistMiddleware('127.0.0.0/8');
      const req = { ip: '::1' };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      middleware(req, res, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
