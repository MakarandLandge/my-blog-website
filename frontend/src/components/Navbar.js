import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ postCount = 0, theme, onThemeToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Session terminated.");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <span className="brand-prefix">$ RUN</span>
          <span className="brand-name">THE<span className="brand-accent">BLOG</span></span>
        </Link>
      </div>

      <div className="navbar-right">
        <div className="status-dot">
          <span className="dot" />
          CONNECTED
        </div>

        <span className="post-count-badge">{postCount} POSTS</span>

        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? "☀ LIGHT" : "☾ DARK"}
        </button>

        {user ? (
          <>
            {/* Admin link — only visible to admins */}
            {user.role === "admin" && (
              <Link to="/admin" className="nav-link admin-nav-link">
                ⚡ ADMIN
              </Link>
            )}
            <span className="navbar-user">[ {user.username} ]</span>
            <button className="btn btn-logout" onClick={handleLogout}>logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">login</Link>
            <Link to="/register" className="btn btn-sm btn-primary">register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;