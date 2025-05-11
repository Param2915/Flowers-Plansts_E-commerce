const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact - add a new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, occasion, budget, message } = req.body;
    const newContact = await Contact.create({
      name,
      email,
      occasion,
      budget,
      message,
    });
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Failed to save contact message' });
  }
});

// GET /api/contact - fetch all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.findAll();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

module.exports = router;
