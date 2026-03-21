const Post = require("../models/Post");

// @desc    Get all posts
// @route   GET /posts
// @access  Public
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post
// @route   GET /posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a post
// @route   POST /posts
// @access  Private (requires JWT)
const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ message: "Title, content, and author are required" });
    }

    const post = await Post.create({
      title,
      content,
      author,
      userId: req.user._id, // from JWT middleware
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a post
// @route   PUT /posts/:id
// @access  Private (requires JWT)
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only the creator can update
    if (post.userId && post.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    const { title, content, author } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;
    post.author = author || post.author;

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /posts/:id
// @access  Private (requires JWT)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only the creator can delete
    if (post.userId && post.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};