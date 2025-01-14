const { Resend } = require('resend');
const config = require('../config/env');

// Initialize Resend with the API key
const resend = new Resend(config.resendApiKey);

const sendEmail = async (email, subject, body, attachmentPath) => {
  try {
    await resend.emails.send({
      from: 'your-email@example.com', // Replace with your verified sender email
      to: email,
      subject,
      text: body,
      attachments: [
        {
          filename: 'report.pdf',
          path: attachmentPath,
        },
      ],
    });
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = { sendEmail };
