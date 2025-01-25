const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');

const resend = new Resend(config.resendApiKey);

const sendEmail = async (email, subject, body, attachmentPath) => {
  try {
    const absolutePath = path.resolve(attachmentPath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Attachment not found at path: ${absolutePath}`);
    }

    const fileContent = fs.readFileSync(absolutePath).toString('base64');

    const response = await resend.emails.send({
      from: 'no-reply@tinkerhub.org', // Replace with your verified sender email
      to: [email],
      subject,
      text: body,
      attachments: [
        {
          content: fileContent,
          filename: path.basename(attachmentPath),
        },
      ],
    });

    console.log(`Email sent to ${email}:`, response);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error.message);
    throw error;
  }
};

module.exports = { sendEmail };
