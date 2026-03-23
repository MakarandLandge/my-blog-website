# 📝 My Blog Website — v2.0

A full-stack blog application built with **React**, **Node.js/Express**, and **MongoDB**.
Upgraded from basic CRUD to a production-ready system with authentication, admin panel, and more.

---

## 📁 Project Structure

```
my-blog-website/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js     ← Register, login logic
│   │   ├── postController.js     ← CRUD for posts
│   │   └── adminController.js    ← Admin-only operations
│   ├── middleware/
│   │   └── authMiddleware.js     ← JWT protect + isAdmin
│   ├── models/
│   │   ├── Post.js               ← Post schema (title, content, author, userId)
│   │   └── User.js               ← User schema (username, email, password, role, isBanned)
│   ├── routes/
│   │   ├── authRoutes.js         ← /auth/register, /auth/login
│   │   ├── postRoutes.js         ← /posts CRUD
│   │   └── adminRoutes.js        ← /admin/* (protected)
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js    ← Global auth state
        ├── components/
        │   ├── Navbar.js         ← Nav with auth + theme toggle
        │   ├── PostForm.js       ← Create/edit post form
        │   └── PostList.js       ← Feed with search
        ├── pages/
        │   ├── admin/
        │   │   └── AdminPanel.js ← Admin dashboard (/admin)
        │   │   └── UserDetail.js ← User moderation page (/admin/users/:id)  ← ADD
        │   ├── Home.js           ← Main feed page
        │   ├── PostDetail.js     ← Single post view (/post/:id)
        │   ├── Login.js          ← Login page
        │   └── Register.js       ← Register page
        ├── api.js                ← Axios + all API calls
        ├── App.js                ← Router, Toaster, theme state
        ├── App.css               ← All styles (dark + light theme)
        └── index.js
```

---

## ⚡ Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) running locally or Atlas connection string

### 2. Clone the repo

```bash
git clone https://github.com/MakarandLandge/my-blog-website
cd my-blog-website
```

### 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/simple-blog
JWT_SECRET=your_super_secret_key_here
ADMIN_USERNAME=your_admin_username
```

Start the backend:

```bash
npm run dev
```

### 4. Frontend setup

```bash
cd frontend
npm install
npm start
```

App opens at **http://localhost:3000**

---

## 🔌 API Reference

### Auth (Public)

| Method | URL | Body | Description |
|--------|-----|------|-------------|
| POST | `/auth/register` | `{ username, email, password }` | Register new user |
| POST | `/auth/login` | `{ email, password }` | Login, returns JWT |

> Login accepts either **email or username** in the email field.

### Posts (Read: Public, Write: JWT required)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/posts` | ❌ | Get all posts |
| GET | `/posts/:id` | ❌ | Get single post |
| POST | `/posts` | ✅ | Create post |
| PUT | `/posts/:id` | ✅ Owner | Update post |
| DELETE | `/posts/:id` | ✅ Owner | Delete post |

### Admin (JWT + admin role required)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/admin/stats` | Dashboard stats |
| GET | `/admin/users` | All users |
| GET | `/admin/posts` | All posts |
| GET | `/admin/users/:id` | Get user + their posts |
| PUT | `/admin/users/:id/role` | Promote/demote user |
| PUT | `/admin/users/:id/ban` | Ban/unban user |
| DELETE | `/admin/users/:id` | Delete user + their posts |
| DELETE | `/admin/posts/:id` | Delete any post |

---

## ✅ Features

| Feature | Status |
|---------|--------|
| Create / Read / Update / Delete posts | ✅ |
| Author + createdAt timestamp | ✅ |
| Real-time frontend search | ✅ |
| Blog detail page (`/post/:id`) | ✅ |
| React Router navigation | ✅ |
| Toast notifications | ✅ |
| JWT authentication | ✅ |
| User registration + login | ✅ |
| Login with username or email | ✅ |
| Author field locked on edit (anti-impersonation) | ✅ |
| Protected create/edit/delete routes | ✅ |
| Show edit/delete only to post owner | ✅ |
| Admin panel (`/admin`) | ✅ |
| Admin — view all users + details | ✅ |
| Admin — promote/demote users | ✅ |
| Admin — ban/unban users | ✅ |
| Admin — delete any user or post | ✅ |
| Admin — user detail & moderation page | ✅ |
| Dark / Light theme toggle | ✅ |
| Theme persisted in localStorage | ✅ |
| Responsive design | ✅ |

---

## 🔐 Admin Setup

1. Set `ADMIN_USERNAME` in your `backend/.env`
2. Register an account with that exact username
3. The account is automatically assigned `role: admin`
4. Log in — you'll see the **⚡ ADMIN** link in the navbar
5. Navigate to `/admin` for the full dashboard

> If you registered before setting `ADMIN_USERNAME`, update the role manually:
> ```js
> db.users.updateOne({ username: "yourusername" }, { $set: { role: "admin" } })
> ```
> Then clear `localStorage` in the browser and log in again.

---

## 📦 npm Packages

### Backend
```bash
npm install bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

### Frontend
```bash
npm install react-router-dom react-hot-toast axios
```

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| `MONGO_URI is undefined` | Make sure `.env` file exists in `backend/` folder |
| `401 Not authorized` | Token expired — log out and log in again |
| Admin link not showing | Update role in MongoDB, clear localStorage, log in again |
| Edit/Delete buttons missing | Post `userId` must match logged-in user `_id` |
| Toast not showing | Confirm `<Toaster />` is in `App.js` |

---

## 🚀 Deployment

- **Frontend** → [Vercel](https://vercel.com) (auto-deploys from GitHub)
- **Backend** → Add `ADMIN_USERNAME`, `JWT_SECRET`, `MONGO_URI` to Vercel environment variables

Live: [my-blog-website-steel.vercel.app](https://my-blog-website-steel.vercel.app)

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React, React Router, Axios, react-hot-toast |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Deployment | Vercel |

---

## 🔒 Security

**Never commit `.env` files to GitHub.** Make sure your `.gitignore` includes:

```
.env
backend/.env
frontend/.env
node_modules/
```

If you accidentally pushed `.env`:
1. Rotate your MongoDB password immediately on Atlas
2. Generate a new JWT secret
3. Run `git rm --cached backend/.env` then push again

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/simple-blog
JWT_SECRET=your_secret_key
ADMIN_USERNAME=your_admin_username
```

### Frontend (`frontend/.env`)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

> Without `REACT_APP_API_URL` set, the frontend defaults to `localhost:5000` which won't work in production.
