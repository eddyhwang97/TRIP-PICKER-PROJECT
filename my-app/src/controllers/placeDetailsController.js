// 장소 상세정보 컨트롤러
const { fetchGoogleAPI } = require('../utils/fetchGoogleAPI');

exports.getPlaceDetails = async (req, res) => {
  const { placeId } = req.body;
  if (!placeId) return res.status(400).json({ error: 'placeId 필요' });

  const params = new URLSearchParams({
    place_id: placeId,
    key: process.env.GOOGLE_MAPS_API_KEY,
    language: 'ko',
  });

  try {
    const data = await fetchGoogleAPI(`https://maps.googleapis.com/maps/api/place/details/json?${params}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Google Place Details API 호출 실패', detail: error.message });
  }
};