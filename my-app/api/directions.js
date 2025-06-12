import { getDirections } from "../src/controllers/directionsController";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await getDirections(req, res);
}
