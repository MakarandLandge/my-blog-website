import React, { useState, useEffect, useCallback } from 'react';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import { fetchPosts } from './api';
import './App.css';

function App() {
  const [posts,       setPosts]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [editingPost, setEditingPost] = useState(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await fetchPosts();
      setPosts(data);
    } catch {
      setError('Cannot reach the server. Make sure the backend is running on :5000');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleEdit  = (post) => setEditingPost(post);
  const cancelEdit  = ()     => setEditingPost(null);
  const handleSaved = ()     => { setEditingPost(null); loadPosts(); };

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-prefix">$ run</span>
            <span className="logo-text">THE<span>BLOG</span></span>
          </div>
          <div className="header-meta">
            <div className="status-dot"><div className="dot" />CONNECTED</div>
            <div className="post-count-badge">{posts.length} POST{posts.length !== 1 ? 'S' : ''}</div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <PostForm editingPost={editingPost} onSaved={handleSaved} onCancel={cancelEdit} />
        <PostList posts={posts} loading={loading} error={error} editingId={editingPost?._id} onEdit={handleEdit} onDeleted={loadPosts} />
      </main>

      <footer>
        <div className="site-footer">
          <span className="footer-text">React · Express · <span>MongoDB</span></span>
          <span className="footer-text">{new Date().getFullYear()} // SIMPLE BLOG</span>
        </div>
      </footer>
    </div>
  );
}

export default App;