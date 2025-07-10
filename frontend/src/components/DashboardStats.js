import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import config from '../config';

const StatCard = ({ title, value, icon, color, subtitle, loading }) => {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent sx={{ p: 3 }}>
        {loading ? (
          <Box>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={32} />
            <Skeleton variant="text" width="80%" height={16} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: `${color}15`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

function DashboardStats() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    eventTypes: 0,
    locations: 0,
    categories: 0,
    recentEvents: 0,
    avgEventSize: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/allEvents`);
        const events = await response.json();
        
        const eventTypes = new Set(events.map(e => e.event_type)).size;
        const locations = new Set(
          events.flatMap(e => e.locations ? e.locations.split(',').map(l => l.trim()) : [])
        ).size;
        const categories = new Set(events.map(e => e.category)).size;
        const recentEvents = events.filter(e => {
          const eventDate = new Date(e.timestamp || Date.now());
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return eventDate > weekAgo;
        }).length;

        setStats({
          totalEvents: events.length,
          eventTypes,
          locations,
          categories,
          recentEvents,
          avgEventSize: events.length > 0 ? Math.round(events.length / 10) : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: <EventIcon />,
      color: '#1976d2',
      subtitle: 'All time events'
    },
    {
      title: 'Event Types',
      value: stats.eventTypes,
      icon: <CategoryIcon />,
      color: '#2e7d32',
      subtitle: 'Unique event categories'
    },
    {
      title: 'Locations',
      value: stats.locations,
      icon: <LocationIcon />,
      color: '#ed6c02',
      subtitle: 'Geographic coverage'
    },
    {
      title: 'Recent Events',
      value: stats.recentEvents,
      icon: <TrendingUpIcon />,
      color: '#9c27b0',
      subtitle: 'Last 7 days'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: <AnalyticsIcon />,
      color: '#d32f2f',
      subtitle: 'Event classifications'
    },
    {
      title: 'Avg Events/Day',
      value: stats.avgEventSize,
      icon: <TimelineIcon />,
      color: '#7b1fa2',
      subtitle: 'Daily average'
    }
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <StatCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            subtitle={card.subtitle}
            loading={loading}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardStats; 