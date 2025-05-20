const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  arrangement: {
    type: DataTypes.ENUM("vase", "bouquet", "basket", "box", "single stick"),
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "products",
  timestamps: false,
});

module.exports = Product;
