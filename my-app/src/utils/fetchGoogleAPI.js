const axios = require('axios');

exports.fetchGoogleAPI = async (url) => {
  console.log(url);
  const response = await axios.get(url);
  return response.data;
};