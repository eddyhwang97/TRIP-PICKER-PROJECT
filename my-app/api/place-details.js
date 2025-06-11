import { getPlaceDetails } from "../src/controllers/placeDetailsController";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await getPlaceDetails(req, res);
}