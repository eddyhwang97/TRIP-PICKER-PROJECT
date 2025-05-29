const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 4000;

// CORS 허용 및 JSON body 파싱
app.use(cors());
app.use(express.json());

app.post("/api/directions", async (req, res) => {
  console.log("요청 받음:", req.body);
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
          Authorization: "5b3ce3597851110001cf6248631846b4c63c4b48a00a1b942d468684", // 본인 API키로 교체!
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
