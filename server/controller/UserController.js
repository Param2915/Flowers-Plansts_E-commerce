const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const ShoppingCartItem = require("../models/CartItem");
const Favorite = require("../models/Favorite");

const signupUser = async (req, res) => {
  const { name, surname, phone, email, password } = req.body;

  if (!name || !surname || !phone || !email || !password) {
    return res.status(400).json({ message: "provide all area" });
  }

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "username or email already exist" });
    }

    const hashPW = await bcrypt.hash(password, 10);
    await User.create({ name, surname, phone, email, password: hashPW });

    return res.status(200).json({ message: "successful" });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the token and user in the response
    return res.status(200).json({
      message: "Login successful",
      token, // include the token here
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "logout successful" });
};

const getCurrentUser = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).json({ message: "user not found" });
  return res.status(200).json(user);
};

const addProductToCart = async (req, res) => {
  const { user_id, product_id, arrangement, price } = req.body;

  try {
    await ShoppingCartItem.create({ user_id, product_id, arrangement, price });
    return res.status(200).json({ message: "product added" });
  } catch (error) {
    return res.status(500).json({ message: "database error", error });
  }
};

const getShoppingCart = async (req, res) => {
  const { user_id } = req.query;

  try {
    const items = await ShoppingCartItem.findAll({
      where: { user_id },
      include: [Product],
    });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: "database error", error });
  }
};

const deleteShoppingCart = async (req, res) => {
  const { shoppingCartId, user_id } = req.body;

  try {
    await ShoppingCartItem.destroy({ where: { id: shoppingCartId, user_id } });
    return res.status(200).json({ message: "item removed!" });
  } catch (error) {
    return res.status(500).json({ message: "database error", error });
  }
};

const getItemNumber = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: "User ID is required" });

  try {
    const itemCount = await ShoppingCartItem.count({ where: { user_id } });
    return res.status(200).json({ itemCount });
  } catch (error) {
    return res.status(500).json({ message: "Database error", error });
  }
};

const addToFavorites = async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    const exists = await Favorite.findOne({ where: { user_id, product_id } });
    if (exists) {
      return res.status(400).json({ message: "This product is already in your favorites!" });
    }

    await Favorite.create({ user_id, product_id });
    return res.status(200).json({ message: "product added to favorites!" });
  } catch (error) {
    return res.status(500).json({ message: "database error", error });
  }
};

const getFavorites = async (req, res) => {
  const { user_id } = req.query;

  try {
    const favorites = await Favorite.findAll({
      where: { user_id },
      include: [Product],
    });
    return res.status(200).json(favorites);
  } catch (error) {
    return res.status(500).json({ message: "database error", error });
  }
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  addProductToCart,
  getShoppingCart,
  deleteShoppingCart,
  getItemNumber,
  addToFavorites,
  getFavorites,
};












// const bcrypt = require("bcrypt");
// const DB = require("../config/db");
// const jwt = require("jsonwebtoken");

// const signupUser = async (req, res) => {
  
//   const { name, surname, phone, email, password} = req.body;
//   console.log(req.body);

//   if (!name || !surname || !phone || !email || !password) {
//     return res.status(400).json({ message: "provide all area" });
//   }

//   try {
//     const findUser = "select * from users where email=?";
//     const userExists = await new Promise((resolve, reject) => {
//       DB.query(findUser, [email], (err, result) => {
//         if (err) {
//           return reject({ message: "database error" });
//         }
//         resolve(result);
//       });
//     });
//     // console.log("found");

//     if (userExists.length > 0) {
//       return res
//         .status(400)
//         .json({ message: "username or email already exist" });
//     }

//     const hashPW = await bcrypt.hash(password, 10);


//     const query =
//       "insert into users (name,surname,phone,email,password) values(?,?,?,?,?)";
//     await new Promise((resolve, reject) => {
//       DB.query(
//         query,
//         [name, surname, phone, email, hashPW],
//         (err, result) => {
//           if (err) {
//             return reject({ message: "database error", err });
//           }
//           resolve(result);
//         }
//       );
//     });

//     // console.log("query hit");

//     return res.status(200).json({ message: "successful" });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json(error);
//   }
// };

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: "provide all area" });
//   }

//   try {
//     const query = "select * from users where email=?";
//     DB.query(query, [email], async (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: "database error" });
//       }
//       if (result.length < 0) {
//         return res.status(400).json({ message: "user not found" });
//       }
//       const user = result[0];

//       const isMatch = await bcrypt.compare(password, user?.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: "password does not match" });
//       }

//       const token = jwt.sign(
//         {
//           id: user.id,
//           name: user.name,
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );
//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: true,
//         maxAge: 3600000,
//       });
//       return res.status(200).json({
//         message: "login successfull ",
//         user: {
//           id: user.id,
//           name: user.name,
//           surname: user.surname,
//           email: user.email,
//         },
//       });
//     });
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

// const logoutUser = async (req, res) => {
//   res.clearCookie("token");
//   return res.status(200).json({ message: "logout successfull" });
// };

// const getCurrentUser = async (req, res) => {
//   const user = req.user;
//   try {
//     if (!user) {
//       return res.status(400).json({ message: "user not found" });
//     }
//     return res.status(200).json(user);
//   } catch (error) {
//     return res.status(500).json({ message: "server error", error });
//   }
// };

// const addProductToCart = async (req, res) => {
//   const { user_id, product_id, arrangement, price } = req.body;

//   const query =
//     "insert into shopping_cart_items (user_id,product_id,arrangement,price) values(?,?,?,?)";

//   DB.query(query, [user_id, product_id, arrangement, price], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "database error" });
//     }
//     return res.status(200).json({ message: "product added" });
//   });
// };

// const getShoppingCart = async (req, res) => {
//   const { user_id } = req.query;

//   const query = `select p.*, sci.arrangement,sci.id from shopping_cart_items sci join products p on sci.product_id = p.id where sci.user_id = ?`;

//   DB.query(query, [user_id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "database error" });
//     }
//     return res.status(200).json(result);
//   });
// };

// const deleteShoppingCart = async (req, res) => {
//   const { shoppingCartId, user_id } = req.body;

//   const query = "delete from shopping_cart_items where id = ? and user_id = ?";

//   DB.query(query, [shoppingCartId, user_id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "database error" });
//     }
//     return res.status(200).json({ message: "item removed!" });
//   });
// };

// const getItemNumber = async (req, res) => {
//   const { user_id } = req.query;

//   if (!user_id) {
//     return res.status(400).json({ message: "User ID is required" });
//   }

//   const query = "SELECT COUNT(*) AS itemCount FROM shopping_cart_items WHERE user_id = ?;";

//   DB.query(query, [user_id], (err, result) => {
//     if (err) {
//       console.error("Database error:", err.sqlMessage || err);
//       return res.status(500).json({ message: "Database error", error: err.sqlMessage || err });
//     }

//     console.log("Query result:", result); 

//     return res.status(200).json(result[0]); 
//   });
// };


// const addToFavorites = async (req, res) => {
//   const { user_id, product_id } = req.body;

//   const checkQuery =
//     "select * from favorites where user_id = ? and product_id = ?";
//   DB.query(checkQuery, [user_id, product_id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "database error" });
//     }
//     if (result.length > 0) {
//       return res
//         .status(400)
//         .json({ message: "This product is already in your favorites!" });
//     }
//     const query = "insert into favorites (user_id,product_id) values(?,?)";

//     DB.query(query, [user_id, product_id], (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: "database error" });
//       }
//       return res.status(200).json({ message: "product added to favorites!" });
//     });
//   });
// };

// const getFavorites = async (req, res) => {
//   const { user_id } = req.query;

//   const query =
//     "select p.*,f.id from favorites f join products p on f.product_id = p.id where f.user_id = ?";

//   DB.query(query, [user_id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "database error" });
//     }
//     return res.status(200).json(result);
//   });
// };

// module.exports = {
//   signupUser,
//   loginUser,
//   getCurrentUser,
//   logoutUser,
//   addProductToCart,
//   getShoppingCart,
//   deleteShoppingCart,
//   getItemNumber,
//   addToFavorites,
//   getFavorites,
// };