const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      trim: true,
      maxlength: [500, 'Post text cannot exceed 500 characters'],
      default: ''
    },
    image: {
      type: String, // Cloudinary URL
      default: ''
    },
    // Array of user id who liked this post
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    // Array of comment objects with author info
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        text: {
          type: String,
          required: true,
          trim: true,
          maxlength: [300, 'Comment cannot exceed 300 characters']
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

//  At least text or image must be provided
postSchema.pre('validate', function (next) {
  if (!this.text && !this.image) {
    this.invalidate('text', 'Post must have either text or an image');
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
