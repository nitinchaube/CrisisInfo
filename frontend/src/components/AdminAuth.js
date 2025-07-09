import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { Lock, Security } from '@mui/icons-material';

const AdminAuth = ({ onAuthSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // Simple admin credentials (in production, this should be server-side)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (credentials.username === ADMIN_CREDENTIALS.username && 
        credentials.password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('adminAuthenticated', 'true');
      onAuthSuccess();
    } else {
      setError('Invalid credentials. Try admin/admin123');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    window.location.reload();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)'
    }}>
      <Card sx={{ 
        maxWidth: 400, 
        width: '100%', 
        mx: 2,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        borderRadius: '16px'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Security sx={{ fontSize: 60, color: '#3498db', mb: 2 }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 500, 
              color: '#2c3e50',
              letterSpacing: '0.5px'
            }}>
              Admin Access
            </Typography>
            <Typography variant="body2" color="#7f8c8d" sx={{ mt: 1 }}>
              Enter admin credentials to access the management panel
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#bdc3c7',
                  },
                  '&:hover fieldset': {
                    borderColor: '#95a5a6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3498db',
                  },
                },
              }}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: '#95a5a6' }} />
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#bdc3c7',
                  },
                  '&:hover fieldset': {
                    borderColor: '#95a5a6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3498db',
                  },
                },
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                borderRadius: '8px',
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                '&:hover': {
                  background: 'linear-gradient(135deg, #2980b9 0%, #1f5f8b 100%)',
                  boxShadow: '0 4px 12px rgba(52, 152, 219, 0.4)'
                }
              }}
            >
              Login to Admin Panel
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="caption" color="#95a5a6">
              Demo credentials: admin / admin123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminAuth; 