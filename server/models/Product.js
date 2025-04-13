const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
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
  },
  color: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

module.exports = Product;