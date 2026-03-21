import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createPost, updatePost } from "../api";
import { useAuth } from "../context/AuthContext";

const PostForm = ({ existingPost, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [title, setTitle]     = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Author is always locked to logged-in username — never editable
  const lockedAuthor = user?.username || "";

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      // author is NOT loaded from existingPost — always use logged-in user
    }
  }, [existingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("title and content required");
      return;
    }
    setLoading(true);
    try {
      if (existingPost) {
        await updatePost(existingPost._id, { title, content, author: lockedAuthor });
        toast.success("post updated.");
      } else {
        await createPost({ title, content, author: lockedAuthor });
        toast.success("post published.");
        setTitle("");
        setContent("");
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form">
      <div className="form-panel-header">
        <span className={`form-panel-title${existingPost ? " editing" : ""}`}>
          {existingPost ? "EDIT POST" : "NEW POST"}
        </span>
        {existingPost && <span className="edit-badge">EDITING</span>}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-body">
          <div className="field-wrap">
            <label className="field-label">TITLE <span>*</span></label>
            <input
              className="field-input"
              type="text"
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Author — read-only, always locked to logged-in user */}
          <div className="field-wrap">
            <label className="field-label">
              AUTHOR <span className="locked-badge">LOCKED</span>
            </label>
            <input
              className="field-input field-locked"
              type="text"
              value={lockedAuthor}
              readOnly
              tabIndex={-1}
            />
          </div>

          <div className="field-wrap">
            <label className="field-label">CONTENT <span>*</span></label>
            <textarea
              className="field-textarea"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-submit" disabled={loading}>
            {loading
              ? "processing..."
              : existingPost
              ? "// UPDATE POST"
              : "// PUBLISH POST"}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-cancel" onClick={onCancel} disabled={loading}>
              CANCEL
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostForm;