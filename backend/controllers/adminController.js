const User = require("../models/User");
const Post = require("../models/Post");

// ─── STATS ────────────────────────────────────────────────────────────────────

// @desc    Get dashboard stats
// @route   GET /admin/stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const adminUsers = await User.countDocuments({ role: "admin" });
    res.json({ totalUsers, totalPosts, bannedUsers, adminUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── USERS ────────────────────────────────────────────────────────────────────

// @desc    Get all users (with hashed password visible for admin)
// @route   GET /admin/users
const getAllUsers = async (req, res) => {
  try {
    // Admin can see everything including hashed password
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user with their posts
// @route   GET /admin/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json({ ...user.toObject(), posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Promote or demote user role
// @route   PUT /admin/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role))
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Prevent removing the hardcoded admin's role
    if (user.username === process.env.ADMIN_USERNAME)
      return res.status(403).json({ message: "Cannot change the root admin's role" });

    user.role = role;
    await user.save();
    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ban or unban a user
// @route   PUT /admin/users/:id/ban
const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.username === process.env.ADMIN_USERNAME)
      return res.status(403).json({ message: "Cannot ban the root admin" });

    user.isBanned = !user.isBanned;
    await user.save();
    res.json({
      message: user.isBanned ? "User banned" : "User unbanned",
      isBanned: user.isBanned,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user and all their posts
// @route   DELETE /admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.username === process.env.ADMIN_USERNAME)
      return res.status(403).json({ message: "Cannot delete the root admin" });

    // Delete all posts by this user
    await Post.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({ message: "User and their posts deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POSTS ────────────────────────────────────────────────────────────────────

// @desc    Get all posts (admin view — full data)
// @route   GET /admin/posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete any post
// @route   DELETE /admin/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Post not found" });

    await post.deleteOne();
    res.json({ message: "Post deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleBanUser,
  deleteUser,
  getAllPosts,
  deletePost,
};