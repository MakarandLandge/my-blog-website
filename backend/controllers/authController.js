const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @route   POST /auth/register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists)
      return res.status(400).json({ message: "Username or email already exists" });

    // If username matches ADMIN_USERNAME in .env, auto-assign admin role
    const role =
      username === process.env.ADMIN_USERNAME ? "admin" : "user";

    const user = await User.create({ username, email, password, role });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
    return res.status(400).json({ message: "Username/email and password are required" });

    const user = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.email }]
    });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    if (user.isBanned)
      return res.status(403).json({ message: "Your account has been banned" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };