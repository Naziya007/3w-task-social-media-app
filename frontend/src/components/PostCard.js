import React, { useState } from 'react';
import {
  Card, CardContent, CardMedia, CardActions, Box, Avatar, Typography,
  IconButton, Button, Divider, TextField, Collapse, Menu, MenuItem
} from '@mui/material';
import {
  Favorite, FavoriteBorder, ChatBubbleOutline, MoreVert, Delete,
  Send as SendIcon, AccessTime
} from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// Format time ago 
const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const PostCard = ({ post, onPostDeleted }) => {
  const { user } = useAuth();

  const [liked, setLiked] = useState(post.likedByMe || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isOwner = user?._id === post.author?._id;

  //handle like/unlike
  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    
    setLiked((prev) => !prev);
    setLikesCount((prev) => liked ? prev - 1 : prev + 1);

    try {
      await api.put(`/posts/${post._id}/like`);
    } catch {
      // Revert on error
      setLiked((prev) => !prev);
      setLikesCount((prev) => liked ? prev + 1 : prev - 1);
    } finally {
      setLikeLoading(false);
    }
  };

  // add comment
  const handleComment = async () => {
    if (!commentText.trim() || commentLoading) return;
    setCommentLoading(true);

    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, {
        text: commentText.trim()
      });
      setComments((prev) => [...prev, data.comment]);
      setCommentText('');
      setShowComments(true);
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  //delete post
  const handleDelete = async () => {
    setAnchorEl(null);
    try {
      await api.delete(`/posts/${post._id}`);
      onPostDeleted(post._id);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const avatarLetter = post.author?.username?.charAt(0).toUpperCase();

  return (
    <Card sx={{ mb: 2, borderRadius: 3, overflow: 'visible' }}>
      <CardContent sx={{ pb: 1 }}>
        {/* Post Header - Author info */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              src={post.author?.avatar}
              sx={{ width: 42, height: 42, bgcolor: 'primary.main', fontWeight: 700 }}
            >
              {avatarLetter}
            </Avatar>
            <Box>
              <Typography fontWeight={700} variant="body1" lineHeight={1.2}>
                {post.author?.username}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                <AccessTime sx={{ fontSize: 12, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {timeAgo(post.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Options menu for post owner */}
          {isOwner && (
            <>
              <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Post
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Post Text Content */}
        {post.text && (
          <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7, color: 'text.primary' }}>
            {post.text}
          </Typography>
        )}
      </CardContent>

      {/* Post Image */}
      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post image"
          sx={{ maxHeight: 450, objectFit: 'cover', cursor: 'pointer' }}
        />
      )}
<Box
  px={2}
  py={1}
  display="flex"
  gap={3}
  alignItems="center"
>
  {likesCount > 0 && (
    <Box display="flex" alignItems="center" gap={0.5}>
      <FavoriteIcon
        sx={{
          fontSize: 18,
          color: '#ff3b5c'
        }}
      />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: '#64748b'
        }}
      >
        {likesCount}
      </Typography>
    </Box>
  )}

  {comments.length > 0 && (
    <Box
      display="flex"
      alignItems="center"
      gap={0.5}
      onClick={() => setShowComments(!showComments)}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.8
        }
      }}
    >
      <ChatBubbleIcon
        sx={{
          fontSize: 17,
          color: '#1677ff'
        }}
      />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: '#64748b'
        }}
      >
        {comments.length}
      </Typography>
    </Box>
  )}
</Box>

      <Divider />

      {/* Action Buttons */}
      <CardActions sx={{ px: 1, py: 0.5 }}>
        {/* Like Button */}
        <Button
          startIcon={liked ? <Favorite color="error" /> : <FavoriteBorder />}
          onClick={handleLike}
          disabled={!user}
          sx={{
            flex: 1,
            color: liked ? 'error.main' : 'text.secondary',
            fontWeight: 600,
            textTransform: 'none'
          }}
          size="small"
        >
          {liked ? 'Liked' : 'Like'}
        </Button>

        {/* Comment Toggle Button */}
        <Button
          startIcon={<ChatBubbleOutline />}
          onClick={() => setShowComments(!showComments)}
          sx={{ flex: 1, color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}
          size="small"
        >
          Comment
        </Button>
      </CardActions>

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Divider />
        <Box sx={{ px: 2, py: 1.5, bgcolor: '#F8FAFC' }}>
          {/* Existing Comments */}
          {comments.map((comment) => (
            <Box key={comment._id} display="flex" gap={1.5} mb={1.5}>
              <Avatar
                src={comment.author?.avatar}
                sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 13, fontWeight: 700 }}
              >
                {comment.author?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                  flex: 1,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
                }}
              >
                <Typography variant="caption" fontWeight={700} display="block">
                  {comment.author?.username}
                </Typography>
                <Typography variant="body2">{comment.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeAgo(comment.createdAt)}
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Add Comment Input */}
          {user && (
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <Avatar
                src={user.avatar}
                sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </Avatar>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleComment()}
                inputProps={{ maxLength: 300 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    bgcolor: 'white'
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={handleComment}
                disabled={!commentText.trim() || commentLoading}
                size="small"
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default PostCard;
