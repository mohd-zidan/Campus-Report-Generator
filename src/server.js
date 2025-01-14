const express = require('express');
const cron = require('node-cron');
const { sendMonthlyReports } = require('./jobs/monthlyReportJob');

const app = express();

// Health check route
app.get('/', (req, res) => {
  res.send('Campus Report Server is running.');
});

// Custom trigger route for manual invocation
app.post('/trigger-reports', async (req, res) => {
  try {
    console.log('Manual trigger initiated.');
    await sendMonthlyReports();
    res.status(200).send('Reports sent successfully.');
  } catch (error) {
    console.error('Error triggering reports manually:', error.message);
    res.status(500).send('Failed to send reports.');
  }
});

// Schedule the job for the 1st of every month at 00:00
cron.schedule('0 0 1 * *', () => {
  console.log('Running monthly report job...');
  sendMonthlyReports();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});