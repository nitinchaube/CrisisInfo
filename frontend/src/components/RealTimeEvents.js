import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Chip, Box, Divider, CircularProgress } from '@mui/material';
import { Warning, Info, Error } from '@mui/icons-material';
import config from '../config';

const RealTimeEvents = ({ events = [] }) => {
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent events from the database
  useEffect(() => {
    fetchRecentEvents();
    const interval = setInterval(fetchRecentEvents, 30000); // Refresh every 30 seconds
    
    // Listen for refresh events from tweet submission
    const handleRefresh = () => {
      console.log('Refreshing recent events...');
      fetchRecentEvents();
    };
    
    window.addEventListener('refreshEvents', handleRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshEvents', handleRefresh);
    };
  }, []);

  const fetchRecentEvents = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ALL_EVENTS}`);
      if (response.ok) {
        const allEvents = await response.json();
        // Take the most recent 10 events (assuming they're ordered by ID or timestamp)
        const recent = allEvents.slice(-10).reverse();
        setRecentEvents(recent);
      }
    } catch (error) {
      console.error('Error fetching recent events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error fontSize="small" color="error" />;
      case 'medium': return <Warning fontSize="small" color="warning" />;
      case 'low': return <Info fontSize="small" color="info" />;
      default: return <Info fontSize="small" />;
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

  const getSeverity = (event) => {
    const peopleKilled = event.people_killed;
    if (typeof peopleKilled === 'string') {
      if (peopleKilled.toLowerCase().includes('unknown') || peopleKilled.toLowerCase().includes('not')) {
        return 'low';
      }
      const num = parseInt(peopleKilled);
      if (isNaN(num)) return 'low';
      if (num > 50) return 'high';
      if (num > 10) return 'medium';
      return 'low';
    }
    if (typeof peopleKilled === 'number') {
      if (peopleKilled > 50) return 'high';
      if (peopleKilled > 10) return 'medium';
      return 'low';
    }
    return 'low';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  // Combine WebSocket events with database events
  const allRecentEvents = [...events, ...recentEvents];
  const uniqueEvents = allRecentEvents.filter((event, index, self) => 
    index === self.findIndex(e => e.id === event.id)
  ).slice(0, 10);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        🔴 Recent Events
      </Typography>
      
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 1 }}>Loading recent events...</Typography>
        </Box>
      ) : uniqueEvents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
          <Typography variant="body2">
            No recent events
          </Typography>
          <Typography variant="caption" display="block">
            Submit a tweet to see events here
          </Typography>
        </Box>
      ) : (
        <List dense sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {uniqueEvents.map((eventData, index) => {
            const event = eventData.event || eventData;
            const severity = getSeverity(event);
            
            return (
              <React.Fragment key={event.id || index}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      {getSeverityIcon(severity)}
                      <Typography variant="body2" fontWeight="bold" sx={{ flex: 1 }}>
                        {event.event_type}
                      </Typography>
                      <Chip
                        label={severity}
                        size="small"
                        color={getSeverityColor(severity)}
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" display="block">
                      📍 {event.locations}
                    </Typography>
                    
                    {event.summary && (
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%'
                      }}>
                        {event.summary}
                      </Typography>
                    )}
                    
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {formatTime(eventData.timestamp || event.timestamp)}
                    </Typography>
                  </Box>
                </ListItem>
                {index < uniqueEvents.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      )}
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
        Shows the 10 most recent disaster events
      </Typography>
    </Paper>
  );
};

export default RealTimeEvents; 