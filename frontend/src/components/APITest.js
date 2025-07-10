import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Alert, CircularProgress } from '@mui/material';
import config from '../config';

function APITest() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      console.log('Testing API at:', config.API_BASE_URL);
      const response = await fetch(`${config.API_BASE_URL}/api/allEvents`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setStatus('success');
        console.log('API test successful:', result);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err.message);
      setStatus('error');
      console.error('API test failed:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>API Connection Test</Typography>
        <Typography variant="body2" gutterBottom>
          Testing connection to: {config.API_BASE_URL}
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={testAPI} 
          disabled={status === 'loading'}
          sx={{ mb: 2 }}
        >
          {status === 'loading' ? <CircularProgress size={20} /> : 'Test API Connection'}
        </Button>
        
        {status === 'success' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ API connection successful! Found {data?.length || 0} events.
          </Alert>
        )}
        
        {status === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            ❌ API connection failed: {error}
          </Alert>
        )}
        
        {data && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>Sample Data:</Typography>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(data.slice(0, 2), null, 2)}
            </pre>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default APITest; 