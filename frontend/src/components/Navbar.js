import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ postCount = 0, theme, onThemeToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Session terminated.");
    navigate("/");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-prefix">$ RUN</span>
          <span className="brand-name">THE<span className="brand-accent">BLOG</span></span>
        </Link>
      </div>

      {/* Desktop nav — hidden on mobile */}
      <div className="navbar-right">
        <div className="status-dot">
          <span className="dot" />
          CONNECTED
        </div>
        <span className="post-count-badge">{postCount} POSTS</span>
        <button className="theme-toggle" onClick={onThemeToggle}>
          {theme === "dark" ? "☀ LIGHT" : "☾ DARK"}
        </button>
        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin" className="nav-link admin-nav-link">⚡ ADMIN</Link>
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

      {/* Mobile right side — post count + hamburger */}
      <div className="mobile-nav-right">
        <span className="post-count-badge">{postCount} POSTS</span>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="theme-toggle mobile-menu-item" onClick={() => { onThemeToggle(); closeMenu(); }}>
            {theme === "dark" ? "☀ LIGHT" : "☾ DARK"}
          </button>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className="nav-link admin-nav-link mobile-menu-item" onClick={closeMenu}>
                  ⚡ ADMIN
                </Link>
              )}
              <span className="navbar-user mobile-menu-item">[ {user.username} ]</span>
              <button className="btn btn-logout mobile-menu-item" onClick={handleLogout}>logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link mobile-menu-item" onClick={closeMenu}>login</Link>
              <Link to="/register" className="btn btn-sm btn-primary mobile-menu-item" onClick={closeMenu}>register</Link>
            </>
          )}
        </div>
      )}

    </nav>
  );
};

export default Navbar;