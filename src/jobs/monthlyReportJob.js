const { fetchSubOrgData } = require('../services/apiService');
const { generatePDF } = require('../services/pdfService'); // Import correctly
const { sendEmail } = require('../services/emailService');
const fs = require('fs');

const sendMonthlyReports = async () => {
  try {
    const data = await fetchSubOrgData();
    for (const subOrg of data) {
      const pdfPath = await generatePDF(subOrg);

      try {
        await sendEmail(
          subOrg.admin_email,
          `Monthly Report for ${subOrg.sub_org_name}`,
          `<p>Please find the report for ${subOrg.sub_org_name} attached.</p>`,
          pdfPath
        );
      } catch (emailError) {
        console.error(
          `Failed to send email to ${subOrg.admin_email}: ${emailError.message}`
        );
      } finally {
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
        }
      }
    }
  } catch (error) {
    console.error('Error in monthly report job:', error.message);
  }
};

module.exports = { sendMonthlyReports };
