import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const EventDetails = ({ event, onClose }) => {
  if (!event) {
    return (
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        p: 3
      }}>
        <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Event Selected
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click on any event in the graph to view its details
        </Typography>
      </Box>
    );
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getFieldIcon = (key) => {
    const iconMap = {
      event_type: <EventIcon />,
      locations: <LocationIcon />,
      category: <CategoryIcon />,
      timestamp: <ScheduleIcon />,
      people: <PersonIcon />,
      infrastructure: <BusinessIcon />,
      summary: <DescriptionIcon />,
      other_details: <InfoIcon />
    };
    return iconMap[key] || <InfoIcon />;
  };

  const getFieldLabel = (key) => {
    const labelMap = {
      event_type: 'Event Type',
      locations: 'Locations',
      category: 'Category',
      timestamp: 'Timestamp',
      people: 'People Involved',
      infrastructure: 'Infrastructure',
      summary: 'Summary',
      other_details: 'Other Details'
    };
    return labelMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderFieldValue = (key, value) => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    if (key === 'timestamp') {
      return formatTimestamp(value);
    }
    return value || 'N/A';
  };

  const excludeFields = ['id', 'event_type']; // event_type is shown in header

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between',
        mb: 2,
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Event Details
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {event.event_type}
          </Typography>
          {event.category && (
            <Chip 
              label={event.category} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
        {onClose && (
          <Tooltip title="Close">
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Event Information */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List dense>
          {Object.entries(event)
            .filter(([key]) => !excludeFields.includes(key))
            .map(([key, value]) => (
              <ListItem key={key} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {getFieldIcon(key)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {getFieldLabel(key)}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 0.5,
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {renderFieldValue(key, value)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        mt: 2, 
        pt: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider' 
      }}>
        <Typography variant="caption" color="text.secondary">
          Event ID: {event.id}
        </Typography>
      </Box>
    </Box>
  );
};

export default EventDetails; 