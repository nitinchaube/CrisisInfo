import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, Chip, CircularProgress } from '@mui/material';
import { TrendingUp, TrendingDown, Warning, CheckCircle } from '@mui/icons-material';
import config from '../config';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    highSeverity: 0,
    mediumSeverity: 0,
    lowSeverity: 0,
    recentEvents: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    
    // Listen for refresh events from tweet submission
    const handleRefresh = () => {
      console.log('Refreshing stats...');
      fetchStats();
    };
    
    window.addEventListener('refreshEvents', handleRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshEvents', handleRefresh);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.STATS}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Warning fontSize="small" />;
      case 'medium': return <TrendingUp fontSize="small" />;
      case 'low': return <CheckCircle fontSize="small" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 1 }}>Loading stats...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        📊 Dashboard Statistics
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {stats.totalEvents}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Events
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
              {stats.recentEvents}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recent (24h)
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Severity Breakdown
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={getSeverityIcon('high')}
            label={`${stats.highSeverity} High`}
            color={getSeverityColor('high')}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={getSeverityIcon('medium')}
            label={`${stats.mediumSeverity} Medium`}
            color={getSeverityColor('medium')}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={getSeverityIcon('low')}
            label={`${stats.lowSeverity} Low`}
            color={getSeverityColor('low')}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      {stats.avgResponseTime > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Response Metrics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Avg Response Time: {stats.avgResponseTime.toFixed(1)}s
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default DashboardStats; 