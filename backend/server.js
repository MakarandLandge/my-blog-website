const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const postRoutes  = require("./routes/postRoutes");
const authRoutes  = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/posts", postRoutes);
app.use("/auth",  authRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.json({ message: "Blog API is running" }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });