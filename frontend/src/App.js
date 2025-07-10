import React, { useState } from 'react';
import { 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  Container,
  Grid,
  Paper,
  useMediaQuery
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TweetBox from './components/TweetBox';
import Footer from './components/Footer';
import FiltersPanel from './components/FilterPanel';
import GraphPanel from './components/GraphPanel';
import EventDetails from './components/EventDetails';
import AdminPanel from './components/AdminPanel';
import APITest from './components/APITest';
import DashboardStats from './components/DashboardStats';

// Create a modern theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2027',
      secondary: '#637381',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

function Dashboard() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [clickedEvent, setClickedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Container maxWidth="xl" sx={{ py: 3, height: '100%' }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        {/* Tweet Input Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <TweetBox />
          </Paper>
        </Grid>

        {/* Dashboard Stats */}
        <Grid item xs={12}>
          <DashboardStats />
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} sx={{ height: 'calc(100vh - 400px)', minHeight: 600 }}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            {/* Left Panel: Filters and Events */}
            <Grid item xs={12} md={3} sx={{ height: '100%' }}>
              <Paper sx={{ p: 2, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <FiltersPanel onEventSelect={setSelectedEvent} />
              </Paper>
            </Grid>

            {/* Center Panel: Single Graph */}
            <Grid item xs={12} md={6} sx={{ height: '100%' }}>
              <Paper sx={{ p: 2, height: '100%', overflow: 'hidden' }}>
                <GraphPanel 
                  selectedEvent={selectedEvent} 
                  onEventClick={setClickedEvent}
                />
              </Paper>
            </Grid>

            {/* Right Panel: Event Details */}
            <Grid item xs={12} md={3} sx={{ height: '100%' }}>
              <Paper sx={{ p: 2, height: '100%', overflow: 'hidden' }}>
                <EventDetails event={clickedEvent} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}>
          <Header />
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/test" element={<APITest />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
