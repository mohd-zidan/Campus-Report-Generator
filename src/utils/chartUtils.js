const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const path = require('path');

const chartCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });

const generateChartImage = async (data) => {
  const chartData = {
    labels: ['Events Conducted', 'New Members', 'Total Members'],
    datasets: [
      {
        label: `${data.sub_org_name} Analytics`,
        data: [data.events_conducted, data.new_members, data.total_members],
        backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0'],
      },
    ],
  };

  const chartConfig = { type: 'bar', data: chartData };

  const chartDir = path.join(__dirname, '../../charts');
  if (!fs.existsSync(chartDir)) {
    fs.mkdirSync(chartDir, { recursive: true });
  }

  const chartPath = path.join(chartDir, `chart-${data.sub_org_id}.png`);
  const buffer = await chartCanvas.renderToBuffer(chartConfig);
  fs.writeFileSync(chartPath, buffer);

  return chartPath;
};

module.exports = { generateChartImage };
