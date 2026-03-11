// ─────────────────────────────────────────────
//  models/Post.js  –  Mongoose schema for a blog post
// ─────────────────────────────────────────────
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
  },
  {
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
