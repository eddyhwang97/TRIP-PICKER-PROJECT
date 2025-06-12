import { getGeocode } from "../src/controllers/geocodeController";

export default async function handler(req, res) {
  console.log(req.method);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await getGeocode(req, res);
}