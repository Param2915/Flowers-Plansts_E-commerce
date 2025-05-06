const axios = require('axios');

exports.getRecommendations = async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5000/recommend', req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Error calling ML model:", error.message);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};
