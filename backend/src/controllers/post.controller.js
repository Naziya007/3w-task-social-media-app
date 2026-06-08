const Post = require('../models/Post');

// Create a new post 
const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? req.file.path : ''; // Cloudinary URL from multer

    // At least one of text or image must be present
    if (!text && !imageUrl) {
      return res.status(400).json({ message: 'Post must have text or an image' });
    }

    const post = await Post.create({
      author: req.user._id,
      text: text || '',
      image: imageUrl
    });

    // Populate author details 
    await post.populate('author', 'username avatar');

    res.status(201).json({ post });
  } catch (error) {
  console.error("CREATE POST ERROR:");
  console.error(error);
  console.error(error.stack);

  res.status(500).json({
    message: error.message
  });
}
};


//Get all post by pagination
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // New post first
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar')
      .populate('comments.author', 'username avatar')
      .lean();

    // Add likedByMe if user is authenticated
    const userId = req.user?._id?.toString();
    const postsWithFlags = posts.map((post) => ({
      ...post,
      likedByMe: userId
        ? post.likes.some((id) => id.toString() === userId)
        : false,
      likesCount: post.likes.length,
      commentsCount: post.comments.length
    }));

    res.json({
      posts: postsWithFlags,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};



// Toggle like on a post
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike 
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      liked: !alreadyLiked,
      likesCount: post.likes.length,
      likes: post.likes
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Failed to update like' });
  }
};



// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Add comment with author reference
    const comment = {
      author: req.user._id,
      text: text.trim(),
      createdAt: new Date()
    };
    post.comments.push(comment);
    await post.save();

    // Get the newly added comment with populated author
    const updatedPost = await Post.findById(req.params.id)
      .populate('comments.author', 'username avatar')
      .select('comments');

    const newComment = updatedPost.comments[updatedPost.comments.length - 1];

    res.status(201).json({
      comment: newComment,
      commentsCount: post.comments.length
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};




// Delete a post (only the author can delete)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check owner
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

module.exports = { createPost, getPosts, toggleLike, addComment, deletePost };
