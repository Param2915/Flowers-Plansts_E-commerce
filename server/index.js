const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const UserAuth = require("./routes/UserRoute");
const ProductRoute = require("./routes/ProductRoute");
const RecommendRoute = require("./routes/RecommendRoute");
const ContactRoute = require("./routes/contactRoutes"); // <-- Added Contact Route

require("dotenv").config({ path: "./config/.env" });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", UserAuth);         // Login, register, reset password, etc.
app.use("/api/products", ProductRoute); // Product-related routes
app.use("/api", RecommendRoute);        // Recommendation Model
app.use("/api/contact", ContactRoute);  // Contact form routes ✅

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
