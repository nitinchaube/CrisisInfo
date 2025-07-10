import React from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Analytics as AnalyticsIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar 
            sx={{ 
              mr: 2, 
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 40,
              height: 40
            }}
          >
            <AnalyticsIcon />
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: 'white',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              Event Intelligence Dashboard
            </Typography>
            <Chip 
              label="AI-Powered Analytics" 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: '0.7rem',
                height: 20
              }} 
            />
          </Box>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            startIcon={<DashboardIcon />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            {!isMobile && 'Dashboard'}
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/admin"
            startIcon={<AdminIcon />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            {!isMobile && 'Admin'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
