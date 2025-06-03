// api/place-details 라우터

const express = require('express');
const router = express.Router();
const { getPlaceDetails } = require('../controllers/placeDetailsController');

router.post('/', getPlaceDetails);

module.exports = router;