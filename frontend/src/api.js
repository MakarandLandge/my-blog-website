// ─────────────────────────────────────────────
//  src/api.js  –  Centralised Axios instance
//  All HTTP calls to the backend go through here
// ─────────────────────────────────────────────
import axios from 'axios';

// If you change the backend port, update it here only
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// ── Post endpoints ────────────────────────────
export const fetchPosts      = ()           => API.get('/posts');
export const fetchPostById   = (id)         => API.get(`/posts/${id}`);
export const createPost      = (postData)   => API.post('/posts', postData);
export const updatePost      = (id, data)   => API.put(`/posts/${id}`, data);
export const deletePost      = (id)         => API.delete(`/posts/${id}`);

export default API;
