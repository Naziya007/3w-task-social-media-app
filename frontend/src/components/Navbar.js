import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Avatar, Box, IconButton,
  Menu, MenuItem, ListItemIcon, Divider, Chip
} from '@mui/material';
import { AutoAwesome, Logout, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #E2E8F0',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 680, width: '100%', mx: 'auto', px: 2 }}>
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #EC4899)'
            }}
          >
            <AutoAwesome sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography fontWeight={800} fontSize={18} color="primary">
            Task Planet
          </Typography>
        </Box>

        {/* User Menu */}
        {user && (
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={user.username}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}
            />
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
              <Avatar
                src={user.avatar}
                sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontWeight: 700, fontSize: 14 }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem disabled>
                <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                <Box>
                  <Typography fontWeight={600} variant="body2">{user.username}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
