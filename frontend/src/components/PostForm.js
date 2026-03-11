import React, { useState, useEffect } from 'react';
import { createPost, updatePost } from '../api';

const PostForm = ({ editingPost, onSaved, onCancel }) => {
  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const isEditing = Boolean(editingPost);

  // Populate fields when editing, clear when done
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setError('');
    } else {
      setTitle('');
      setContent('');
      setError('');
    }
  }, [editingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are both required.');
      return;
    }
    try {
      setLoading(true);
      if (isEditing) {
        await updatePost(editingPost._id, { title: title.trim(), content: content.trim() });
      } else {
        await createPost({ title: title.trim(), content: content.trim() });
        setTitle('');
        setContent('');
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-panel">
      <div className="form-panel-header">
        <span className={`form-panel-title${isEditing ? ' editing' : ''}`}>
          {isEditing ? 'EDIT POST' : 'NEW POST'}
        </span>
        {isEditing && <span className="edit-badge">EDIT MODE</span>}
      </div>

      <div className="form-body">
        {error && <div className="error-bar">{error}</div>}

        <form onSubmit={handleSubmit} className="post-form">
          <div className="field-wrap">
            <label className="field-label">Title <span>*</span></label>
            <input
              className="field-input"
              type="text"
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="field-wrap">
            <label className="field-label">Content <span>*</span></label>
            <textarea
              className="field-textarea"
              rows={8}
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading
                ? (isEditing ? 'Saving...' : 'Publishing...')
                : (isEditing ? '// Save Changes' : '// Publish Post')}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-cancel" onClick={onCancel} disabled={loading}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;