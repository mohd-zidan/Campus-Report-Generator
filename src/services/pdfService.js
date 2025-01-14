const PDFDocument = require('pdfkit');
const fs = require('fs');
const { generateChartImage } = require('../utils/chartUtils');

const generatePDF = async (data) => {
  const doc = new PDFDocument();
  const filePath = `./reports/report-${data.sub_org_id}.pdf`;

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text(`Report for ${data.sub_org_name}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Events Conducted: ${data.events_conducted}`);
  doc.text(`Total Members: ${data.total_members}`);
  doc.text(`New Members: ${data.new_members}`);
  doc.moveDown();

  const chartPath = await generateChartImage(data);
  doc.image(chartPath, { align: 'center', width: 400 });

  doc.end();

  return filePath;
};

module.exports = { generatePDF };