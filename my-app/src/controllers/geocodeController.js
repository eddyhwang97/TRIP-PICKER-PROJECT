import { fetchGoogleAPI } from "../utils/fetchGoogleAPI";

export const getGeocode = async (req, res) => {
  const { lat, lng } = req.body;
  console.log(lat, lng);

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat, lng are required" });
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const data = await fetchGoogleAPI(url);
    res.status(200).json(data);
    console.log("Geocode API response:", data);
  } catch (error) {
    res.status(500).json({
      error: "Google Geocoding API 호출 실패",
      detail: error.message,
    });
  }
};
