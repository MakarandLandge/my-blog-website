// ─────────────────────────────────────────────
//  server.js  –  Entry point for the backend
// ─────────────────────────────────────────────
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const postRoutes = require('./routes/postRoutes');

const app = express();

// ── Middleware ────────────────────────────────
app.use(cors());                    // Allow requests from the React frontend
app.use(express.json());            // Parse incoming JSON request bodies

// ── Routes ────────────────────────────────────
app.use('/posts', postRoutes);

// ── Health check ──────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '📝 Simple Blog API is running!' });
});

// ── MongoDB Connection ────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/simple-blog';
const PORT      = process.env.PORT      || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
