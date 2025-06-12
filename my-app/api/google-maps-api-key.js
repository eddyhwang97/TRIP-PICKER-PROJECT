export default function handler(req, res) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY; // 환경 변수에서 API 키 읽기

  if (!apiKey) {
    return res.status(500).json({ error: "Google API Key not set on server." });
  }
  console.log(apiKey);

  res.status(200).json({ apiKey });
}