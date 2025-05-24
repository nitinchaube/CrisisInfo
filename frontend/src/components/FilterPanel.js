import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  List,
  ListItemButton,
  CircularProgress, Box
} from '@mui/material';

const FiltersPanel = ({ onEventSelect }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetch('http://localhost:5000/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setFilters(generateFilterOptions(data));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  }, []);

  const generateFilterOptions = (data) => {
    const eventTypes = new Set();
    const locations = new Set();
    const categories = new Set();

    data.forEach((e) => {
      if (e.event_type) eventTypes.add(e.event_type);
      if (e.locations) e.locations.split(',').map((l) => locations.add(l.trim()));
      if (e.category) categories.add(e.category);
    });

    return { eventTypes, locations, categories };
  };

  const handleFilterChange = (type, value) => {
    const newSet = new Set(selectedFilters[type]);
    newSet.has(value) ? newSet.delete(value) : newSet.add(value);
    setSelectedFilters({ ...selectedFilters, [type]: newSet });
  };

  const matchesFilters = (event) => {
    const { eventTypes, locations, categories } = selectedFilters;
    const locArray = event.locations?.split(',').map((l) => l.trim()) || [];

    return (
      (eventTypes.size === 0 || eventTypes.has(event.event_type)) &&
      (locations.size === 0 || locArray.some((loc) => locations.has(loc))) &&
      (categories.size === 0 || categories.has(event.category))
    );
  };

  const renderCheckboxGroup = (title, values, filterKey) => (
    <>
      <Typography variant="subtitle2" sx={{ mt: 2 }}>{title}</Typography>
      <FormGroup>
        {[...values].map((val) => (
          <FormControlLabel
            key={val}
            control={
              <Checkbox
                checked={selectedFilters[filterKey].has(val)}
                onChange={() => handleFilterChange(filterKey, val)}
              />
            }
            label={val}
          />
        ))}
      </FormGroup>
      <Divider sx={{ my: 1 }} />
    </>
  );

  const filteredEvents = events.filter(matchesFilters);

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Filters</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {renderCheckboxGroup('Event Types', filters.eventTypes, 'eventTypes')}
          {renderCheckboxGroup('Locations', filters.locations, 'locations')}
          {renderCheckboxGroup('Categories', filters.categories, 'categories')}

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Filtered Events ({filteredEvents.length})
          </Typography>
          <List dense>
            {filteredEvents.map((event) => (
              <ListItemButton
                key={event.id}
                onClick={() => onEventSelect && onEventSelect(event)}
              >
                <Typography variant="body2">{event.event_type} - {event.locations}</Typography>
              </ListItemButton>
            ))}
          </List>
        </>
      )}
    </Paper>
    </Box>
    
  );
};

export default FiltersPanel;
