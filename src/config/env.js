require('dotenv').config();

const config = {
  apiUrl: process.env.API_URL,
  resendApiKey: process.env.RESEND_API_KEY,
};

module.exports = config;