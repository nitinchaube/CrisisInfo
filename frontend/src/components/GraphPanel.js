import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ForceGraph2D from 'react-force-graph-2d';

const GraphPanel = ({ event }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const graphRef = useRef();

  useEffect(() => {
    if (!event) {
      setGraphData({ nodes: [], links: [] });
      return;
    }

    const rootId = event.event_type || 'Event';
    const nodes = [{ id: rootId, val: 4, color: '#1976d2' }];
    const links = [];

    Object.entries(event).forEach(([key, value]) => {
      if (key === 'event_type' || key === 'id') return;
      const displayValue =
        typeof value === 'string' ? value : JSON.stringify(value, null, 2);
      const label = `${key}: ${displayValue}`;
      nodes.push({ id: label, val: 1, color: '#90a4ae' });
      links.push({ source: rootId, target: label });
    });

    setGraphData({ nodes, links });

    // center and zoom slightly
    setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(400);
      }
    }, 300);
  }, [event]);

  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <Paper sx={{ p: 2, height: '100%' }}>
        {!event ? (
          <Typography variant="h6">Select an event to view its graph</Typography>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {event.event_type} - Graph
            </Typography>
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeLabel={(node) => node.id}
              nodeAutoColorBy="color"
              linkDirectionalArrowLength={6}
              linkDirectionalArrowRelPos={1}
              width={window.innerWidth * 0.72}
              height={window.innerHeight * 0.7}
              enableZoomPanInteraction
              enablePointerInteraction
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default GraphPanel;
