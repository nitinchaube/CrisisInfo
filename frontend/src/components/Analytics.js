import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import config from '../config';

function Analytics() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/allEvents`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching events');
        setLoading(false);
      });
  }, []);

  const getAnalytics = () => {
    const totalEvents = events.length;
    const eventTypes = [...new Set(events.map(e => e.event_type))].length;
    const locations = [...new Set(events.flatMap(e => e.locations?.split(',').map(l => l.trim()) || []))].length;
    const categories = [...new Set(events.map(e => e.category))].length;
    
    return { totalEvents, eventTypes, locations, categories };
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const analytics = getAnalytics();

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Analytics Dashboard</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Events</Typography>
                <Typography variant="h4">{analytics.totalEvents}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Event Types</Typography>
                <Typography variant="h4">{analytics.eventTypes}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Locations</Typography>
                <Typography variant="h4">{analytics.locations}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Categories</Typography>
                <Typography variant="h4">{analytics.categories}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Analytics; 