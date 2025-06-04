const { fetchGoogleAPI } = require("../utils/fetchGoogleAPI");

// 서버 geocodeController.js
exports.getGeocode = async (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) return res.status(400).json({ error: "lat, lng 필요" });

  // const params = new URLSearchParams({
  //   latlng: `${lat},${lng}`,
  //   key: process.env.GOOGLE_MAPS_API_KEY, // 서버 환경변수(프론트가 아님!)
  //   language: 'ko',
  // });
  // console.log(params);

  try {
    const data = await fetchGoogleAPI(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    res.json(data);
    console.log(data);
  } catch (error) {
    res.status(500).json({ error: "Google Geocoding API 호출 실패", detail: error.message });
  }
};
