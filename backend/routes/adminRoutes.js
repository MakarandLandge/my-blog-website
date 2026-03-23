const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  getStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleBanUser,
  deleteUser,
  getAllPosts,
  deletePost,
} = require("../controllers/adminController");

// All admin routes require login + admin role
router.use(protect, isAdmin);

// Stats
router.get("/stats", getStats);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/ban", toggleBanUser);
router.delete("/users/:id", deleteUser);
router.get("/users/:id", getUserById);

// Posts
router.get("/posts", getAllPosts);
router.delete("/posts/:id", deletePost);

module.exports = router;