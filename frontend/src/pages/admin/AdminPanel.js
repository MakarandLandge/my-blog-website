import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  adminGetStats,
  adminGetUsers,
  adminGetPosts,
  adminDeletePost,
  adminDeleteUser,
  adminToggleBan,
  adminUpdateRole,
} from "../../api";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

// ── Stat Card ─────────────────────────────────
const StatCard = ({ label, value, accent }) => (
  <div className="admin-stat-card">
    <span className="admin-stat-value" style={accent ? { color: "var(--green)" } : {}}>
      {value ?? "—"}
    </span>
    <span className="admin-stat-label">{label}</span>
  </div>
);

// ── Main Component ────────────────────────────
const AdminPanel = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [tab,    setTab]    = useState("users");   // "users" | "posts"
  const [stats,  setStats]  = useState(null);
  const [users,  setUsers]  = useState([]);
  const [posts,  setPosts]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  // Guard — non-admins get bounced immediately
  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") {
      toast.error("Admin access required");
      navigate("/");
    }
  }, [user, navigate]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, u, p] = await Promise.all([
        adminGetStats(),
        adminGetUsers(),
        adminGetPosts(),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setPosts(p.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Actions ──────────────────────────────────
  const handleDeletePost = async (id, title) => {
    if (!window.confirm(`Delete post "${title}"?`)) return;
    try {
      await adminDeletePost(id);
      toast.success("Post deleted.");
      loadAll();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleDeleteUser = async (id, username) => {
    if (!window.confirm(`Delete user "${username}" and ALL their posts?`)) return;
    try {
      await adminDeleteUser(id);
      toast.success("User deleted.");
      loadAll();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleToggleBan = async (id, isBanned, username) => {
    try {
      await adminToggleBan(id);
      toast.success(`User "${username}" ${isBanned ? "unbanned" : "banned"}.`);
      loadAll();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleRoleChange = async (id, currentRole, username) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change "${username}" role to ${newRole}?`)) return;
    try {
      await adminUpdateRole(id, newRole);
      toast.success(`Role updated to ${newRole}.`);
      loadAll();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  // ── Filter ───────────────────────────────────
  const q = search.toLowerCase();
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
  );
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.author?.toLowerCase().includes(q)
  );

  if (!user || user.role !== "admin") return null;

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <span className="admin-breadcrumb">
            <span className="admin-breadcrumb-home" onClick={() => navigate("/")}>
              ~/blog
            </span>
            <span className="admin-breadcrumb-sep"> / </span>
            <span>admin</span>
          </span>
          <h1 className="admin-title">ADMIN<span>_</span>PANEL</h1>
        </div>
        <div className="admin-header-right">
          <span className="admin-badge">ROOT ACCESS</span>
          <span className="admin-user-label">[ {user.username} ]</span>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        <StatCard label="TOTAL USERS"   value={stats?.totalUsers}  accent />
        <StatCard label="TOTAL POSTS"   value={stats?.totalPosts}  accent />
        <StatCard label="ADMINS"        value={stats?.adminUsers}  />
        <StatCard label="BANNED USERS"  value={stats?.bannedUsers} />
      </div>

      {/* Tabs + Search */}
      <div className="admin-controls">
        <div className="admin-tabs">
          <button
            className={`admin-tab${tab === "users" ? " active" : ""}`}
            onClick={() => { setTab("users"); setSearch(""); }}
          >
            {"// USERS ("}{users.length}{")"}
          </button>
          <button
            className={`admin-tab${tab === "posts" ? " active" : ""}`}
            onClick={() => { setTab("posts"); setSearch(""); }}
          >
            {"// POSTS ("}{posts.length}{")"}
          </button>
        </div>

        <div className="admin-search-wrap">
          <span className="search-icon">_</span>
          <input
            className="search-bar admin-search"
            type="text"
            placeholder={tab === "users" ? "search users..." : "search posts..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-state"><div className="spinner" />loading_data...</div>
      ) : (
        <>
          {/* ── USERS TABLE ── */}
          {tab === "users" && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>USERNAME</th>
                    <th>ROLE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={4} className="admin-empty">no users found</td></tr>
                  ) : filteredUsers.map((u, i) => (
                    <tr key={u._id} className={u.isBanned ? "row-banned" : ""}>
                      <td className="col-index">
                        #{String(filteredUsers.length - i).padStart(3, "0")}
                      </td>
                      <td className="col-username"
                        style={{ cursor: "crosshair" }}
                        onClick={() => navigate(`/admin/users/${u._id}`)}
                      >
                        {u.username}
                        {u.username === user.username && (
                          <span className="you-badge"> YOU</span>
                        )}
                      </td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${u.isBanned ? "banned" : "active"}`}>
                          {u.isBanned ? "BANNED" : "ACTIVE"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          {/* Don't show role/ban/delete actions on self or root admin */}
                          {u.username !== process.env.REACT_APP_ADMIN_USERNAME && (
                            <>
                              <button
                                className={`admin-action-btn ${u.role === "admin" ? "demote" : "promote"}`}
                                onClick={() => handleRoleChange(u._id, u.role, u.username)}
                                title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                              >
                                {u.role === "admin" ? "DEMOTE" : "PROMOTE"}
                              </button>
                              <button
                                className={`admin-action-btn ${u.isBanned ? "unban" : "ban"}`}
                                onClick={() => handleToggleBan(u._id, u.isBanned, u.username)}
                              >
                                {u.isBanned ? "UNBAN" : "BAN"}
                              </button>
                              <button
                                className="admin-action-btn del"
                                onClick={() => handleDeleteUser(u._id, u.username)}
                              >
                                DEL
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── POSTS TABLE ── */}
          {tab === "posts" && (
            <div className="admin-table-wrap">
              <table className="admin-table posts-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>TITLE</th>
                    <th>AUTHOR</th>
                    <th>CONTENT PREVIEW</th>
                    <th>CREATED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length === 0 ? (
                    <tr><td colSpan={6} className="admin-empty">no posts found</td></tr>
                  ) : filteredPosts.map((p, i) => (
                    <tr key={p._id}>
                      <td className="col-index">
                        #{String(filteredPosts.length - i).padStart(3, "0")}
                      </td>
                      <td className="col-title">{p.title}</td>
                      <td className="col-username">~{p.author}</td>
                      <td className="col-preview">
                        {p.content?.substring(0, 60)}{p.content?.length > 60 ? "…" : ""}
                      </td>
                      <td className="col-date">{formatDate(p.createdAt)}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="admin-action-btn del"
                            onClick={() => handleDeletePost(p._id, p.title)}
                          >
                            DEL
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;