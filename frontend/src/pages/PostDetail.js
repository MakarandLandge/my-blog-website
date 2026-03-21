import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchPostById, deletePost } from "../api";
import { useAuth } from "../context/AuthContext";
import PostForm from "../components/PostForm";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const loadPost = useCallback(async () => {
    try {
      const { data } = await fetchPostById(id);
      setPost(data);
    } catch (err) {
      toast.error("Post not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id);
      toast.success("Post deleted!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (loading) return <div className="loading-state"><div className="spinner" />loading_post...</div>;
  if (!post) return null;

  const isOwner = user && post.userId === user._id;

  return (
    <div className="post-detail-container">
      <button className="btn btn-back" onClick={() => navigate("/")}>
        ← back
      </button>

      {editing ? (
        <PostForm
          existingPost={post}
          onSuccess={() => { setEditing(false); loadPost(); }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <article className="post-detail">
          <h1 className="detail-title">{post.title}</h1>

          <div className="detail-meta">
            <span className="post-author">~{post.author}</span>
            <span className="card-date">{formatDate(post.createdAt)}</span>
          </div>

          <div className="detail-divider" />

          <div className="detail-content">
            {post.content.split("\n").map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>

          {isOwner && (
            <div className="detail-actions">
              <button className="btn btn-edit" onClick={() => setEditing(true)}>
                EDIT
              </button>
              <button className="btn btn-delete" onClick={handleDelete}>
                DELETE
              </button>
            </div>
          )}
        </article>
      )}
    </div>
  );
};

export default PostDetail;