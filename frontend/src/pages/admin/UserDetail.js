import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  adminGetUserById,
  adminDeleteUser,
  adminToggleBan,
  adminUpdateRole,
} from "../../api";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const { data } = await adminGetUserById(id);
      setUser(data);
    } catch (err) {
      toast.error("User not found");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;
    }
    loadUser();
  }, [currentUser, navigate, loadUser]);

  const handleToggleBan = async () => {
    try {
      await adminToggleBan(user._id);
      toast.success(`User "${user.username}" ${user.isBanned ? "unbanned" : "banned"}.`);
      loadUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleRoleChange = async () => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!window.confirm(`Change "${user.username}" role to ${newRole}?`)) return;
    try {
      await adminUpdateRole(user._id, newRole);
      toast.success(`Role updated to ${newRole}.`);
      loadUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete user "${user.username}" and ALL their posts?`)) return;
    try {
      await adminDeleteUser(user._id);
      toast.success("User deleted.");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <div className="loading-state"><div className="spinner" />loading_user...</div>;
  if (!user) return null;

  const isSelf = currentUser?.username === user.username;
  const isRootAdmin = user.username === process.env.REACT_APP_ADMIN_USERNAME;
  const canModerate = !isSelf && !isRootAdmin;

  return (
    <div className="post-detail-container">
      {/* Back */}
      <button className="btn btn-back" onClick={() => navigate("/admin")}>
        ← back to admin
      </button>

      <article className="post-detail">

        {/* ── Header ── */}
        <div style={{ borderBottom: "1px solid var(--border)", padding: "1.5rem 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                {/* USER PROFILE */}
              </span>
              <h1 className="detail-title" style={{ padding: 0, marginBottom: "0.5rem" }}>
                ~{user.username}
                {isSelf && <span className="you-badge" style={{ marginLeft: "0.75rem" }}>YOU</span>}
              </h1>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span className={`role-badge role-${user.role}`}>{user.role.toUpperCase()}</span>
                <span className={`status-badge ${user.isBanned ? "banned" : "active"}`}>
                  {user.isBanned ? "BANNED" : "ACTIVE"}
                </span>
              </div>
            </div>

            {/* Actions */}
            {canModerate && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  className={`admin-action-btn ${user.role === "admin" ? "demote" : "promote"}`}
                  onClick={handleRoleChange}
                >
                  {user.role === "admin" ? "DEMOTE" : "PROMOTE"}
                </button>
                <button
                  className={`admin-action-btn ${user.isBanned ? "unban" : "ban"}`}
                  onClick={handleToggleBan}
                >
                  {user.isBanned ? "UNBAN" : "BAN"}
                </button>
                <button className="admin-action-btn del" onClick={handleDelete}>
                  DELETE USER
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Details Grid ── */}
        <div style={{ padding: "1.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", borderBottom: "1px solid var(--border)" }}>

          <DetailField label="USERNAME" value={`~${user.username}`} />
          <DetailField label="EMAIL"    value={user.email} />
          <DetailField label="ROLE"     value={user.role.toUpperCase()} accent={user.role === "admin"} />
          <DetailField label="STATUS"   value={user.isBanned ? "BANNED" : "ACTIVE"} accent={!user.isBanned} danger={user.isBanned} />
          <DetailField label="JOINED"   value={formatDate(user.createdAt)} />
          <DetailField label="USER ID"  value={user._id} mono dim />

          {/* Hashed Password — full width */}
          <div style={{ gridColumn: "1 / -1" }}>
            <DetailField label="HASHED PASSWORD" value={user.password} mono dim />
          </div>

        </div>

        {/* ── Posts by this user ── */}
        <div style={{ padding: "1.5rem 2rem" }}>
          <span className="feed-label">
            {/* POSTS BY */} ~{user.username}
            <span>({user.posts?.length ?? 0})</span>
          </span>

          {!user.posts || user.posts.length === 0 ? (
            <div className="no-posts"><p>no posts found</p></div>
          ) : (
            <div className="posts-grid">
              {user.posts.map((post, i) => (
                <div
                  key={post._id}
                  className="post-card"
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  <div className="post-card-inner">
                    <div className="card-header">
                      <span className="card-index">
                        #{String(user.posts.length - i).padStart(3, "0")}
                      </span>
                      <h2 className="card-title">{post.title}</h2>
                    </div>
                    <p className="card-content">{post.content}</p>
                    <div className="card-footer">
                      <div className="post-meta">
                        <span className="card-date">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </article>
    </div>
  );
};

// ── Small helper ─────────────────────────────
const DetailField = ({ label, value, accent, danger, mono, dim }) => (
  <div>
    <span style={{
      fontSize: "0.6rem",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      display: "block",
      marginBottom: "0.3rem",
    }}>
      {label}
    </span>
    <span style={{
      fontSize: mono ? "0.72rem" : "0.875rem",
      fontFamily: "var(--mono)",
      color: accent ? "var(--green)" : danger ? "var(--red)" : dim ? "var(--text-dim)" : "var(--text)",
      wordBreak: "break-all",
      display: "block",
    }}>
      {value || "—"}
    </span>
  </div>
);

export default UserDetail;