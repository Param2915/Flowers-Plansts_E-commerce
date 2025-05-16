const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Admin = sequelize.define("Admin", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  access_level: {
    type: DataTypes.STRING,
    defaultValue: "full",
  },
}, {
  tableName: "admins",
  timestamps: true,
});

module.exports = Admin;
