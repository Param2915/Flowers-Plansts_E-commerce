const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import login controller

router.post('/login', authController.login); // POST route for login

module.exports = router;
