# SocialSpark 🚀

A full-stack mini social post application built with React.js, Node.js + Express, and MongoDB. Inspired by the TaskPlanet social page.

---

## ✨ Features

- **Account Creation** – Signup and login with email/password (JWT authentication)
- **Create Posts** – Post text, image, or both (image upload via Cloudinary)
- **Public Feed** – View all posts from all users, newest first
- **Like & Unlike** – Toggle likes with instant UI updates (optimistic updates)
- **Comments** – Add comments on any post, shown with username and time
- **Delete Posts** – Post authors can delete their own posts
- **Pagination** – Load more posts with "Load More" button
- **Responsive Design** – Mobile-first layout using Material UI

---

## 🗂️ Project Structure

```
social-app/
├── backend/              ← Node.js + Express API
│   ├── src/
│   │   ├── models/       ← MongoDB schemas (User, Post)
│   │   ├── controllers/  ← Business logic
│   │   ├── routes/       ← API route definitions
│   │   ├── middleware/   ← Auth & upload middleware
│   │   └── server.js     ← Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/             ← React.js app
    ├── src/
    │   ├── components/   ← Reusable components (Navbar, PostCard, CreatePost)
    │   ├── pages/        ← Page components (Login, Signup, Feed)
    │   ├── context/      ← Auth context (global state)
    │   └── utils/        ← Axios API instance
    ├── .env.example
    └── package.json
```

---

## 🛠️ Tech Stack

| Layer     | Technology           |
|-----------|----------------------|
| Frontend  | React.js, Material UI (MUI) |
| Backend   | Node.js, Express.js  |
| Database  | MongoDB (Atlas)      |
| Auth      | JWT (jsonwebtoken + bcryptjs) |
| Images    | Cloudinary + Multer  |
| Deploy FE | Vercel               |
| Deploy BE | Render               |

---

## 🗄️ MongoDB Collections

Only 2 collections are used (as required):

### `users`
```json
{
  "_id": "ObjectId",
  "username": "String (unique)",
  "email": "String (unique)",
  "password": "String (hashed)",
  "avatar": "String (optional)",
  "bio": "String (optional)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### `posts`
```json
{
  "_id": "ObjectId",
  "author": "ObjectId (ref: User)",
  "text": "String",
  "image": "String (Cloudinary URL)",
  "likes": ["ObjectId (ref: User)"],
  "comments": [
    {
      "author": "ObjectId (ref: User)",
      "text": "String",
      "createdAt": "Date"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/social-app.git
cd social-app
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env
# Fill in your credentials in .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/socialapp?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev    # Starts backend on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

cp .env.example .env
# Edit .env:
# REACT_APP_API_URL=http://localhost:5000/api

npm start      # Starts frontend on http://localhost:3000
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint          | Auth | Description        |
|--------|-------------------|------|--------------------|
| POST   | /api/auth/signup  | ❌   | Create new account |
| POST   | /api/auth/login   | ❌   | Login, get token   |
| GET    | /api/auth/me      | ✅   | Get current user   |

### Posts
| Method | Endpoint                  | Auth | Description          |
|--------|---------------------------|------|----------------------|
| GET    | /api/posts?page=1&limit=10| ❌   | Get paginated feed   |
| POST   | /api/posts                | ✅   | Create new post      |
| PUT    | /api/posts/:id/like       | ✅   | Toggle like          |
| POST   | /api/posts/:id/comment    | ✅   | Add comment          |
| DELETE | /api/posts/:id            | ✅   | Delete own post      |

---

## ☁️ Deployment

### Backend → Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set **Root Directory** to `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add all environment variables from `.env`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your repo, set **Root Directory** to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-render-backend-url.onrender.com/api`
4. Deploy!

### Database → MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user and whitelist IP (0.0.0.0/0 for Render)
3. Copy connection string to `MONGO_URI`

---

## 👤 Author

Built for 3W Full Stack Internship Assignment – Task 1
