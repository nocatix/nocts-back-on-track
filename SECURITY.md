# 🔐 Security & Privacy Documentation

## Overview

"Back on Track" implements security best practices to protect sensitive recovery data. All user data is encrypted, authenticated, and transmitted securely.

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

### CORS (Cross-Origin Resource Sharing)

**Development**:
- ✅ Origins allowed:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - Local network IPs via pattern matching

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

**Last Updated**: March 31, 2026
**Version**: 1.0
**Status**: Production Ready


**HTTPS Support:**
- Set `NODE_ENV=production` to enable HTTPS
- Provide SSL certificate and key paths:
  ```
  SSL_KEY_PATH=/path/to/private.key
  SSL_CERT_PATH=/path/to/certificate.crt
  ```

### 5. CORS Configuration
- Restricted to CLIENT_URL origin
- Credentials enabled for secure cross-origin requests
- Only allows necessary HTTP methods (GET, POST, PUT, DELETE)

### 6. API Security
- All sensitive endpoints require authentication token
- Token sent in Authorization header: `Bearer <token>`
- Tokens expire after session
- HTTPS enforced in production

## Data Access Flow

```
1. Client sends request with auth token over HTTPS
   ↓
2. Server verifies token and user identity
   ↓
3. Data retrieved from encrypted database fields
   ↓
4. Server decrypts data with encryption key
   ↓
5. Decrypted data sent back over HTTPS
```

## Best Practices

### For Deployment
1. Use a secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault) for ENCRYPTION_KEY
2. Never commit `.env` files with sensitive keys
3. Use environment variables for all secrets
4. Enable HTTPS with valid SSL certificates
5. Keep dependencies updated for security patches
6. Monitor logs for unauthorized access attempts

### For Development
1. Use `.env.example` as a template
2. Generate new encryption keys for each environment
3. Never share encryption keys
4. Test encryption/decryption locally

## Security Audit Checklist

- [x] Passwords hashed with bcryptjs (10 salt rounds)
- [x] Sensitive data encrypted at rest (AES-256-GCM)
- [x] HTTPS support for data in transit
- [x] Security headers configured
- [x] CORS properly restricted
- [x] Authentication required for sensitive endpoints
- [x] Input validation on routes
- [x] Rate limiting recommended (add express-rate-limit)
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
