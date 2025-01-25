const express = require('express');
const { sendMonthlyReports } = require('./jobs/monthlyReportJob');
const cron = require('node-cron');

const app = express();

// Health check route
app.get('/', (req, res) => {
  res.send('Campus Report Generator is running.');
});

// Trigger route to send reports via email manually
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

// Schedule the monthly report job
cron.schedule('0 0 1 * *', async () => {
  console.log('Running scheduled monthly report job...');
  try {
    await sendMonthlyReports();
    console.log('Monthly reports sent successfully.');
  } catch (error) {
    console.error('Error running scheduled monthly report job:', error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
