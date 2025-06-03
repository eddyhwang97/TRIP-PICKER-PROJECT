const express = require("express");
const router = express.Router();

// 환경변수에서 API 키를 읽어옴 (서버 실행 시 .env 파일에 GOOGLE_MAPS_API_KEY=... 추가)
router.get("/", (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Google API Key not set on server." });
  }
  // 반드시 JSON 형태로 응답
  res.json({ apiKey });
});

module.exports = router;