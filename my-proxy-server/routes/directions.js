// api/place-details라우터

const express = require('express');
const router = express.Router();
const { getDirections } = require('../controllers/directionsController');

// POST /api/directions
router.post('/', getDirections);

module.exports = router;