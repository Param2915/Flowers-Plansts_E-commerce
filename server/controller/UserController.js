const bcrypt = require("bcrypt");
const User = require("../models/User");
const Product = require("../models/Product");
const CartItem = require("../models/CartItem");
const Favorite = require("../models/Favorite");
// const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// const { User, Product, CartItem, Favorite } = require("../models"); // assumes models/index.js exports them

/* ------------------------------------------------------------------
   AUTH FUNCTIONS
-------------------------------------------------------------------*/
const signupUser = async (req, res) => {
  const { name, surname, phone, email, password } = req.body;

  if (!name || !surname || !phone || !email || !password) {
    return res.status(400).json({ message: "Provide all fields" });
  }

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User or email already exists" });
    }

    const hashPW = await bcrypt.hash(password, 10);
    await User.create({ name, surname, phone, email, password: hashPW });

    return res.status(201).json({ message: "Signup successful." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", err });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required." });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password." });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", err });
  }
};

const logoutUser = (_req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful." });
};

const getCurrentUser = async (req, res) => {
  if (!req.user) return res.status(404).json({ message: "User not found." });
  return res.status(200).json(req.user);
};

/* ------------------------------------------------------------------
   CART FUNCTIONS
-------------------------------------------------------------------*/
const addOrUpdateCartItem = async (req, res) => {
  const { product_id, arrangement } = req.body;
  const user_id = req.user.id;

  if (!product_id || !arrangement)
    return res.status(400).json({ message: "Missing product_id or arrangement." });

  // Validate arrangement matches allowed enum values
  const validArrangements = ['vase', 'bouquet', 'basket', 'box', 'single stick'];
  if (!validArrangements.includes(arrangement)) {
    return res.status(400).json({ message: "Invalid arrangement type." });
  }

  // Use transaction for better data integrity
  const t = await sequelize.transaction();

  try {
    // Ensure product exists & grab current price
    const product = await Product.findByPk(product_id, { 
      attributes: ["price", "name"],
      transaction: t
    });
    
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: "Product not found." });
    }

    const price = product.price;

    // Upsert (increment quantity if row already exists)
    const [item, created] = await CartItem.findOrCreate({
      where: { user_id, product_id, arrangement },
      defaults: { price, quantity: 1 },
      transaction: t
    });

    if (!created) {
      await item.increment("quantity", { transaction: t });
    }

    // Get updated cart for response
    const updatedCart = await CartItem.findAll({
      where: { user_id },
      include: [{ model: Product, attributes: ["name", "image", "type"] }],
      transaction: t
    });

    await t.commit();
    
    const itemCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = updatedCart.reduce(
      (sum, i) => sum + parseFloat(i.price) * i.quantity, 0
    );

    return res.status(200).json({ 
      message: `${product.name} added to cart.`,
      cart: updatedCart,
      itemCount,
      subtotal
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "This item is already in your cart." });
    }
    
    return res.status(500).json({ message: "Unable to update cart at this time." });
// ADD PRODUCT TO CART
const addProductToCart = async (req, res) => {
  const { user_id, product_id, arrangement, price } = req.body;

  try {
    await ShoppingCartItem.create({ user_id, product_id, arrangement, price });
    return res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    return res.status(500).json({ message: "Database error", error });
  }
};

// GET SHOPPING CART
const getShoppingCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    const items = await CartItem.findAll({
      where: { user_id },
      include: [{ model: Product, attributes: ["name", "image", "type"] }],
      order: [["created_at", "DESC"]],
    });

    const subtotal = items.reduce(
      (sum, i) => sum + parseFloat(i.price) * i.quantity,
      0
    );

    return res.status(200).json({ items, subtotal });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to retrieve cart items at this time." });
  }
};





const decrementCartItem = async (req, res) => {
  const { cart_item_id, remove } = req.body;
  const user_id = req.user.id;

  const t = await sequelize.transaction();

  try {
    const item = await CartItem.findOne({ 
      where: { id: cart_item_id, user_id },
      transaction: t
    });
    
    if (!item) {
      await t.rollback();
      return res.status(404).json({ message: "Cart item not found." });
    }

    // If remove flag is true or quantity is 1, remove the item completely
    if (remove || item.quantity <= 1) {
      await item.destroy({ transaction: t });
    } else {
      // Otherwise just decrement by 1
      await item.decrement("quantity", { transaction: t });
    }

    // Get updated cart for response
    const updatedCart = await CartItem.findAll({
      where: { user_id },
      include: [{ model: Product, attributes: ["name", "image", "type"] }],
      transaction: t
    });

    const itemCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = updatedCart.reduce(
      (sum, i) => sum + parseFloat(i.price) * i.quantity, 0
    );

    await t.commit();
    
    return res.status(200).json({ 
      message: "Cart item updated.",
      cart: updatedCart,
      itemCount,
      subtotal
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ message: "Unable to update cart at this time." });
  }
};




const clearCart = async (req, res) => {
  const user_id = req.user.id;
  
  try {
    await CartItem.destroy({ where: { user_id } });
    return res.status(200).json({ 
      message: "Cart cleared.",
      itemCount: 0,
      subtotal: 0
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to clear cart at this time." });
  }
};

// GET ITEM COUNT
const getItemNumber = async (req, res) => {
  try {
    const count = await CartItem.sum("quantity", {
      where: { user_id: req.user.id },
    });
    return res.status(200).json({ itemCount: count || 0 });
  } catch (err) {
    return res.status(500).json({ message: "Unable to retrieve cart count at this time." });
  }
};

/* ------------------------------------------------------------------
   FAVORITES FUNCTIONS
-------------------------------------------------------------------*/
const addToFavorites = async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.user.id;

  try {
    const exists = await Favorite.findOne({ where: { user_id, product_id } });
    if (exists)
      return res.status(400).json({ message: "Product already in favorites." });

    await Favorite.create({ user_id, product_id });
    return res.status(201).json({ message: "Added to favorites." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database error", err });
  }
};

// GET FAVORITES
const getFavorites = async (req, res) => {
  const user_id = req.user.id;

  try {
    const favorites = await Favorite.findAll({
      where: { user_id },
      include: [{ model: Product }],
    });
    return res.status(200).json(favorites);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database error", err });
  }
};



const getAllProducts = async (req, res) => {
  try {
    console.log('Backend received request with query:', req.query);
    const { search, sort } = req.query;
    
    // Build query based on search term
    let query = {};
    if (search) {
      query = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { category: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    
    // Log the constructed query for debugging
    console.log('Constructed database query:', query);
    
    // Define sort options
    let order = [];
    switch (sort) {
      case 'price-low-high':
        order = [['price', 'ASC']];
        break;
      case 'price-high-low':
        order = [['price', 'DESC']];
        break;
      case 'a-z':
        order = [['name', 'ASC']];
        break;
      case 'z-a':
        order = [['name', 'DESC']];
        break;
      default:
        order = [['id', 'DESC']];
    }
    
    console.log('Sort order:', order);
    
    // Execute the query
    const products = await Product.findAll({
      where: query,
      order: order
    });
    
    console.log(`Found ${products.length} products`);
    
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};


/* ------------------------------------------------------------------ */
module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  addOrUpdateCartItem,
  getShoppingCart,
  decrementCartItem,
  clearCart,
  getItemNumber,
  addToFavorites,
  getFavorites,
  getAllProducts ///////////////////////////
};