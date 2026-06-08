# Task Planet

A full-stack mini social post application built with React.js, Node.js + Express, and MongoDB. Inspired by the TaskPlanet social page.



## Features

- **Account Creation** – Signup and login with email/password (JWT authentication)
- **Create Posts** – Post text, image, or both (image upload via Cloudinary)
- **Public Feed** – View all posts from all users, newest first
- **Like & Unlike** – Toggle likes with instant UI updates (optimistic updates)
- **Comments** – Add comments on any post, shown with username and time
- **Delete Posts** – Post authors can delete their own posts
- **Pagination** – Load more posts with "Load More" button
- **Responsive Design** – Mobile-first layout using Material UI

---

## Project Structure

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

##  Tech Stack

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

##  MongoDB Collections

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



