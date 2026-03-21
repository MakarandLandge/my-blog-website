const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    // Optional: link post to registered user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true, // auto-adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Post", postSchema);