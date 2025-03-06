const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const UserAuth = require("./routes/UserRoute");
const cookieParser = require("cookie-parser");
const ProductRoute = require("./routes/ProductRoute");
const path = require("path");
const nodemailer = require("nodemailer");

require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", UserAuth);
app.use("/api/products", ProductRoute);

app.listen(5000, () => {
  console.log("server listening on port 5000");
});