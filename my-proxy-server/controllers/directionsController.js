// 길찾기 컨트롤러
const axios = require('axios');

// directions API 프록시 컨트롤러
exports.getDirections = async (req, res) => {
  try {
    // 프론트에서 보낸 body 통째로 전달
    const response = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      req.body,
      {
        headers: {
          'Authorization': process.env.OPENROUTESERVICE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
    });
  }
};