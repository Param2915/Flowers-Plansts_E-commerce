const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { Op } = require("sequelize");
const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");

dotenv.config();

// Use a static email and password instead of DB config (adjust this if needed)
require("dotenv").config();

const adminEmail = process.env.ADMIN_EMAIL;

// const ADMIN_PASSWORD = "qdsf iyas jjbn aqvy"; // Replace with your Gmail App Password

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PasswordResetToken.upsert({ email, otp, expires_at: expiresAt });

    await transporter.sendMail({
      from: ADMIN_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const token = await PasswordResetToken.findOne({
      where: {
        email,
        otp,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!token) return res.status(400).json({ message: "Invalid or expired OTP" });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const token = await PasswordResetToken.findOne({
      where: {
        email,
        otp,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!token) return res.status(400).json({ message: "Invalid or expired OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update({ password: hashedPassword }, { where: { email } });

    await PasswordResetToken.destroy({ where: { email } });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  forgotPassword,
  verifyOTP,
  resetPassword,
};

