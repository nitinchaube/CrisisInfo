import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  Checkbox,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Edit,
  Delete,
  Merge,
  Refresh,
  Search,
  FilterList,
  Warning,
  CheckCircle,
  Error
} from '@mui/icons-material';
import config from '../config';

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [mergeData, setMergeData] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN_EVENTS}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      showNotification('Error fetching events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN_DELETE}/${eventId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        showNotification(result.message, 'success');
        fetchEvents();
        // Trigger refresh in other components
        window.dispatchEvent(new CustomEvent('refreshEvents'));
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      showNotification('Error deleting event', 'error');
    }
  };

  const handleUpdateEvent = async (eventId, updatedData) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN_DELETE}/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const result = await response.json();
        showNotification(result.message, 'success');
        setEditDialogOpen(false);
        fetchEvents();
        // Trigger refresh in other components
        window.dispatchEvent(new CustomEvent('refreshEvents'));
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      showNotification('Error updating event', 'error');
    }
  };

  const handleMergeEvents = async () => {
    if (selectedEvents.length < 2) {
      showNotification('Select at least 2 events to merge', 'warning');
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN_MERGE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_ids: selectedEvents,
          merge_data: mergeData
        })
      });

      if (response.ok) {
        const result = await response.json();
        showNotification(result.message, 'success');
        setMergeDialogOpen(false);
        setSelectedEvents([]);
        setMergeData({});
        fetchEvents();
        // Trigger refresh in other components
        window.dispatchEvent(new CustomEvent('refreshEvents'));
      } else {
        throw new Error('Failed to merge events');
      }
    } catch (error) {
      console.error('Error merging events:', error);
      showNotification('Error merging events', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.length === 0) {
      showNotification('Select events to delete', 'warning');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedEvents.length} events?`)) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN_BULK_DELETE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_ids: selectedEvents
        })
      });

      if (response.ok) {
        const result = await response.json();
        showNotification(result.message, 'success');
        setSelectedEvents([]);
        fetchEvents();
        // Trigger refresh in other components
        window.dispatchEvent(new CustomEvent('refreshEvents'));
      } else {
        throw new Error('Failed to delete events');
      }
    } catch (error) {
      console.error('Error bulk deleting events:', error);
      showNotification('Error deleting events', 'error');
    }
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(event => event.id));
    }
  };

  const filteredEvents = events.filter(event =>
    event.event_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.locations?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedEvents = filteredEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getSeverityColor = (event) => {
    const peopleKilled = event.people_killed;
    if (typeof peopleKilled === 'string') {
      if (peopleKilled.toLowerCase().includes('unknown') || peopleKilled.toLowerCase().includes('not')) {
        return 'success';
      }
      const num = parseInt(peopleKilled);
      if (isNaN(num)) return 'success';
      if (num > 50) return 'error';
      if (num > 10) return 'warning';
      return 'success';
    }
    if (typeof peopleKilled === 'number') {
      if (peopleKilled > 50) return 'error';
      if (peopleKilled > 10) return 'warning';
      return 'success';
    }
    return 'success';
  };

  const getSeverityIcon = (event) => {
    const color = getSeverityColor(event);
    switch (color) {
      case 'error': return <Error fontSize="small" />;
      case 'warning': return <Warning fontSize="small" />;
      case 'success': return <CheckCircle fontSize="small" />;
      default: return <CheckCircle fontSize="small" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            🛠️ Admin Panel - Event Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchEvents}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                localStorage.removeItem('adminAuthenticated');
                window.location.reload();
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Events
                </Typography>
                <Typography variant="h4">
                  {events.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Selected
                </Typography>
                <Typography variant="h4">
                  {selectedEvents.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Filtered
                </Typography>
                <Typography variant="h4">
                  {filteredEvents.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Showing
                </Typography>
                <Typography variant="h4">
                  {paginatedEvents.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Actions */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            label="Search events..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<Merge />}
            onClick={() => setMergeDialogOpen(true)}
            disabled={selectedEvents.length < 2}
          >
            Merge Selected ({selectedEvents.length})
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleBulkDelete}
            disabled={selectedEvents.length === 0}
          >
            Delete Selected ({selectedEvents.length})
          </Button>
        </Box>

        {/* Events Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                    indeterminate={selectedEvents.length > 0 && selectedEvents.length < filteredEvents.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEvents.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedEvents.includes(event.id)}
                      onChange={() => handleSelectEvent(event.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {event.event_type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {event.locations}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={event.category} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getSeverityIcon(event)}
                      <Typography variant="body2">
                        {event.people_killed || 'Unknown'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {event.summary}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Event">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setCurrentEvent(event);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Event">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredEvents.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          {currentEvent && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Event Type"
                    defaultValue={currentEvent.event_type}
                    onChange={(e) => setCurrentEvent({...currentEvent, event_type: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    defaultValue={currentEvent.locations}
                    onChange={(e) => setCurrentEvent({...currentEvent, locations: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Category"
                    defaultValue={currentEvent.category}
                    onChange={(e) => setCurrentEvent({...currentEvent, category: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="People Killed"
                    defaultValue={currentEvent.people_killed}
                    onChange={(e) => setCurrentEvent({...currentEvent, people_killed: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Summary"
                    defaultValue={currentEvent.summary}
                    onChange={(e) => setCurrentEvent({...currentEvent, summary: e.target.value})}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleUpdateEvent(currentEvent?.id, currentEvent)}
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Merge Dialog */}
      <Dialog open={mergeDialogOpen} onClose={() => setMergeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Merge Events</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Merging {selectedEvents.length} events. Provide the details for the merged event:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Event Type"
                value={mergeData.event_type || ''}
                onChange={(e) => setMergeData({...mergeData, event_type: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={mergeData.locations || ''}
                onChange={(e) => setMergeData({...mergeData, locations: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={mergeData.category || ''}
                onChange={(e) => setMergeData({...mergeData, category: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="People Killed"
                value={mergeData.people_killed || ''}
                onChange={(e) => setMergeData({...mergeData, people_killed: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Summary"
                value={mergeData.summary || ''}
                onChange={(e) => setMergeData({...mergeData, summary: e.target.value})}
                placeholder="Combined summary of all events..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMergeDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleMergeEvents}
            variant="contained"
            color="primary"
          >
            Merge Events
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPanel; 