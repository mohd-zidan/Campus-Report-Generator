const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const path = require('path');

const generateChartImage = async (data) => {
  const chartCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
  const chartData = {
    labels: ['Events Conducted', 'New Members'],
    datasets: [
      {
        label: 'Analytics',
        data: [data.events_conducted, data.new_members],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };
  const chartPath = path.resolve(`./charts/chart-${data.sub_org_id}.png`);
  const buffer = await chartCanvas.renderToBuffer({ type: 'bar', data: chartData });
  require('fs').writeFileSync(chartPath, buffer);
  return chartPath;
};

module.exports = { generateChartImage };
