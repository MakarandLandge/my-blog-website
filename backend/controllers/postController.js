// ─────────────────────────────────────────────
//  controllers/postController.js
//  Business logic for each route handler
// ─────────────────────────────────────────────
const Post = require('../models/Post');

// ── GET /posts  →  Return all posts (newest first) ──
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
};

// ── GET /posts/:id  →  Return a single post ──────────
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
};

// ── POST /posts  →  Create a new post ────────────────
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newPost = await Post.create({ title, content });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

// ── PUT /posts/:id  →  Update a post (future use) ────
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true } // `new: true` returns the updated doc
    );
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
};

// ── DELETE /posts/:id  →  Delete a post (future use) ─
const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };
