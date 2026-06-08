import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Button, CircularProgress,
  Alert, Skeleton, Card, CardContent
} from '@mui/material';
import { Refresh, AutoAwesome } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import api from '../utils/api';

// Skeleton loader for posts while fetching
const PostSkeleton = () => (
  <Card sx={{ mb: 2, borderRadius: 3 }}>
    <CardContent>
      <Box display="flex" gap={1.5} mb={2}>
        <Skeleton variant="circular" width={44} height={44} />
        <Box flex={1}>
          <Skeleton width="30%" height={20} />
          <Skeleton width="20%" height={16} />
        </Box>
      </Box>
      <Skeleton width="90%" height={20} />
      <Skeleton width="70%" height={20} />
      <Skeleton variant="rectangular" height={200} sx={{ mt: 1, borderRadius: 2 }} />
    </CardContent>
  </Card>
);

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch posts from API
  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      const { data } = await api.get(`/posts?page=${pageNum}&limit=10`);

      setPosts((prev) =>
        append ? [...prev, ...data.posts] : data.posts
      );
      setTotalPages(data.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // Load more posts (pagination)
  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      setLoadingMore(true);
      fetchPosts(page + 1, true);
    }
  };

  // Add new post to top of feed
  const handlePostCreated = (newPost) => {
    // Enrich the new post with client-side flags
    const enriched = {
      ...newPost,
      likedByMe: false,
      likesCount: 0,
      commentsCount: 0,
      comments: []
    };
    setPosts((prev) => [enriched, ...prev]);
  };

  // Remove deleted post from feed
  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ py: 3, px: { xs: 1.5, sm: 3 } }}>
        {/* Page Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <AutoAwesome color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Social Feed
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={<Refresh />}
            onClick={() => { setLoading(true); fetchPosts(1); }}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Refresh
          </Button>
        </Box>

        {/* Create Post Box */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography fontSize={48}></Typography>
            <Typography variant="h6" fontWeight={700} mt={1}>
              No posts yet
            </Typography>
            <Typography color="text.secondary" mt={0.5}>
              Be the first to share something!
            </Typography>
          </Box>
        )}

        {/* Posts Feed */}
        {!loading && posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onPostDeleted={handlePostDeleted}
          />
        ))}

        {/* Load More Button */}
        {!loading && page < totalPages && (
          <Box textAlign="center" mt={2}>
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              disabled={loadingMore}
              sx={{ borderRadius: 8, px: 4, textTransform: 'none', fontWeight: 600 }}
            >
              {loadingMore ? <CircularProgress size={20} /> : 'Load More Posts'}
            </Button>
          </Box>
        )}

        {/* End of feed indicator */}
        {!loading && posts.length > 0 && page >= totalPages && (
          <Typography textAlign="center" color="text.secondary" variant="caption" mt={3} display="block">
           You're all caught up!
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default FeedPage;
