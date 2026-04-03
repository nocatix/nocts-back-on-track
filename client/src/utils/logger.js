const LEVELS = {
  critical: 0,
  error: 1,
  warn: 2,
  info: 3,
  verbose: 4,
  debug: 5,
};

const REDACT_KEYS = new Set([
  'password',
  'pwd',
  'token',
  'authorization',
  'jwt',
  'secret',
]);

function normalizeLevel(level) {
  const value = String(level || '').toLowerCase();
  return Object.prototype.hasOwnProperty.call(LEVELS, value) ? value : 'verbose';
}

function redact(value) {
  if (Array.isArray(value)) {
    return value.map(redact);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, innerValue]) => {
        if (REDACT_KEYS.has(key.toLowerCase())) {
          return [key, '[REDACTED]'];
        }
        return [key, redact(innerValue)];
      })
    );
  }

  return value;
}

function createLogger(name) {
  const currentLevel = normalizeLevel(process.env.REACT_APP_LOG_LEVEL);
  const minLevel = LEVELS[currentLevel];

  function log(level, message, meta) {
    if (LEVELS[level] > minLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${name}] [${level.toUpperCase()}] ${message}`;
    const payload = meta === undefined ? undefined : redact(meta);

    if (level === 'critical' || level === 'error') {
      console.error(line, payload);
      return;
    }

    if (level === 'warn') {
      console.warn(line, payload);
      return;
    }

    console.log(line, payload);
  }

  return {
    level: currentLevel,
    critical: (message, meta) => log('critical', message, meta),
    error: (message, meta) => log('error', message, meta),
    warn: (message, meta) => log('warn', message, meta),
    info: (message, meta) => log('info', message, meta),
    verbose: (message, meta) => log('verbose', message, meta),
    debug: (message, meta) => log('debug', message, meta),
  };
}

export default createLogger;
