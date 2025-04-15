const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const nodemailer = require("nodemailer");

const UserAuth = require("./routes/UserRoute");
const ProductRoute = require("./routes/ProductRoute");

require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", UserAuth);       // Login, register, reset password, etc.
app.use("/api/products", ProductRoute); // Product-related routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
