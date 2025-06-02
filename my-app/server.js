require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 추가
const axios = require('axios');

const app = express();

app.use(cors()); // 여기 추가! (모든 origin 허용됨)
app.use(express.json());

app.post('/api/directions', async (req, res) => {
  try {
    const orsRes = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      req.body,
      {
        headers: {
          'Authorization': process.env.OPENROUTESERVICE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(orsRes.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});