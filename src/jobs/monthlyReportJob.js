const { fetchSubOrgData } = require('../services/apiService');
const { generatePDF } = require('../services/pdfService');
const { sendEmail } = require('../services/emailService');

const sendMonthlyReports = async () => {
  try {
    const data = await fetchSubOrgData();
    for (const subOrg of data) {
      const pdfPath = await generatePDF(subOrg);
      await sendEmail(subOrg.admin_email, `Monthly Report for ${subOrg.sub_org_name}`, 'Please find the report attached.', pdfPath);
    }
  } catch (error) {
    console.error('Error in monthly report job:', error.message);
  }
};

module.exports = { sendMonthlyReports };