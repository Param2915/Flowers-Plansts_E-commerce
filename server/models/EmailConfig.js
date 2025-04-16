// models/EmailConfig.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // adjust path to your sequelize instance

const EmailConfig = sequelize.define("EmailConfig", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING, // Ideally this should be encrypted
    allowNull: false,
  },
});

module.exports = EmailConfig;
