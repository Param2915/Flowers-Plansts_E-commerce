const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Received login request:', email);

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Include role in JWT payload ✅
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, // ✅ Include role in token
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with just the necessary user info ✅
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // ✅ Send role to frontend
      },
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
