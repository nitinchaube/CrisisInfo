import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Box, Typography, Chip } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  const handleSearch = (term) => {
    if (term.trim()) {
      // Add to recent searches
      const newRecentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      
      // Call parent search function
      onSearch && onSearch(term);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch && onSearch('');
  };

  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  const removeRecentSearch = (termToRemove) => {
    setRecentSearches(recentSearches.filter(term => term !== termToRemove));
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        🔍 Search Events
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search by event type, location, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputProps={{ 'aria-label': 'search events' }}
        />
        {searchTerm && (
          <IconButton size="small" onClick={handleClear} sx={{ mr: 1 }}>
            <Clear fontSize="small" />
          </IconButton>
        )}
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <Search />
        </IconButton>
      </Box>

      {recentSearches.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Recent searches:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {recentSearches.map((term, index) => (
              <Chip
                key={index}
                label={term}
                size="small"
                variant="outlined"
                onClick={() => handleRecentSearchClick(term)}
                onDelete={() => removeRecentSearch(term)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        💡 Tip: Use keywords like "earthquake", "flood", "fire" or location names
      </Typography>
    </Paper>
  );
};

export default SearchBar; 