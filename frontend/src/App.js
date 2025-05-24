import React, {useState} from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Header from './components/Header';
import TweetBox from './components/TweetBox';
import Footer from './components/Footer';
import FiltersPanel from './components/FilterPanel';
import GraphPanel from "./components/GraphPanel"

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <Box sx={{ flexShrink: 0 }}>
        <Header />
      </Box>

      {/* TweetBox */}
      <Box sx={{ px: 3, pt: 2, flexShrink: 0 }}>
        <TweetBox />
      </Box>

      {/* Scrollable Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'auto',
          px: 3,
          py: 2,
          gap: 2,
          bgcolor: '#f5f5f5',
        }}
      >
        {/* Left: Filters */}
        <Box sx={{ width: '25%', height: '100%', overflowY: 'auto' , display: 'flex', flexDirection: 'column'}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            <FiltersPanel onEventSelect={setSelectedEvent} />
          </Paper>
        </Box>

        {/* Right: Graph */}
        <Box sx={{ width: '75%', height: '100%', overflowY: 'auto',  display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Graph will appear here</Typography>
            <GraphPanel event={selectedEvent} />
          </Paper>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          flexShrink: 0,
          bgcolor: '#1976d2',
          color: 'white',
          textAlign: 'center',
          py: 1,
        }}
      >
        <Footer/>
      </Box>
    </Box>
  );
}

export default App;
