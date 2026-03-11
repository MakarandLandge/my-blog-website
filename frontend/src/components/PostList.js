import React, { useState } from 'react';
import { deletePost } from '../api';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const shortId = (id) => id?.slice(-6).toUpperCase();

const PostCard = ({ post, index, total, isEditing, onEdit, onDeleted }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting,      setDeleting]      = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deletePost(post._id);
      onDeleted();
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <article
      className={`post-card${isEditing ? ' is-editing' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="post-card-inner">
        <div className="card-header">
          <span className="card-index">#{String(total - index).padStart(3, '0')}</span>
          <h3 className="card-title">{post.title}</h3>
          <div className="card-actions">
            <button className="action-btn edit" onClick={() => onEdit(post)} disabled={deleting}>
              Edit
            </button>
            <button className="action-btn delete" onClick={() => setConfirmDelete(true)} disabled={deleting || confirmDelete}>
              Del
            </button>
          </div>
        </div>

        <p className="card-content">{post.content}</p>

        <div className="card-footer">
          <time className="card-date">{formatDate(post.createdAt)}</time>
          <span className="card-id">id:{shortId(post._id)}</span>
        </div>
      </div>

      {confirmDelete && (
        <div className="confirm-row">
          <span>Permanently delete this post?</span>
          <button className="confirm-yes" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Yes, Delete'}
          </button>
          <button className="confirm-no" onClick={() => setConfirmDelete(false)}>
            Cancel
          </button>
        </div>
      )}
    </article>
  );
};

const PostList = ({ posts, loading, error, editingId, onEdit, onDeleted }) => {
  if (loading) return (
    <div className="posts-panel">
      <div className="panel-label">Feed</div>
      <div className="loading-state"><div className="spinner" />Fetching posts...</div>
    </div>
  );

  if (error) return (
    <div className="posts-panel">
      <div className="panel-label">Feed</div>
      <div className="error-bar" style={{ marginTop: 0 }}>{error}</div>
    </div>
  );

  return (
    <div className="posts-panel">
      <div className="panel-label">Feed — {posts.length} post{posts.length !== 1 ? 's' : ''}</div>
      {posts.length === 0 ? (
        <div className="empty-state">
          <p>_</p>
          <p>No posts yet. Write one.</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post, i) => (
            <PostCard
              key={post._id}
              post={post}
              index={i}
              total={posts.length}
              isEditing={editingId === post._id}
              onEdit={onEdit}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;