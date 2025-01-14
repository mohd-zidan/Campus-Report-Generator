const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { generateChartImage } = require('../utils/chartUtils'); // Import chart utility

const generatePDF = async (data) => {
  const reportsDir = path.join(__dirname, '../../reports');

  // Ensure the directory exists
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filePath = path.join(reportsDir, `report-${data.sub_org_id}.pdf`);
  const doc = new PDFDocument();

  // Pipe the PDF to the file
  doc.pipe(fs.createWriteStream(filePath));

  // Add text content
  doc.fontSize(18).text(`Report for ${data.sub_org_name}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Events Conducted: ${data.events_conducted}`);
  doc.text(`Total Members: ${data.total_members}`);
  doc.text(`New Members: ${data.new_members}`);
  doc.moveDown();

  // Generate and embed chart
  const chartPath = await generateChartImage(data);
  if (fs.existsSync(chartPath)) {
    doc.image(chartPath, { align: 'center', width: 400 });
    doc.moveDown();
  } else {
    doc.text('Chart could not be generated.', { align: 'center' });
  }

  // Finalize the document
  doc.end();

  console.log(`Generated PDF for ${data.sub_org_name}: ${filePath}`);
  return filePath;
};

module.exports = { generatePDF };
