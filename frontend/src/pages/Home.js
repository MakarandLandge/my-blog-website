import React, { useState } from "react";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import { useAuth } from "../context/AuthContext";

const Home = ({ onPostCountChange }) => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = async () => {
    setRefreshKey((prev) => prev + 1);
    if (onPostCountChange) onPostCountChange();
  };

  return (
    <div className="home-container">
      {/* LEFT: Form panel */}
      <div className="form-side">
        {user ? (
          <PostForm onSuccess={handlePostCreated} />
        ) : (
          <div className="login-prompt">
            <span className="prompt-arrow">&gt; </span>
            <a href="/login">sign_in</a> or <a href="/register">register</a> to write a post.
          </div>
        )}
      </div>

      {/* RIGHT: Posts feed */}
      <div className="feed-side">
        <PostList key={refreshKey} onCountChange={onPostCountChange} />
      </div>
    </div>
  );
};

export default Home;