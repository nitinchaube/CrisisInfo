import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import config from '../config';

const FiltersPanel = ({ onEventSelect }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [filters, setFilters] = useState({
    eventTypes: new Set(),
    locations: new Set(),
    categories: new Set()
  });
  const [selectedFilters, setSelectedFilters] = useState({
    eventTypes: new Set(),
    locations: new Set(),
    categories: new Set()
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/allEvents`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        setFilters(generateFilterOptions(data));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Error fetching events: ' + err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const generateFilterOptions = (data) => {
    const eventTypes = new Set();
    const locations = new Set();
    const categories = new Set();
    
    data.forEach((e) => {
      if (e.event_type) eventTypes.add(e.event_type);
      if (e.locations) {
        e.locations.split(',').forEach(loc => {
          const trimmed = loc.trim();
          if (trimmed) locations.add(trimmed);
        });
      }
      if (e.category) categories.add(e.category);
    });
    
    return { eventTypes, locations, categories };
  };

  const handleFilterChange = (type, value) => {
    const newSet = new Set(selectedFilters[type]);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setSelectedFilters({ ...selectedFilters, [type]: newSet });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      eventTypes: new Set(),
      locations: new Set(),
      categories: new Set()
    });
    setSearchTerm('');
  };

  const handleEventSelect = (event) => {
    setSelectedEventId(event.id);
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  const matchesFilters = (event) => {
    const { eventTypes, locations, categories } = selectedFilters;
    
    // Check event type filter
    if (eventTypes.size > 0 && !eventTypes.has(event.event_type)) {
      return false;
    }
    
    // Check location filter
    if (locations.size > 0) {
      const eventLocations = event.locations ? 
        event.locations.split(',').map(l => l.trim()) : [];
      const hasMatchingLocation = eventLocations.some(loc => locations.has(loc));
      if (!hasMatchingLocation) {
        return false;
      }
    }
    
    // Check category filter
    if (categories.size > 0 && !categories.has(event.category)) {
      return false;
    }
    
    // Check search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (event.event_type && event.event_type.toLowerCase().includes(searchLower)) ||
        (event.locations && event.locations.toLowerCase().includes(searchLower)) ||
        (event.category && event.category.toLowerCase().includes(searchLower));
      if (!matchesSearch) {
        return false;
      }
    }
    
    return true;
  };

  const filteredEvents = events.filter(matchesFilters);

  const getActiveFiltersCount = () => {
    return selectedFilters.eventTypes.size + 
           selectedFilters.locations.size + 
           selectedFilters.categories.size + 
           (searchTerm ? 1 : 0);
  };

  const renderFilterSection = (title, values, filterKey, icon) => (
    <Accordion defaultExpanded={false} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {selectedFilters[filterKey].size > 0 && (
            <Chip 
              label={selectedFilters[filterKey].size} 
              size="small" 
              color="primary" 
              sx={{ ml: 'auto' }}
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <FormGroup>
          {[...values].slice(0, 8).map((val) => (
            <FormControlLabel
              key={val}
              control={
                <Checkbox
                  checked={selectedFilters[filterKey].has(val)}
                  onChange={() => handleFilterChange(filterKey, val)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {val}
                </Typography>
              }
            />
          ))}
          {values.size > 8 && (
            <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
              +{values.size - 8} more...
            </Typography>
          )}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon />
            Events & Filters
          </Typography>
          {getActiveFiltersCount() > 0 && (
            <Chip
              icon={<ClearIcon />}
              label="Clear All"
              size="small"
              onClick={clearAllFilters}
              color="default"
              variant="outlined"
            />
          )}
        </Box>
        
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Results Count */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredEvents.length} of {events.length} events
          </Typography>
          {getActiveFiltersCount() > 0 && (
            <Chip 
              label={`${getActiveFiltersCount()} active`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* Events List - Moved to top for better visibility */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Events
        </Typography>
        <List sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', borderRadius: 1 }}>
          {filteredEvents.length === 0 ? (
            <ListItem>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
                {getActiveFiltersCount() > 0 ? 'No events match your filters' : 'No events available'}
              </Typography>
            </ListItem>
          ) : (
            filteredEvents.slice(0, 30).map((event) => (
              <ListItem key={event.id} disablePadding>
                <ListItemButton 
                  onClick={() => handleEventSelect(event)}
                  selected={selectedEventId === event.id}
                  sx={{ 
                    py: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.main',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <EventIcon 
                      fontSize="small" 
                      color={selectedEventId === event.id ? 'inherit' : 'primary'} 
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {event.event_type}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {event.locations} • {event.category}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))
          )}
          {filteredEvents.length > 30 && (
            <ListItem>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
                +{filteredEvents.length - 30} more events...
              </Typography>
            </ListItem>
          )}
        </List>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Filter Sections - Collapsed by default */}
      <Box sx={{ flexShrink: 0 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Filters
        </Typography>
        {renderFilterSection('Event Types', filters.eventTypes, 'eventTypes', <EventIcon fontSize="small" />)}
        {renderFilterSection('Locations', filters.locations, 'locations', <LocationIcon fontSize="small" />)}
        {renderFilterSection('Categories', filters.categories, 'categories', <CategoryIcon fontSize="small" />)}
      </Box>
    </Box>
  );
};

export default FiltersPanel;
