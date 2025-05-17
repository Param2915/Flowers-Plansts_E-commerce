// server/controller/AuthController.js
const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("→ [AuthController] login attempt:", { email, password });

  try {
    // 1) Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("→ [AuthController] no user found for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("→ [AuthController] found user:", {
      id: user.id,
      email: user.email,
      role: user.role,
      pwSample: user.password.slice(0, 10) + "...",
    });

    // 2) Role check
    if (user.role !== "admin") {
      console.log("→ [AuthController] user is not admin, role:", user.role);
      return res.status(403).json({ message: "Access denied: not an admin" });
    }

    // 3) Password check
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("→ [AuthController] password match result:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4) Sign token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("→ [AuthController] issuing JWT token");

    // 5) Return success
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("→ [AuthController] login error:", err);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
