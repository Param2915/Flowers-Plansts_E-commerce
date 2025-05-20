const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require('./User');
const Product = require('./Product');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'favorites',
  timestamps: false
});

// Define associations
Favorite.belongsTo(User, { foreignKey: 'user_id' });
Favorite.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Favorite;