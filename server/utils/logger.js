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
  'mongodb_uri',
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

function serializeMeta(meta) {
  if (meta === undefined) {
    return '';
  }

  try {
    return ` ${JSON.stringify(redact(meta))}`;
  } catch (error) {
    return ` ${JSON.stringify({ serializationError: error.message })}`;
  }
}

function createLogger(options = {}) {
  const currentLevel = normalizeLevel(options.level || process.env.LOG_LEVEL);
  const minLevel = LEVELS[currentLevel];
  const sink = options.sink || console;
  const name = options.name || 'app';

  function log(level, message, meta) {
    if (LEVELS[level] > minLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${name}] [${level.toUpperCase()}] ${message}${serializeMeta(meta)}`;

    if (level === 'critical' || level === 'error') {
      sink.error(line);
      return;
    }

    if (level === 'warn') {
      sink.warn(line);
      return;
    }

    sink.log(line);
  }

  return {
    level: currentLevel,
    critical: (message, meta) => log('critical', message, meta),
    error: (message, meta) => log('error', message, meta),
    warn: (message, meta) => log('warn', message, meta),
    info: (message, meta) => log('info', message, meta),
    verbose: (message, meta) => log('verbose', message, meta),
    debug: (message, meta) => log('debug', message, meta),
    child: (childName) => createLogger({ ...options, name: `${name}:${childName}` }),
    redact,
  };
}

module.exports = {
  LEVELS,
  createLogger,
  redact,
};
