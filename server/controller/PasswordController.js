const db = require("../config/db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Request OTP
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
    
        const [user] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0) return res.status(404).json({ message: "User not found" });

        
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        await db.promise().query(
            "INSERT INTO password_reset_tokens (email, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp=?, expires_at=?",
            [email, otp, expiresAt, otp, expiresAt]
        );


        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
        });

        res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const [result] = await db.promise().query(
            "SELECT * FROM password_reset_tokens WHERE email = ? AND otp = ? AND expires_at > NOW()",
            [email, otp]
        );

        if (result.length === 0) return res.status(400).json({ message: "Invalid or expired OTP" });

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        
        const [validOTP] = await db.promise().query(
            "SELECT * FROM password_reset_tokens WHERE email = ? AND otp = ? AND expires_at > NOW()",
            [email, otp]
        );

        if (validOTP.length === 0) return res.status(400).json({ message: "Invalid or expired OTP" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        
        await db.promise().query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

        // Delete OTP record
        await db.promise().query("DELETE FROM password_reset_tokens WHERE email = ?", [email]);

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