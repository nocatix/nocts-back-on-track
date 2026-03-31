const ipaddr = require('ipaddr.js');

/**
 * Parse CIDR notation and convert to IP range
 * @param {string} cidr - CIDR notation (e.g., "192.168.2.0/24")
 * @returns {object} Object with start and end IP addresses
 */
function parseCIDR(cidr) {
  try {
    const parts = cidr.split('/');
    if (parts.length !== 2) {
      throw new Error('Invalid CIDR format. Use: 192.168.2.0/24');
    }

    const range = ipaddr.process(cidr);
    return range;
  } catch (err) {
    console.error(`Invalid CIDR notation: ${cidr}`, err.message);
    return null;
  }
}

/**
 * Check if an IP address is within a CIDR range
 * @param {string} ip - IP address to check
 * @param {string} cidr - CIDR range
 * @returns {boolean} True if IP is in range
 */
function isIPInRange(ip, cidr) {
  try {
    const addr = ipaddr.process(ip);
    const range = ipaddr.process(cidr);
    return addr.match(range);
  } catch (err) {
    console.error(`Error checking IP ${ip} against CIDR ${cidr}:`, err.message);
    return false;
  }
}

/**
 * Create IP whitelist middleware
 * @param {string} whitelistString - Comma-separated CIDR ranges (e.g., "192.168.2.0/24,10.0.0.0/8")
 * @returns {function} Express middleware
 */
function createIPWhitelistMiddleware(whitelistString) {
  if (!whitelistString) {
    console.warn('IP_WHITELIST not configured. All IPs will be allowed.');
    return (req, res, next) => next();
  }

  const whitelist = whitelistString
    .split(',')
    .map(cidr => cidr.trim())
    .filter(cidr => cidr.length > 0);

  console.log(`IP Whitelist configured with ranges:`, whitelist);

  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    // Remove IPv6 prefix if present
    const cleanIP = clientIP.replace(/^::ffff:/, '');

    console.log(`Incoming request from IP: ${cleanIP}`);

    // Check if IP is in any of the whitelisted ranges
    const isAllowed = whitelist.some(cidr => isIPInRange(cleanIP, cidr));

    if (!isAllowed) {
      console.warn(`Access denied for IP: ${cleanIP}. Not in whitelist.`);
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Your IP address is not whitelisted.',
      });
    }

    console.log(`Access granted for IP: ${cleanIP}`);
    next();
  };
}

module.exports = {
  createIPWhitelistMiddleware,
  isIPInRange,
  parseCIDR,
};
