const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("→ [AuthController] login attempt:", { email });

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        isAdmin: user.role === "admin" ? true : false,
      },
      token,
    });
  } catch (err) {
    console.error("→ [AuthController] login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
};

// GET CURRENT USER
exports.getCurrentUser = (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).json({ message: "User not found" });
  return res.status(200).json(user);
};
