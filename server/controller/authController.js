const bcrypt = require('bcrypt');
const User = require('../models/User'); 
const jwt = require('jsonwebtoken'); // For generating JWT

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Received login request:', email); // Debugging: log email to check incoming data

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    console.error('Login error:', error); // Logs the full error in the server
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
