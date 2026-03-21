import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Posts ────────────────────────────────────────────────────────────────────
export const fetchPosts    = ()          => API.get("/posts");
export const fetchPostById = (id)        => API.get(`/posts/${id}`);
export const createPost    = (data)      => API.post("/posts", data);
export const updatePost    = (id, data)  => API.put(`/posts/${id}`, data);
export const deletePost    = (id)        => API.delete(`/posts/${id}`);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser    = (data) => API.post("/auth/login", data);

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminGetStats      = ()         => API.get("/admin/stats");
export const adminGetUsers      = ()         => API.get("/admin/users");
export const adminGetPosts      = ()         => API.get("/admin/posts");
export const adminDeletePost    = (id)       => API.delete(`/admin/posts/${id}`);
export const adminDeleteUser    = (id)       => API.delete(`/admin/users/${id}`);
export const adminToggleBan     = (id)       => API.put(`/admin/users/${id}/ban`);
export const adminUpdateRole    = (id, role) => API.put(`/admin/users/${id}/role`, { role });