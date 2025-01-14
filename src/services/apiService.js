const axios = require('axios');
const config = require('../config/env');

const fetchSubOrgData = async () => {
  try {
    const response = await axios.get(config.apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error.message);
    throw error;
  }
};

module.exports = { fetchSubOrgData };