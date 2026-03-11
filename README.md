# 📝 Simple Blog App

A full-stack blog application built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 📁 Project Structure

```
simple-blog/
│
├── backend/
│   ├── controllers/
│   │   └── postController.js   ← Business logic for all routes
│   ├── models/
│   │   └── Post.js             ← Mongoose schema
│   ├── routes/
│   │   └── postRoutes.js       ← Express route definitions
│   ├── .env.example            ← Copy to .env and fill in your values
│   ├── package.json
│   └── server.js               ← App entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── PostForm.js     ← Write & submit a post
    │   │   └── PostList.js     ← Display all posts
    │   ├── App.js              ← Root component
    │   ├── App.css             ← All styles
    │   ├── api.js              ← Axios API helper
    │   └── index.js            ← React entry point
    └── package.json
```

---

## ⚡ Quick Start

### 1. Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/) (comes with Node)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **OR** a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 2. Clone or download the project

```bash
cd simple-blog
```

### 3. Set up the Backend

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Open `.env` and set your values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/simple-blog
```
> For MongoDB Atlas, replace the MONGO_URI with your Atlas connection string.

Start the backend:
```bash
# Development mode (auto-restarts on file changes)
npm run dev

# OR production mode
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### 4. Set up the Frontend

Open a **new terminal window**, then:

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The app will open at **http://localhost:3000** automatically.

---

## 🔌 API Endpoints

| Method | URL            | Description          |
|--------|----------------|----------------------|
| GET    | `/posts`       | Get all posts        |
| GET    | `/posts/:id`   | Get a single post    |
| POST   | `/posts`       | Create a new post    |
| PUT    | `/posts/:id`   | Update a post        |
| DELETE | `/posts/:id`   | Delete a post        |

### Example Requests

**Create a post:**
```bash
curl -X POST http://localhost:5000/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello World", "content": "My first blog post!"}'
```

**Get all posts:**
```bash
curl http://localhost:5000/posts
```

**Get a single post:**
```bash
curl http://localhost:5000/posts/<post_id>
```

**Update a post:**
```bash
curl -X PUT http://localhost:5000/posts/<post_id> \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "content": "Updated content."}'
```

**Delete a post:**
```bash
curl -X DELETE http://localhost:5000/posts/<post_id>
```

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| `MongoDB connection error` | Make sure MongoDB is running: `mongod` in your terminal |
| `Cannot connect to server` | Ensure backend is running on port 5000 |
| `CORS error` | The backend has CORS enabled — make sure you haven't changed the port |
| `npm install fails` | Try deleting `node_modules` and running `npm install` again |

---

## 🚀 Future Features (already structured)

The PUT and DELETE endpoints are fully implemented on the backend — ready to wire up:
- **Edit post** — use `PUT /posts/:id`
- **Delete post** — use `DELETE /posts/:id`
