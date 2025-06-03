const axios = require('axios');

exports.fetchGoogleAPI = async (url) => {
  const response = await axios.get(url);
  return response.data;
};