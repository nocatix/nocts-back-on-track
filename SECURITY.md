# Security Configuration Guide

## Overview
This application implements comprehensive encryption for sensitive data both in transit and at rest.

## Sensitive Data Encrypted at Rest
The following fields are automatically encrypted in the database:
- **Diary entries** - content
- **Mood logs** - notes
- **Addiction notes** - notes  
- **Memory messages** - message

## Encryption Details
- **Algorithm**: AES-256-GCM (Advanced Encryption Standard with 256-bit keys)
- **Authentication**: GCM mode provides authenticated encryption
- **Key Generation**: 256-bit random hex key from environment

## Setup Instructions

### 1. Generate Encryption Key
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/back-on-track
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
ENCRYPTION_KEY=<generated_256_bit_hex_key>
```

### 3. Password Security
- Passwords are hashed using bcryptjs with salt rounds of 10
- Never stored in plain text
- Compared securely during authentication

### 4. Server Security (Production)
For production deployment, the following security features are enabled:

**Security Headers:**
- `X-Content-Type-Options: nosniff` - Prevents MIME-sniffing attacks
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection
- `Strict-Transport-Security` - Forces HTTPS
- `Content-Security-Policy` - Restricts resource loading

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
