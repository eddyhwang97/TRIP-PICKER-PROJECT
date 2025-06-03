// api/directions 라우터

const express = require('express');
const router = express.Router();
const { getGeocode } = require('../controllers/geocodeController');

router.post('/', getGeocode);

module.exports = router;