// server/index.js
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");

// Routes
const UserAuth      = require("./routes/UserRoute");      // Login, register, reset password, etc.
const ProductRoute  = require("./routes/ProductRoute");   // Product-related routes
const RecommendRoute= require("./routes/RecommendRoute"); // Recommendation Model
const ContactRoute  = require("./routes/contactRoutes");  // Contact form routes
const AdminRoutes   = require("./routes/adminRoutes");    // ← New: Admin panel routes
const paymentRoute = require('./routes/paymentRoute');


// Load environment variables
dotenv.config({ path: "./config/.env" });
require('dotenv').config();


// CORS & JSON parsing
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Mount your routes
app.use("/api/auth",      UserAuth);
app.use("/api/products",  ProductRoute);
app.use("/api",           RecommendRoute);
app.use("/api/contact",   ContactRoute);
app.use("/api/admin",     AdminRoutes);  // ← Admin routes (login, dashboard, users, product CRUD)
app.use('/api/payment', paymentRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
