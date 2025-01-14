const Resend = require('resend');
const config = require('../config/env');
const resend = new Resend(config.resendApiKey);

const sendEmail = async (email, subject, body, attachmentPath) => {
  try {
    await resend.send({
      to: email,
      from: 'your-email@example.com',
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
