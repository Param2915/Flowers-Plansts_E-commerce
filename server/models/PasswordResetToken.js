// models/PasswordResetToken.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PasswordResetToken = sequelize.define("PasswordResetToken", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  otp: { type: DataTypes.STRING, allowNull: false },
  expires_at: { type: DataTypes.DATE, allowNull: false },
}, {
  timestamps: false,
  tableName: 'password_reset_tokens'
});

module.exports = PasswordResetToken;
