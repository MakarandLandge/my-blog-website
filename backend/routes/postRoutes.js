// ─────────────────────────────────────────────
//  routes/postRoutes.js  –  All /posts endpoints
// ─────────────────────────────────────────────
const express = require('express');
const router  = express.Router();

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

// GET  /posts          → fetch all posts
router.get('/',        getAllPosts);

// GET  /posts/:id      → fetch one post
router.get('/:id',     getPostById);

// POST /posts          → create a new post
router.post('/',       createPost);

// PUT  /posts/:id      → update a post  (ready for future use)
router.put('/:id',     updatePost);

// DELETE /posts/:id    → delete a post  (ready for future use)
router.delete('/:id',  deletePost);

module.exports = router;
