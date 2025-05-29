export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const response = await fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
    method: "POST",
    headers: {
      "Authorization": process.env.OPENROUTESERVICE_API_KEY, // 환경변수 사용
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.status(response.status).json(data);
}