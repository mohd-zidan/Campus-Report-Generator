const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { generateChartImage } = require('../utils/chartUtils');

const generatePDF = async (data) => {
  const reportsDir = path.join(__dirname, '../../reports');

  // Ensure the directory exists
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filePath = path.join(reportsDir, `report-${data.sub_org_id}.pdf`);
  console.log(`Generating PDF for ${data.sub_org_name} at: ${filePath}`);

  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc.fontSize(18).text(`Report for ${data.sub_org_name}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Events Conducted: ${data.events_conducted}`);
  doc.text(`Total Members: ${data.total_members}`);
  doc.text(`New Members: ${data.new_members}`);
  doc.moveDown();

  const chartPath = await generateChartImage(data);
  if (fs.existsSync(chartPath)) {
    doc.image(chartPath, { align: 'center', width: 400 });
  } else {
    doc.text('Chart could not be generated.', { align: 'center' });
  }

  doc.end();

  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  console.log(`PDF successfully generated for ${data.sub_org_name}: ${filePath}`);
  return filePath;
};

module.exports = { generatePDF };
