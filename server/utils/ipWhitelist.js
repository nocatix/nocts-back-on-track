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

    const [addr, prefix] = ipaddr.parseCIDR(cidr);
    return { addr, prefix };
  } catch (err) {
    console.error(`Invalid CIDR notation: ${cidr}`, err.message);
    return null;
  }
}

/**
 * Check if an IP address is within a CIDR range
 * @param {string} ip - IP address to check
 * @param {string} cidr - CIDR range (e.g., "192.168.0.0/16")
 * @returns {boolean} True if IP is in range
 */
function isIPInRange(ip, cidr) {
  try {
    // Parse the IP address
    const addr = ipaddr.process(ip);
    
    // Parse CIDR notation
    const parts = cidr.split('/');
    if (parts.length !== 2) {
      console.error(`Invalid CIDR format: ${cidr}`);
      return false;
    }
    
    const rangeAddr = ipaddr.process(parts[0]);
    const prefixLength = parseInt(parts[1], 10);
    
    // Check if the address is in the CIDR range
    return addr.kind() === rangeAddr.kind() && addr.match(rangeAddr, prefixLength);
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
    let clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '';
    
    // Clean up the IP address
    // Remove brackets if present (IPv6)
    clientIP = clientIP.replace(/[\[\]]/g, '');
    // Remove IPv6 prefix if present
    clientIP = clientIP.replace(/^::ffff:/, '');
    // Map IPv6 loopback to IPv4
    if (clientIP === '::1') {
      clientIP = '127.0.0.1';
    }

    console.log(`Incoming request from IP: ${clientIP}`);

    // Check if IP is in any of the whitelisted ranges
    const isAllowed = whitelist.some(cidr => isIPInRange(clientIP, cidr));

    if (!isAllowed) {
      console.warn(`Access denied for IP: ${clientIP}. Not in whitelist.`);
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Your IP address is not whitelisted.',
      });
    }

    console.log(`Access granted for IP: ${clientIP}`);
    next();
  };
}

module.exports = {
  createIPWhitelistMiddleware,
  isIPInRange,
  parseCIDR,
};
