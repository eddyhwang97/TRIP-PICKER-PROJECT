// 지오코딩 컨트롤러
const { fetchGoogleAPI } = require('../utils/fetchGoogleAPI');

exports.getGeocode = async (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) return res.status(400).json({ error: 'lat, lng 필요' });

  const params = new URLSearchParams({
    latlng: `${lat},${lng}`,
    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    language: 'ko',
  });

  try {
    const data = await fetchGoogleAPI(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Google Geocoding API 호출 실패', detail: error.message });
  }
};