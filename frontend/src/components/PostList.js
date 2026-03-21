import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchPosts, deletePost } from "../api";
import { useAuth } from "../context/AuthContext";
import PostForm from "./PostForm";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const PostList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const { data } = await fetchPosts();
      setPosts(data);
    } catch {
      toast.error("failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("delete this post?")) return;
    try {
      await deletePost(id);
      toast.success("post deleted.");
      loadPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || "delete failed");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const q = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        loading_posts...
      </div>
    );
  }

  return (
    <div className="post-list-container">
      {/* Search */}
      <div className="search-wrapper">
        <span className="search-icon">_</span>
        <input
          className="search-bar"
          type="text"
          placeholder="search_posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="clear-search" onClick={() => setSearch("")}>✕</button>
        )}
      </div>

      {/* Edit modal */}
      {editingPost && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PostForm
              existingPost={editingPost}
              onSuccess={() => { setEditingPost(null); loadPosts(); }}
              onCancel={() => setEditingPost(null)}
            />
          </div>
        </div>
      )}

      {/* Cards */}
      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <p>{search ? `no results for "${search}"` : "> no posts found. write the first one."}</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post, index) => (
            <div
              key={post._id}
              className={`post-card${editingPost?._id === post._id ? " is-editing" : ""}`}
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <div className="post-card-inner">
                <div className="card-header">
                  <span className="card-index">
                    [{String(index + 1).padStart(3, "0")}]
                  </span>
                  <span className="card-title">{post.title}</span>
                  {user && post.userId === user._id && (
                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="action-btn edit"
                        onClick={(e) => { e.stopPropagation(); setEditingPost(post); }}
                      >
                        edit
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={(e) => handleDelete(e, post._id)}
                      >
                        del
                      </button>
                    </div>
                  )}
                </div>

                <p className="card-content">{post.content}</p>

                <div className="card-footer">
                  <div className="post-meta">
                    {post.author && (
                      <span className="post-author">~{post.author}</span>
                    )}
                    <span className="card-date">{formatDate(post.createdAt)}</span>
                  </div>
                  <span className="card-id">{post._id?.slice(-6)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;