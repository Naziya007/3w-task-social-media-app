import React, { useState, useRef } from 'react';
import {
  Card, CardContent, Box, Avatar, TextField, Button,
  IconButton, Typography, CircularProgress, Alert
} from '@mui/material';
import { Image, Close, Send } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// Component for creating a new post (text + optional image)
const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle image file selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setImage(file);
    // Create preview URL using FileReader
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit post
  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      setError('Add some text or an image to post');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use FormData to send(image + text)
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (image) formData.append('image', image);

      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Reset form
      setText('');
      setImage(null);
      setPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Notify  to add new post to feed
      onPostCreated(data.post);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  // Avatar letter fallback
  const avatarLetter = user?.username?.charAt(0).toUpperCase();

  return (
    <Card sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" gap={2}>
          {/* User Avatar */}
          <Avatar
            src={user?.avatar}
            sx={{ width: 44, height: 44, bgcolor: 'primary.main', fontWeight: 700 }}
          >
            {avatarLetter}
          </Avatar>

          {/* Post Input Area */}
          <Box flex={1}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              placeholder={`What's on your mind, ${user?.username}?`}
              value={text}
              onChange={(e) => { setText(e.target.value); setError(''); }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#F8FAFC'
                }
              }}
              inputProps={{ maxLength: 500 }}
            />

            {/* Character count */}
            {text.length > 400 && (
              <Typography variant="caption" color={text.length >= 500 ? 'error' : 'text.secondary'} mt={0.5} display="block" textAlign="right">
                {text.length}/500
              </Typography>
            )}

            {/* Image Preview */}
            {preview && (
              <Box mt={2} position="relative" display="inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 250, borderRadius: 8, display: 'block', objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
                  sx={{
                    position: 'absolute', top: 6, right: 6,
                    bgcolor: 'rgba(0,0,0,0.6)', color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
                <Chip
                  label={image?.name}
                  size="small"
                  sx={{ mt: 1, maxWidth: '100%', fontSize: 11 }}
                />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Action Buttons */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Box>
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageSelect}
                />
                <IconButton
                  color="primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  title="Add Image"
                >
                  <Image />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  Add photo
                </Typography>
              </Box>
              <Button
                variant="contained"
                endIcon={
                  loading ? (
                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                  ) : (
                    <Send sx={{ color: "#fff" }} />
                  )
                }
                onClick={handleSubmit}
                disabled={loading || (!text.trim() && !image)}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 20,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#fff",
                  backgroundColor: "#1677ff",

                  "&:hover": {
                    backgroundColor: "#0f5fd8"
                  },

                  "&.Mui-disabled": {
                    backgroundColor: "#0f5fd8",
                    color: "#fff"
                  }
                }}
              >
                {loading ? "Posting..." : "Post"}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
