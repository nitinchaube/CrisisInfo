// 
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
    const nodes = [{ id: rootId, group: 'root', val: 2 }];
    const links = [];

    const fieldGroups = {
      summary: 'summary',
      people: 'people',
      infrastructure: 'infra',
      location: 'location',
      category: 'meta',
      other_details: 'meta',
    };

    const getGroup = (key) => {
      for (const type in fieldGroups) {
        if (key.includes(type)) return fieldGroups[type];
      }
      return 'default';
    };

    const keys = Object.keys(event).filter(k => k !== 'event_type' && k !== 'id');
    const angleStep = (2 * Math.PI) / keys.length;

    keys.forEach((key, i) => {
      const val = typeof event[key] === 'string' ? event[key] : JSON.stringify(event[key]);
      const label = `${key}: ${val}`;
      const group = getGroup(key);

      const angle = i * angleStep;
      const radius = 300;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      nodes.push({ id: label, group, x, y, val: 1 });
      links.push({ source: rootId, target: label, group });
    });

    setGraphData({ nodes, links });

    setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(400, 40);
      }
    }, 300);
  }, [event]);

  const groupColors = {
    root: '#333333',
    summary: '#ffb74d',
    people: '#ef5350',
    infra: '#42a5f5',
    location: '#66bb6a',
    meta: '#ba68c8',
    default: '#90a4ae',
  };

  const edgeColors = {
    summary: '#ffa726',
    people: '#e57373',
    infra: '#64b5f6',
    location: '#81c784',
    meta: '#ce93d8',
    default: '#b0bec5',
  };

  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <Paper sx={{ p: 2, height: '100%' }}>
        {!event ? (
          <Typography variant="h6">Select an event to view its graph</Typography>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {event.event_type} - Event Graph
            </Typography>
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              linkColor={link => edgeColors[link.group] || '#ccc'}
              linkDirectionalArrowLength={4}
              linkDirectionalArrowRelPos={1}
              width={window.innerWidth * 0.72}
              height={window.innerHeight * 0.7}
              enableZoomPanInteraction
              enablePointerInteraction
              nodeCanvasObject={(node, ctx, globalScale) => {
                const fontSize = 10 / globalScale;
                const text = node.id.length > 60 ? node.id.slice(0, 60) + '…' : node.id;
                const padding = 6;
                const ellipseWidth = text.length * (fontSize * 0.6) + padding * 2;
                const ellipseHeight = fontSize * 2;

                // Draw oval
                ctx.beginPath();
                ctx.ellipse(node.x, node.y, ellipseWidth / 2, ellipseHeight / 2, 0, 0, Math.PI * 2);
                ctx.fillStyle = groupColors[node.group] || '#ccc';
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.stroke();

                // Draw text
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, node.x, node.y);
              }}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default GraphPanel;

