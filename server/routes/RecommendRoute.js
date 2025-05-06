const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controller/RecommendationController');

router.post('/recommend', getRecommendations);

module.exports = router;
