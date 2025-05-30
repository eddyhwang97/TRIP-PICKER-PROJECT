import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { coordinates } = req.body;
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
    return res.status(400).json({ error: "coordinates 배열이 필요합니다." });
  }
  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      { coordinates },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.OPENROUTESERVICE_API_KEY,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
}