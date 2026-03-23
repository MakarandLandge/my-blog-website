import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/admin/AdminPanel";
import UserDetail from "./pages/admin/UserDetail";
import { fetchPosts } from "./api";

import "./App.css";

function AppInner() {
  const [postCount, setPostCount] = useState(0);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("blog-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("blog-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const refreshCount = async () => {
    try {
      const { data } = await fetchPosts();
      setPostCount(data.length);
    } catch {}
  };

  useEffect(() => { refreshCount(); }, []);

  return (
    <div className="app">
      <Toaster
        position="top-right"
        containerStyle={{
          top: 80,
        }}
        toastOptions={{
          duration: 3000,
          className: "custom-toast",
          style: {
            background:     theme === "dark" ? "rgba(20, 20, 20, 0.85)" : "rgba(255, 255, 255, 0.85)",
            color:          theme === "dark" ? "#e8e8e8" : "#111111",
            border:         theme === "dark" ? "1px solid rgba(42,42,42,0.8)" : "1px solid rgba(204,204,204,0.8)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius:   "0",
            fontFamily:     "'JetBrains Mono', 'Courier New', monospace",
            fontSize:       "0.78rem",
            letterSpacing:  "0.05em",
          },
          success: {
            iconTheme: {
              primary:   theme === "dark" ? "#39ff14" : "#1a7a08",
              secondary: theme === "dark" ? "rgba(20,20,20,0.85)" : "rgba(255,255,255,0.85)",
            },
          },
          error: {
            iconTheme: {
              primary:   "#ff3b3b",
              secondary: theme === "dark" ? "rgba(20,20,20,0.85)" : "rgba(255,255,255,0.85)",
            },
          },
        }}
      />

      <Navbar postCount={postCount} theme={theme} onThemeToggle={toggleTheme} />

      <main className="main-content">
        <Routes>
          <Route path="/"         element={<Home onPostCountChange={refreshCount} />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin"    element={<AdminPanel />} />
          <Route path="/admin/users/:id" element={<UserDetail />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <span className="footer-text">
          <span className="react">REACT</span>
          {" • "}
          <span className="express">EXPRESS</span>
          {" • "}
          <span className="mongodb">MONGODB</span>
        </span>
        <span className="footer-text">2026 // SIMPLE BLOG</span>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppInner />
      </Router>
    </AuthProvider>
  );
}

export default App;