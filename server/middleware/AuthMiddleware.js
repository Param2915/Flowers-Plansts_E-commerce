const jwt = require("jsonwebtoken");
const DB = require("../config/db");

// Middleware to verify token and attach user role
const AuthMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    try {
        if (!token) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Fetch user role from the database
        const query = "SELECT role FROM users WHERE id = ?";
        DB.query(query, [req.user.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (result.length > 0) {
                req.user.role = result[0].role;
                next();
            } else {
                return res.status(401).json({ message: "User not found" });
            }
        });

    } catch (error) {
        return res.status(403).json({ message: "Invalid token", error });
    }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
};

module.exports = { AuthMiddleware, isAdmin };