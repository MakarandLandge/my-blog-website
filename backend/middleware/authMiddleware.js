const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect: must be logged in
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      // Block banned users from any protected action
      if (req.user.isBanned) {
        return res.status(403).json({ message: "Your account has been banned" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin only: checks role === 'admin' OR username matches ADMIN_USERNAME in .env
const isAdmin = (req, res, next) => {
  const adminUsername = process.env.ADMIN_USERNAME;
  if (
    req.user &&
    (req.user.role === "admin" || req.user.username === adminUsername)
  ) {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};

module.exports = { protect, isAdmin };