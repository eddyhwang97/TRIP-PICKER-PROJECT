export default function handler(req, res) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY; // 환경 변수에서 API 키 읽기
  console.log("Google Maps API Key:", apiKey); // 디버깅용 로그
  if (!apiKey) {
    return res.status(500).json({ error: "Google API Key not set on server." });
  }
  res.status(200).json({ apiKey });
}