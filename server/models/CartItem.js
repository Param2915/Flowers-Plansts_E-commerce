const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const CartItem = sequelize.define("CartItem", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },
  arrangement: {
    type: DataTypes.ENUM("vase", "bouquet", "basket", "box", "single stick"),
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

User.hasMany(CartItem, { foreignKey: "user_id" });
CartItem.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

module.exports = CartItem;