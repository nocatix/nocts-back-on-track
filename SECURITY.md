# 🔐 Security & Privacy Documentation

## Overview

"Back on Track" implements security best practices to protect sensitive recovery data. All user data is encrypted, authenticated, and transmitted securely.

> **Last Security Audit**: April 3, 2026 — See [Security Audit Results](#-security-audit-results) for current findings.

## 🛡️ Security Architecture

### Data Classification
- **Sensitive Data** (encrypted at rest):
  - Diary entries (emotional content)
  - Mood notes (personal reflections)
  - Addiction notes (personal triggers and observations)
  - Memory messages (motivational messages)
  - Password hashes (bcryptjs)

- **Protected Data** (requires authentication):
  - Addiction logs and recovery timeline
  - Weight tracking history
  - Achievement records
  - Trophy milestones
  - Personal profile information

- **Public-Safe Data**:
  - Withdrawal timelines (generic education)
  - Recovery tips (non-personalized guidance)
  - Trophy names and descriptions

## 🔒 Encryption at Rest

### Algorithm & Implementation
- **Algorithm**: AES-256-GCM (Advanced Encryption Standard, 256-bit key, Galois/Counter Mode)
- **Authentication**: GCM mode provides authenticated encryption preventing tampering
- **Key Size**: 256-bit (32 bytes) random hex-encoded key
- **IV (Initialization Vector)**: Random 12 bytes per encryption operation

### Encrypted Fields

| Model | Field | Purpose |
|-------|-------|---------|
| Diary | `content` | Personal journal entries |
| Mood | `notes` | Personal mood reflection notes |
| Addiction | `notes` | Personal addiction tracking notes |
| Memory | `message` | Motivational/memory messages |
| User | `password` | Password hash (bcryptjs, not AES) |

### Encryption Process

**Saving Data (Mongoose Pre-Save Hook):**
```
1. Data submitted by user
2. If sensitive field detected → AES-256-GCM encryption
3. Random IV generated + prepended to encrypted data
4. Stored in database: [IV][Encrypted Data]
5. Unencrypted data never persisted
```

**Retrieving Data (Mongoose Post-Find Hook):**
```
1. Retrieve encrypted data from database
2. Extract IV from stored data
3. AES-256-GCM decryption using stored IV
4. Return decrypted data to application
5. User sees readable content only in memory
```

### Key Management

**Generation** (One-time setup):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Generate 64-character hex string (32 bytes)
```

**Storage**:
- Store in `.env` file as `ENCRYPTION_KEY`
- NEVER commit to version control
- NEVER share with unauthorized parties
- Rotate key periodically (requires re-encryption if security breach suspected)

**Rotation** (Best Practice):
- Maintain old key for decryption during transition
- Re-encrypt all data with new key
- Update `.env` with new key
- Verify all data accessible before retiring old key

## 🔑 Authentication & Authorization

### Password Security
- **Algorithm**: bcryptjs with PBKDF2
- **Salt Rounds**: 10 (prevents rainbow table attacks)
- **Hash Storage**: Salted hash only (original password never stored)
- **Minimum Length**: 6 characters (enforced by backend)
- **Password Comparison**: Secure constant-time comparison prevents timing attacks

Example flow:
```
1. User enters password: "MySecurePassword123"
2. bcryptjs generates random salt (cost: 10)
3. Password hashed with salt using PBKDF2
4. Hash stored (e.g., $2b$10$...)
5. On login, incoming password hashed and compared
6. No plaintext comparison
```

### JWT Authentication
- **Algorithm**: HS256 (HMAC-SHA256)
- **Expiration**: Can be set per deployment (e.g., 24 hours)
- **Storage** (Frontend):
  - localStorage key: `token`
  - Sent via Authorization header: `Bearer <token>`
  - HTTP-only cookies for development (not sameSite strict for local network)

### Session Management
- **Token Validation**: Checked on every protected route
- **Invalid/Expired Tokens**: Return 401 Unauthorized
- **Logout**: Client removes token from localStorage
- **Automatic Fetch on Refresh**: AuthContext calls `/api/auth/me` if token exists

## 🌐 Transport Security

### HTTPS/TLS Configuration

**Production Mode**:
- ✅ HTTPS required for all connections
- ✅ Automatic HTTP → HTTPS redirect
- ✅ SSL/TLS certificates from trusted CA
- ✅ HSTS header forces TLS for 31536000 seconds (1 year)

**Development Mode**:
- ✅ HTTP allowed from local network (testing on multiple devices)
- ✅ HTTPS not required from localhost/127.0.0.1
- ✅ Local network ranges permitted: 192.168.x.x, 10.x.x.x, 172.16-31.x.x
- ⚠️ Not suitable for production or external networks

### Security Headers (Helmet.js)

| Header | Purpose | Value |
|--------|---------|-------|
| `X-Content-Type-Options` | Prevent MIME-sniffing | `nosniff` |
| `X-Frame-Options` | Prevent clickjacking | `DENY` |
| `X-XSS-Protection` | Enable browser XSS filter | `1; mode=block` |
| `Strict-Transport-Security` | Enforce HTTPS | `max-age=31536000` |
| `Content-Security-Policy` | Resource loading restrictions | `default-src 'self'` |
| `Referrer-Policy` | Limit referrer data | `no-referrer` |
| `Cross-Origin-Resource-Policy` | Allow cross-origin API use | `false` (disabled) — required for Docker frontend/backend split |

### CORS (Cross-Origin Resource Sharing)

**Development**:
- ✅ Origins allowed:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - Local network IPs via pattern matching (IPv4 and IPv6)
  - IPv6 loopback `::1` and mapped addresses

- ✅ Methods: GET, POST, PUT, DELETE, OPTIONS
- ✅ Credentials: Enabled (for cookie-based auth)
- ✅ Headers: Accept all custom headers

**Production**:
- ✅ Single approved CLIENT_URL origin
- ⚠️ Credentials: Carefully evaluated
- ⚠️ Headers: Whitelist specific headers only

## 🔍 Data Access Control

### Authentication Middleware
```javascript
// Every protected route uses auth middleware
POST /api/addictions → auth → checkToken → req.user populated
```

### User Isolation
- ✅ All queries filtered by `req.user.userId`
- ✅ Users cannot access other users' data
- ✅ Server-side enforcement (not client-side)
- ✅ Direct URL access blocked: `/api/addictions/other-user-id` → 401

Example:
```javascript
// Secure query in route:
const addiction = await Addiction.findById(id);
if (addiction.userId.toString() !== req.user.userId) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

## 📊 Data Retention & Deletion

### User Data Deletion
- **Account Deletion**: Removes user and all associated data
- **Cascade Delete**: Addictions, diary entries, moods, weights, memories, achievements, trophies
- **Permanent**: Deleted data cannot be recovered
- **Encryption**: No residual decryption keys left behind

### Data Backup
- ✅ Recommend MongoDB backup strategy
- ✅ Backups should be encrypted at rest
- ✅ Backup access restricted to authorized personnel only

## 🔧 Deployment Checklist

### Before Production Deployment

- [ ] Generate unique, secure `ENCRYPTION_KEY`
- [ ] Set `NODE_ENV=production`
- [ ] Change `JWT_SECRET` to secure random value
- [ ] Obtain SSL/TLS certificates from trusted CA
- [ ] Configure `.env` with production values:
  ```
  NODE_ENV=production
  MONGODB_URI=production_mongo_url
  JWT_SECRET=production_secret
  ENCRYPTION_KEY=production_encryption_key
  CLIENT_URL=https://yourdomain.com
  PORT=443 (or 8443)
  ```
- [ ] Update CORS origin to approved domain only
- [ ] Enable HTTPS redirect in production
- [ ] Configure security headers via Helmet
- [ ] Set up MongoDB backups
- [ ] Enable MongoDB authentication
- [ ] Use strong database passwords
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting for API endpoints
- [ ] Regular security audits and penetration testing

### Server Security Recommendations

- ✅ Keep Node.js and dependencies up to date
- ✅ Regular `npm audit` checks and updates
- ✅ Use process manager (PM2, systemd) for production
- ✅ Implement API rate limiting
- ✅ Monitor for unusual access patterns
- ✅ Set up automated security alerts
- ✅ Regular backups with encryption
- ✅ Separate dev/staging/production environments
- ✅ Principle of least privilege for database users

## 🔄 Encryption Key Rotation

### When to Rotate
- Suspected key compromise
- Yearly maintenance schedule
- Major version upgrades
- Employee with key access leaves organization

### Rotation Process
```
1. Generate new encryption key
2. Create temporary dual-key decryption support
3. Deploy with both old and new keys
4. Run encryption rotation script:
   - Decrypt all data with old key
   - Re-encrypt all data with new key
5. Verify all data is accessible
6. Remove old key from production
7. Archive old key securely (audit trail)
8. Verify system operates normally
```

## 📋 Compliance & Privacy

### Data Privacy Principles
- ✅ **Minimization**: Only collect necessary data
- ✅ **Purpose Limitation**: Data used only for stated recovery purpose
- ✅ **Transparency**: Users know what data is collected
- ✅ **User Control**: Users can delete data anytime
- ✅ **Security**: Data encrypted, authenticated, access-controlled

### GDPR Compliance (where applicable)
- ✅ **Right to Access**: Users can view their data
- ✅ **Right to Erasure**: Users can delete accounts and data
- ✅ **Right to Portability**: Data can be exported
- ✅ **Lawful Basis**: Medical/health recovery purpose
- ✅ **Privacy Policy**: Transparent data handling

## 🚨 Security Incident Response

### Incident Types & Actions
| Incident | Action |
|----------|--------|
| Unauthorized Access Attempt | Investigation + audit logs + multi-factor review |
| Database Breach (Encrypted Data) | Data remains protected, assess key compromise risk |
| Encryption Key Compromise | Immediately rotate keys + re-encrypt all data |
| Password Breach | Force password reset for affected users |
| SSL/TLS Certificate Expiration | Renew immediately before expiration |

### Reporting
- Document all incidents
- Log timestamp, type, impact, resolution
- Maintain audit trail for compliance
- Review incidents quarterly for patterns

## 🧪 Testing Security

### Recommended Security Tests
```bash
# Dependency vulnerability scan
npm audit

# Update vulnerable packages
npm audit fix

# Code quality check
npm run lint

# Manual testing
- Attempt to access non-owned resources
- Try modifying encrypted data directly
- Test JWT expiration handling
- Verify CORS blocks unauthorized origins
- Check missing auth token handling
```

## 📞 Security Contact

For security vulnerabilities, please report responsibly:
1. Do NOT publish vulnerability publicly
2. Email: [security contact for project]
3. Include: description, steps to reproduce, impact
4. No responsible disclosure required; good faith appreciated

## 📚 Additional Resources

- [OWASP Top 10 Application Security Risks](https://owasp.org/Top10/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [GDPR Compliance Guide](https://gdpr-info.eu/)

---

## 🔍 Security Audit Results

**Audit Date**: April 3, 2026
**Scope**: Server, web client, mobile app, infrastructure (Docker, CI/CD)
**Methodology**: Manual static analysis across all source code, configuration files, and deployment manifests.

### Summary

| Severity | Server | Client | Mobile | Total |
|----------|--------|--------|--------|-------|
| 🔴 Critical | 4 | 4 | 9 | **17** |
| 🟠 High | 7 | 5 | 7 | **19** |
| 🟡 Medium | 7 | 5 | 2 | **14** |
| 🔵 Low | 4 | 1 | 0 | **5** |
| **Total** | **22** | **15** | **18** | **55** |

---

### 🔴 Critical Findings

#### S-01: Hardcoded Database Credentials in Docker Compose
- **Files**: `docker-compose.yml`, `docker-compose-ghcr.yml`
- **OWASP**: A02:2021 – Cryptographic Failures
- **Issue**: MongoDB credentials (`tracker_user:tracker_password`) and JWT secret (`your-secret-key-change-in-production`) are hardcoded in version-controlled files.
- **Fix**: Use `.env` files excluded from Git or Docker secrets. Generate strong random values for each deployment.

#### S-02: Non-Persistent Encryption Key Generation
- **File**: `server/utils/encryption.js` (line 5)
- **OWASP**: A02:2021 – Cryptographic Failures
- **Issue**: If `ENCRYPTION_KEY` env var is unset, a random key is generated per startup. Previously encrypted data (diary, moods, notes) becomes **permanently unreadable** after restart.
- **Fix**: Require the env var at startup — throw an error if missing instead of generating a fallback.

#### S-03: Missing Rate Limiting on Authentication
- **Files**: `server/routes/auth.js` (login, register endpoints)
- **OWASP**: A07:2021 – Identification and Authentication Failures
- **Issue**: No rate limiting on `/api/auth/login` and `/api/auth/register`, enabling unlimited brute-force attempts.
- **Fix**: Add `express-rate-limit` (e.g., 5 attempts per 15 minutes on login).

#### S-04: Overly Permissive Default IP Whitelist
- **File**: `server/index.js` (line 78)
- **OWASP**: A01:2021 – Broken Access Control
- **Issue**: Default IP whitelist includes `::/0`, which permits **any** IPv6 address.
- **Fix**: Remove `::/0` from the default. Only allow `::1/128` for IPv6 loopback.

#### C-01: XSS via dangerouslySetInnerHTML
- **File**: `client/src/pages/Diary.js` (line 176)
- **OWASP**: A03:2021 – Injection
- **Issue**: User diary content rendered via `dangerouslySetInnerHTML` with a basic markdown parser that does not sanitize HTML/JS. Allows `<script>`, `<img onerror>` injection.
- **Fix**: Sanitize output with `DOMPurify` before rendering: `DOMPurify.sanitize(parseMarkdown(content))`.

#### C-02: JWT Token Stored in localStorage
- **Files**: `client/src/context/AuthContext.js`, `client/src/pages/Login.js`, `client/src/pages/Register.js`
- **OWASP**: A07:2021 – Identification and Authentication Failures
- **Issue**: JWT stored in `localStorage` is accessible to any XSS attack. Combined with C-01, this is a token theft vector.
- **Fix**: Migrate to server-set `HttpOnly; Secure; SameSite=Strict` cookies.

#### C-03: Insecure Cookie Flags
- **File**: `client/src/utils/cookieHelper.js` (line 6)
- **OWASP**: A02:2021 – Cryptographic Failures
- **Issue**: Auth cookies created without `HttpOnly`, `Secure`, or `SameSite` flags. Accessible to JavaScript (XSS), sent over HTTP (MITM), and vulnerable to CSRF.
- **Fix**: Add `SameSite=Strict;Secure` to client cookies. For auth tokens, rely on server-set `HttpOnly` cookies instead.

#### C-04: Hardcoded API URLs Bypassing Config
- **Files**: `client/src/pages/Achievements.js`, `client/src/pages/Mood.js`, `client/src/pages/Weight.js`
- **OWASP**: A05:2021 – Security Misconfiguration
- **Issue**: Several pages use `const API_BASE_URL = 'http://localhost:5000'` with raw `fetch()`, bypassing the centralized `axiosConfig.js` and its error-handling interceptors.
- **Fix**: Replace all `fetch()` calls with the configured `apiClient`.

#### M-01: Hardcoded JWT Secret in Mobile Source
- **File**: `mobile/src/utils/jwtHelper.js` (line 4)
- **OWASP**: A02:2021 – Cryptographic Failures
- **Issue**: `const JWT_SECRET = 'noctsBackOnTrackLocalSecret123!@#'` is hardcoded in source, visible in Git history and decompiled APKs. Allows anyone to forge valid tokens.
- **Fix**: Derive secret from device-specific secure storage, or remove client-side JWT signing entirely.

#### M-02: Passwords Stored as Base64 (Not Hashed)
- **File**: `mobile/src/services/localAuthService.js` (lines 27, 47)
- **OWASP**: A02:2021 – Cryptographic Failures
- **Issue**: Passwords stored using `btoa(password)` — Base64 encoding, not cryptographic hashing. Trivially reversible.
- **Fix**: Use `bcryptjs` (already in package.json): `bcrypt.hash(password, 10)`.

#### M-03: Encryption Uses Base64 Instead of AES
- **File**: `mobile/src/utils/encryption.js` (lines 10-17)
- **OWASP**: A02:2021 – Cryptographic Failures
- **Issue**: `encrypt()` returns `Buffer.from(text).toString('base64')` with empty IV and authTag. All "encrypted" fields (diary, notes, preferences) are readable with zero effort.
- **Fix**: Implement actual AES-256-GCM using `expo-crypto` or `react-native-crypto`.

#### M-04: Silent Fallback to Unencrypted Storage
- **File**: `mobile/src/utils/encryption.js` (lines 40-47)
- **OWASP**: A04:2021 – Insecure Design
- **Issue**: If `SecureStore` fails, tokens silently fall back to unencrypted `AsyncStorage`.
- **Fix**: Fail loudly — throw an error instead of silently degrading security.

#### M-05: User Data in Unencrypted AsyncStorage
- **File**: `mobile/src/api/authService.js` (lines 41-43, 83-85)
- **OWASP**: A04:2021 – Insecure Design
- **Issue**: Entire user objects (username, fullName, preferences) stored as plaintext JSON in `AsyncStorage`.
- **Fix**: Store only minimal identifiers; encrypt PII or use `SecureStore`.

#### M-06: Hardcoded Guest Credentials / Auto-Auth
- **File**: `mobile/src/context/AuthContext.js` (lines 42-53)
- **OWASP**: A07:2021 – Identification and Authentication Failures
- **Issue**: App auto-authenticates with `login('guest', 'guest')` or `register('guest', 'Guest User', 'guest')`. All standalone instances share the same credentials.
- **Fix**: Generate device-unique credentials or require explicit user setup on first launch.

#### M-07: Biometric Lock State in Unencrypted Storage
- **File**: `mobile/src/context/BiometricContext.js` (lines 54-56)
- **OWASP**: A04:2021 – Insecure Design
- **Issue**: Biometric enabled/disabled flag stored in `AsyncStorage`. Attackers with device access can modify it to disable biometric lock.
- **Fix**: Store biometric state in `SecureStore`.

#### M-08: No Certificate Pinning
- **Files**: `mobile/src/api/axiosConfig.js`, `mobile/src/pages/ServerConfigScreen.js`
- **OWASP**: A02:2021 – Cryptographic Failures
- **Issue**: No SSL/TLS certificate pinning. Combined with user-configurable server URL, any MITM attacker can intercept traffic.
- **Fix**: Implement certificate pinning; enforce HTTPS-only connections.

#### M-09: User-Configurable Server URL Enables Credential Harvesting
- **File**: `mobile/src/pages/ServerConfigScreen.js` (lines 50-90)
- **OWASP**: A07:2021 – Identification and Authentication Failures
- **Issue**: Users can configure the server URL to any value. Credentials and tokens are sent to whatever URL is configured, enabling phishing/credential harvesting via a fake server.
- **Fix**: Only allow URLs from a hardcoded trusted list or use certificate pinning to validate the server.

---

### 🟠 High Findings

#### S-05: Mass Assignment in Addiction Update
- **File**: `server/routes/addictions.js` (line 82)
- **OWASP**: A01:2021 – Broken Access Control
- **Issue**: `PUT /api/addictions/:id` spreads `req.body` directly, allowing update of any field including sensitive ones like `userId`.
- **Fix**: Destructure and whitelist allowed fields explicitly.

#### S-06: Inconsistent Auth Middleware
- **Files**: `server/routes/diary.js`, `server/routes/preparation.js` (lines 8-18)
- **OWASP**: A07:2021 – Identification and Authentication Failures
- **Issue**: These routes implement custom `verifyToken` middleware instead of using the shared `server/middleware/auth.js`, creating inconsistency and potential security gaps.
- **Fix**: Use the standard `auth` middleware everywhere.

#### S-07: Missing Input Validation on Date Parameters
- **Files**: `server/routes/weights.js` (lines 32-34), `server/routes/moods.js` (lines 66-67)
- **OWASP**: A03:2021 – Injection
- **Issue**: Year and month parameters parsed without range validation.
- **Fix**: Validate `year` (1900-2100), `month` (1-12) as integers before querying.

#### S-08: Overly Permissive CORS in All Environments
- **File**: `server/index.js` (lines 59-67)
- **OWASP**: A05:2021 – Security Misconfiguration
- **Issue**: Wide-open CORS regex patterns (`/^http:\/\/192\.168\..*/`, `/^http:\/\/10\..*/`) are applied in all environments, not just development.
- **Fix**: Only include local-network origins when `NODE_ENV !== 'production'`.

#### S-09: No imageUrl Validation (SSRF Risk)
- **File**: `server/routes/memories.js`
- **OWASP**: A10:2021 – Server-Side Request Forgery
- **Issue**: `imageUrl` accepted without validation — could reference internal network resources.
- **Fix**: Validate URL protocol is `http:` or `https:` and not an internal IP.

#### S-10: Information Disclosure in Error Responses
- **File**: `server/index.js` (lines 177-182)
- **OWASP**: A04:2021 – Insecure Design
- **Issue**: Stack traces exposed in non-production environments. Default `NODE_ENV` in docker-compose is `development`.
- **Fix**: Ensure docker-compose production files set `NODE_ENV=production`. Sanitize error messages in all modes.

#### S-11: Missing Fieldname Validation in Preparation Routes
- **File**: `server/routes/preparation.js` (line 56)
- **OWASP**: A03:2021 – Injection
- **Issue**: `fieldId` parameter not validated — could allow injection into MongoDB update paths.
- **Fix**: Validate `fieldId` against an allowlist or regex `^[a-zA-Z0-9_-]+$`.

#### C-05: Missing CSRF Protection
- **Files**: All client form submissions
- **OWASP**: A01:2021 – Broken Access Control
- **Issue**: No CSRF tokens on login, register, or any mutation requests. Combined with insecure cookies, this enables cross-site request forgery.
- **Fix**: Implement CSRF token generation on the server and include in all state-changing requests.

#### C-06: Sensitive Data in Console Logs
- **File**: `client/src/pages/Achievements.js` (lines 31-71)
- **OWASP**: A09:2021 – Security Logging and Monitoring Failures
- **Issue**: Full API responses and headers logged to `console.log`, visible in browser dev tools.
- **Fix**: Remove production console.log statements or gate behind `REACT_APP_DEBUG`.

#### C-07: Token Stored in Non-HttpOnly Cookie
- **File**: `client/src/context/AuthContext.js` (lines 14-15)
- **OWASP**: A07:2021 – Identification and Authentication Failures
- **Issue**: Token serialized as JSON in a regular cookie via `setCookie('loginInfo', { token })`. Readable by JavaScript — XSS can exfiltrate it.
- **Fix**: Remove client-side token cookies. Use server-set `HttpOnly` cookies only.

#### C-08: Inconsistent API Client Usage
- **File**: `client/src/pages/Achievements.js` (lines 23-85)
- **OWASP**: A05:2021 – Security Misconfiguration
- **Issue**: Manual `fetch()` calls bypass the `axiosConfig.js` interceptors that handle 401 responses, error sanitization, and token injection.
- **Fix**: Standardize all API calls to use the `apiClient` from `axiosConfig.js`.

#### C-09: File Upload Without Validation
- **File**: `client/src/pages/Memories.js` (lines 56-63)
- **OWASP**: A04:2021 – Insecure Design
- **Issue**: Image upload uses `FileReader.readAsDataURL()` with only HTML `accept="image/*"`. No file type, size, or content validation.
- **Fix**: Validate MIME type against allowlist (`image/jpeg`, `image/png`, `image/webp`) and enforce max size (e.g., 5 MB) before reading.

#### M-10: Extensive Console Logging of Sensitive Data
- **Files**: 29+ occurrences across `mobile/src/`
- **OWASP**: A09:2021 – Security Logging and Monitoring Failures
- **Issue**: Token errors, server URLs, user objects, and system state logged via `console.log` in production builds.
- **Fix**: Strip console calls in production or use a logger that respects `__DEV__`.

#### M-11: SQL Injection Risk in Dynamic Queries
- **Files**: `mobile/src/db/database.js`, `mobile/src/services/localAuthService.js`
- **OWASP**: A03:2021 – Injection
- **Issue**: While current queries use parameterized statements, the pattern of dynamically constructing SQL strings is error-prone. Future changes could introduce injection.
- **Fix**: Enforce parameterized queries exclusively. Consider a query builder or ORM.

#### M-12: Weak Input Validation on Login/Register
- **Files**: `mobile/src/pages/LoginScreen.js`, `mobile/src/pages/RegisterScreen.js`
- **OWASP**: A03:2021 – Injection
- **Issue**: Only basic length checks. No sanitization, unicode normalization, or character restrictions.
- **Fix**: Sanitize inputs. Enforce password complexity requirements matching server policy.

#### M-13: No Client-Side Rate Limiting
- **File**: `mobile/src/api/axiosConfig.js`
- **OWASP**: A07:2021 – Identification and Authentication Failures
- **Issue**: No request throttling — users or attackers can flood the server.
- **Fix**: Add request rate limiting via interceptor or library (e.g., `axios-rate-limit`).

#### M-14: Unvalidated Server Responses
- **File**: `mobile/src/api/authService.js` (lines 38-44)
- **OWASP**: A08:2021 – Software and Data Integrity Failures
- **Issue**: `response.data` stored directly in `AsyncStorage` without schema validation. A compromised or MITM server can inject malformed data.
- **Fix**: Validate response structure before storage.

#### M-15: Biometric Lock Can Be Bypassed
- **File**: `mobile/src/pages/BiometricLockScreen.js` (lines 40-42)
- **OWASP**: A07:2021 – Identification and Authentication Failures
- **Issue**: If auth state is corrupted, the lock screen component returns `null` and app becomes accessible. No fallback PIN.
- **Fix**: Default to locked state. Implement a PIN fallback for when biometric fails.

#### M-16: HTTP Used in Development Config
- **File**: `mobile/.env.local`
- **OWASP**: A02:2021 – Cryptographic Failures
- **Issue**: `EXPO_PUBLIC_API_URL=http://192.168.x.x:5000/api` uses unencrypted HTTP.
- **Fix**: Use HTTPS in all environments. Ensure `.env.local` is in `.gitignore`.

---

### 🟡 Medium Findings

#### S-12: NODE_ENV=development in Docker Compose
- **Files**: `docker-compose.yml`, `docker-compose-ghcr.yml`
- **Issue**: `NODE_ENV: development` disables production security features (HTTPS redirect, error sanitization).
- **Fix**: Default to `production` in compose files; override locally.

#### S-13: Weak Password Policy (6-char minimum)
- **File**: `server/routes/auth.js`
- **Issue**: Only 6-character minimum, no complexity requirements.
- **Fix**: Increase to 8+ characters; require uppercase, digit, and special character.

#### S-14: Missing Numeric Field Validation
- **Files**: `server/routes/addictions.js`, `server/routes/weights.js`
- **Issue**: `frequencyPerDay`, `moneySpentPerDay`, `weight` not validated as positive finite numbers.
- **Fix**: Validate with `Number.isFinite()` and range checks.

#### S-15: 50 MB JSON Body Limit
- **File**: `server/index.js` (lines 37-38)
- **Issue**: `express.json({ limit: '50mb' })` allows very large payloads, potential DoS.
- **Fix**: Reduce to a reasonable size (e.g., 10 MB) based on actual needs.

#### S-16: Missing Audit Logging for Sensitive Operations
- **Files**: `server/routes/auth.js` (account deletion, password change)
- **Issue**: Account deletion and progress reset not logged.
- **Fix**: Add `logger.warn()` for account deletion, password change, and data reset.

#### S-17: Missing Security Headers
- **File**: `server/index.js`
- **Issue**: Missing `Permissions-Policy` and `Referrer-Policy` headers.
- **Fix**: Add `Permissions-Policy: geolocation=(), microphone=()` and `Referrer-Policy: strict-origin-when-cross-origin`.

#### S-18: SSL Certificate Path Not Validated
- **File**: `server/index.js` (lines 164-166)
- **Issue**: `fs.readFileSync()` on cert paths with no existence check — crashes on missing files.
- **Fix**: Check file existence and provide a clear error before `readFileSync`.

#### C-10: Weak Client-Side Password Validation
- **Files**: `client/src/pages/Register.js`, `client/src/pages/Profile.js`
- **Issue**: No complexity requirements enforced on the client.
- **Fix**: Mirror server-side password policy in the UI with feedback.

#### C-11: Missing Content Security Policy
- **Issue**: No CSP headers configured for the client app.
- **Fix**: Configure CSP headers in the server or via `<meta>` tag.

#### C-12: No Client-Side Input Length/Character Validation
- **Files**: `client/src/pages/AddNewAddiction.js`, `client/src/components/SetStopDateModal.js`
- **Issue**: Custom addiction names and notes not validated for length or special characters.
- **Fix**: Enforce max length and sanitize inputs before submission.

#### C-13: Sensitive Data in URL Parameters
- **File**: `client/src/pages/AddictionDetail.js`
- **Issue**: Addiction IDs in URL paths appear in browser history and server logs.
- **Fix**: Acceptable for IDs, but avoid including addiction type names in URLs.

#### C-14: Image Data URL Not Size-Limited
- **File**: `client/src/pages/Memories.js`
- **Issue**: Large images converted to data URLs can exceed the 50 MB body limit or cause browser memory issues.
- **Fix**: Enforce file size limit (e.g., 5 MB) before `FileReader.readAsDataURL()`.

#### M-17: No Secure Data Wipe on Logout
- **File**: `mobile/src/context/ModeContext.js` (lines 102-110)
- **Issue**: Token and user removed from `AsyncStorage` but data may persist in memory or be recovered forensically.
- **Fix**: Clear all app data on logout. Consider overwriting sensitive values before deletion.

#### M-18: No Device Binding for Tokens
- **Files**: All mobile API files
- **Issue**: Stolen tokens can be used on any device. No device fingerprinting.
- **Fix**: Bind tokens to device ID. Validate device on each request.

---

### 🔵 Low Findings

#### S-19: HTTPS Bypass for Local Addresses in Production
- **File**: `server/index.js` (lines 88-99)
- **Issue**: Local network addresses bypass HTTPS redirect even in production mode.
- **Fix**: Only allow HTTP bypass in `development` mode.

#### S-20: Insufficient Request Logging Detail
- **File**: `server/index.js` (lines 47-56)
- **Issue**: Request logs missing `userId` and response size.
- **Fix**: Add `req.user?.userId` and `res.get('content-length')` to log entries.

#### S-21: No API Versioning Strategy
- **File**: `server/index.js`
- **Issue**: API endpoints use `/api/` without version prefix.
- **Fix**: Consider `/api/v1/` prefix for future compatibility.

#### S-22: Missing Unit Preference Validation
- **File**: `server/routes/auth.js`
- **Issue**: Unit preference updates not validated against an allowlist.
- **Fix**: Validate against known unit systems (metric/imperial).

#### C-15: localStorage for UI Preferences
- **Files**: DarkMode, Language, Sidebar state
- **Issue**: Non-sensitive but could be tampered via XSS to cause confusion.
- **Impact**: Low. UI settings only.

---

## 🛠️ Remediation Roadmap

### Phase 1 — Immediate (Critical)

| ID | Action | Files |
|----|--------|-------|
| S-01 | Move secrets out of docker-compose files | `docker-compose*.yml` |
| S-02 | Require `ENCRYPTION_KEY` env var (error if missing) | `server/utils/encryption.js` |
| S-03 | Add `express-rate-limit` to auth endpoints | `server/routes/auth.js` |
| S-04 | Remove `::/0` from default IP whitelist | `server/index.js` |
| C-01 | Add DOMPurify to sanitize diary content | `client/src/pages/Diary.js` |
| C-04 | Replace hardcoded API URLs with `apiClient` | `client/src/pages/Achievements.js`, `Mood.js`, `Weight.js` |
| M-01 | Remove hardcoded JWT secret | `mobile/src/utils/jwtHelper.js` |
| M-02 | Replace Base64 password storage with bcryptjs | `mobile/src/services/localAuthService.js` |
| M-03 | Implement real AES-256-GCM encryption | `mobile/src/utils/encryption.js` |
| M-04 | Remove AsyncStorage fallback for tokens | `mobile/src/utils/encryption.js` |

### Phase 2 — High Priority (This Sprint)

| ID | Action | Files |
|----|--------|-------|
| C-02/C-03 | Migrate to server-set HttpOnly cookies | `client/src/context/AuthContext.js`, `server/routes/auth.js` |
| C-05 | Implement CSRF token handling | Server + all client forms |
| S-05 | Whitelist allowed fields in addiction update | `server/routes/addictions.js` |
| S-06 | Standardize auth middleware across all routes | `server/routes/diary.js`, `preparation.js` |
| S-08 | Restrict CORS to production origin only | `server/index.js` |
| M-06 | Replace hardcoded guest credentials | `mobile/src/context/AuthContext.js` |
| M-08 | Implement certificate pinning | `mobile/src/api/axiosConfig.js` |
| C-06/M-10 | Remove all sensitive console.log statements | Multiple files |

### Phase 3 — Medium Priority (Next Sprint)

| ID | Action | Files |
|----|--------|-------|
| S-13 | Strengthen password policy | `server/routes/auth.js` |
| S-14 | Add numeric and date input validation | `server/routes/addictions.js`, `weights.js`, `moods.js` |
| S-15 | Reduce JSON body size limit | `server/index.js` |
| S-16 | Add audit logging for sensitive operations | `server/routes/auth.js` |
| C-09 | Add client-side file upload validation | `client/src/pages/Memories.js` |
| M-05/M-07 | Move PII and biometric state to SecureStore | `mobile/src/api/authService.js`, `BiometricContext.js` |
| M-15 | Add PIN fallback for biometric lock | `mobile/src/pages/BiometricLockScreen.js` |

---

## ✅ Security Audit Checklist

- [x] Passwords hashed with bcryptjs on server (10 salt rounds)
- [x] Sensitive data encrypted at rest (AES-256-GCM) on server
- [x] HTTPS support for data in transit
- [x] Security headers configured (Helmet.js)
- [x] CORS configured (needs tightening for production)
- [x] Authentication required for sensitive endpoints
- [x] User isolation enforced server-side (userId filter)
- [ ] Rate limiting on authentication endpoints
- [ ] CSRF protection
- [ ] HttpOnly cookie-based token storage
- [ ] Input validation on all numeric/date route parameters
- [ ] DOMPurify for user-generated HTML content
- [ ] Mobile encryption using actual cryptographic algorithms
- [ ] Mobile passwords hashed with bcryptjs
- [ ] Certificate pinning on mobile
- [ ] Audit logging for account deletion and password changes
- [ ] Secrets removed from version-controlled config files

---

**Last Updated**: April 3, 2026
**Version**: 2.0
**Status**: Audit Complete — Remediation In Progress
- [x] SQL injection prevention (using MongoDB)
- [x] CSRF protection recommended (add express-sessions)

## Recommended Additional Security Measures

1. **Rate Limiting**: Prevent brute force attacks
   ```
   npm install express-rate-limit
   ```

2. **Request Validation**: Validate all inputs
   ```
   npm install joi
   ```

3. **Session Management**: Add session timeout
   ```
   npm install express-session
   ```

4. **API Key Rotation**: Implement regular key rotation for encryption keys

5. **Audit Logging**: Log all data access for compliance

## Encryption Key Rotation

To rotate encryption keys:
1. Generate new key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Decrypt all data with old key
3. Re-encrypt with new key
4. Update ENCRYPTION_KEY in environment
5. Verify all data is accessible

## Support
For security concerns or vulnerabilities, please report privately before public disclosure.
