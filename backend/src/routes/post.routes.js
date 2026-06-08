const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  deletePost
} = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

// Optional auth middleware - attaches user if token present but doesn't block
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    try {
      const decoded = jwt.verify(
        authHeader.split(' ')[1],
        process.env.JWT_SECRET
      );
      User.findById(decoded.id)
        .select('-password')
        .then((user) => {
          req.user = user;
          next();
        })
        .catch(() => next());
    } catch {
      next();
    }
  } else {
    next();
  }
};

// Feed - public but shows likedByMe if authenticated
router.get('/', optionalAuth, getPosts);

// Protected routes - must be logged in
router.post(
  '/',
  protect,
  (req, res, next) => {
    console.log('Before upload');
    next();
  },
  upload.single('image'),
  (req, res, next) => {
    console.log('After upload');
    console.log('FILE =', req.file);
    next();
  },
  createPost
);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);

module.exports = router;
