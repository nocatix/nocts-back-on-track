require('dotenv').config();
const https = require('https');
const fs = require('fs');
const connectDB = require('./config/database');
const app = require('./app');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

// Start server with HTTPS in production
if (process.env.NODE_ENV === 'production') {
  const privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
  const certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  https.createServer(credentials, app).listen(PORT, () => {
    console.log(`Secure server running on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Development server running on port ${PORT}`);
  });
}
