const express = require('express');
const path = require('path');
const fs = require('fs');
const { fetchSubOrgData } = require('./services/apiService');
const { generatePDF } = require('./services/pdfService');
const { sendMonthlyReports } = require('./jobs/monthlyReportJob');
const archiver = require('archiver');

const app = express();

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running.');
});

// Trigger route to send reports via email
app.post('/trigger-reports', async (req, res) => {
  try {
    console.log('Triggering report emails...');
    await sendMonthlyReports();
    res.status(200).send('Reports have been emailed successfully.');
  } catch (error) {
    console.error('Error triggering report emails:', error.message);
    res.status(500).send('Failed to send reports via email.');
  }
});

// Download route to generate and download reports
app.get('/download-reports', async (req, res) => {
  try {
    console.log('Generating reports for download...');
    const data = await fetchSubOrgData();

    // Create a ZIP file
    const zip = archiver('zip');
    const zipPath = './reports.zip';
    const output = fs.createWriteStream(zipPath);
    zip.pipe(output);

    // Generate PDFs for each sub-org and add them to the ZIP
    for (const subOrg of data) {
      const pdfPath = await generatePDF(subOrg);
      zip.file(pdfPath, { name: `${subOrg.sub_org_name}_report.pdf` });
    }

    zip.finalize();

    output.on('close', () => {
      res.download(zipPath, 'reports.zip', (err) => {
        if (err) {
          console.error('Error during file download:', err.message);
          res.status(500).send('Failed to download reports.');
        }

        // Cleanup the temporary ZIP file
        fs.unlinkSync(zipPath);
      });
    });
  } catch (error) {
    console.error('Error generating reports:', error.message);
    res.status(500).send('Failed to generate reports.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
