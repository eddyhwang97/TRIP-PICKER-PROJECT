const axios = require('axios');

exports.getDirections = async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      req.body,
      {
        headers: {
          Authorization: process.env.OPENROUTESERVICE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
    });
  }
};
