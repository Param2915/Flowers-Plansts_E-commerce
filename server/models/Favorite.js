const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const Favorite = sequelize.define("Favorite", {
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
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

User.hasMany(Favorite, { foreignKey: "user_id" });
Favorite.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(Favorite, { foreignKey: "product_id" });
Favorite.belongsTo(Product, { foreignKey: "product_id" });

module.exports = Favorite;
