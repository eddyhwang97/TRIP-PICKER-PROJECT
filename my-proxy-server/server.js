require("dotenv").config();
const express = require("express");
const cors = require("cors");

const geocodeRoutes = require("./routes/geocode");
const directionsRoutes = require("./routes/directions");
const placeDetailsRoutes = require("./routes/placeDetails");
const googleApiKeyRouter = require("./routes/googleApiKey");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/geocode", geocodeRoutes);
app.use("/api/directions", directionsRoutes);
app.use("/api/place-details", placeDetailsRoutes);
app.use("/api/google-maps-api-key", googleApiKeyRouter);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
