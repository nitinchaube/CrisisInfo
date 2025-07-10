import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  IconButton,
  Tooltip,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Paper
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
  Fullscreen as FullscreenIcon,
  Info as InfoIcon,
  Public as GlobalIcon,
  Event as EventIcon
} from '@mui/icons-material';
import ForceGraph2D from 'react-force-graph-2d';
import config from '../config';

const GraphPanel = ({ selectedEvent, onEventClick }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [graphInfo, setGraphInfo] = useState({ nodes: 0, links: 0 });
  const [viewMode, setViewMode] = useState('global'); // 'global' or 'selected'
  const graphRef = useRef();

  // Fetch all events for global graph
  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/allEvents`)
      .then((res) => res.json())
      .then((data) => {
        setAllEvents(data);
        if (viewMode === 'global') {
          generateGlobalGraph(data);
        }
      })
      .catch((err) => {
        setError('Error fetching events for global graph');
      });
  }, []);

  // Update graph when view mode or selected event changes
  useEffect(() => {
    if (viewMode === 'global') {
      generateGlobalGraph(allEvents);
    } else if (viewMode === 'selected' && selectedEvent) {
      generateSelectedEventGraph(selectedEvent);
    } else if (viewMode === 'selected' && !selectedEvent) {
      setGraphData({ nodes: [], links: [] });
      setGraphInfo({ nodes: 0, links: 0 });
    }
  }, [viewMode, selectedEvent, allEvents]);

  // Auto-refit graph when data changes - removed duplicate centering
  useEffect(() => {
    if (graphData.nodes.length > 0 && graphRef.current) {
      setTimeout(() => {
        graphRef.current.zoomToFit(50, 50);
      }, 200);
    }
  }, [graphData]);

  // Generate global graph with much better spacing
  const generateGlobalGraph = (events) => {
    setLoading(true);
    try {
      const nodes = [];
      const links = [];
      
      // Create a much more spread out layout
      const eventsPerRow = 2; // Only 2 events per row
      const rowHeight = 600; // Much more vertical spacing
      const colWidth = 800; // Much more horizontal spacing
      
      events.forEach((event, index) => {
        const row = Math.floor(index / eventsPerRow);
        const col = index % eventsPerRow;
        const x = (col - eventsPerRow / 2) * colWidth;
        const y = row * rowHeight;
        
        const eventNode = {
          id: event.id,
          label: event.event_type,
          group: 'event',
          val: 6, // Larger nodes
          category: event.category,
          eventData: event,
          x: x,
          y: y,
          fx: x, // Fixed x position
          fy: y  // Fixed y position
        };
        nodes.push(eventNode);
        
        // Create location nodes with much better positioning
        if (event.locations) {
          const locations = event.locations.split(',').map(loc => loc.trim());
          locations.forEach((location, locIndex) => {
            const locationNode = {
              id: `loc_${location}`,
              label: location,
              group: 'location',
              val: 5, // Larger location nodes
              x: x + (locIndex - locations.length / 2) * 300, // Much more spacing
              y: y + 300, // Much more distance from event
              fx: x + (locIndex - locations.length / 2) * 300, // Fixed x position
              fy: y + 300  // Fixed y position
            };
            
            // Only add location node if it doesn't exist
            if (!nodes.find(n => n.id === `loc_${location}`)) {
              nodes.push(locationNode);
            }
            
            // Link event to location
            links.push({
              source: event.id,
              target: `loc_${location}`,
              group: 'event-location'
            });
          });
        }
      });
      
      setGraphData({ nodes, links });
      setGraphInfo({ nodes: nodes.length, links: links.length });
      setError(null);
    } catch (err) {
      setError('Error generating global graph');
    } finally {
      setLoading(false);
    }
  };

  // Generate selected event graph with much better spacing
  const generateSelectedEventGraph = (event) => {
    setLoading(true);
    try {
      const rootId = event.event_type || 'Event';
      const nodes = [{ 
        id: rootId, 
        group: 'root', 
        val: 7, // Largest root node
        eventData: event,
        x: 0,
        y: 0,
        fx: 0, // Fixed x position
        fy: 0  // Fixed y position
      }];
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
      const keysPerRow = 2; // Only 2 properties per row
      
      keys.forEach((key, i) => {
        const val = typeof event[key] === 'string' ? event[key] : JSON.stringify(event[key]);
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const group = getGroup(key);
        const row = Math.floor(i / keysPerRow);
        const col = i % keysPerRow;
        const x = (col - keysPerRow / 2) * 600; // Much more spacing
        const y = (row + 1) * 400; // Much more spacing
        
        nodes.push({ 
          id: `${key}: ${val}`,
          group, 
          x, 
          y, 
          val: 5, // Larger property nodes
          label: label,
          value: val,
          fx: x, // Fixed x position
          fy: y  // Fixed y position
        });
        links.push({ source: rootId, target: `${key}: ${val}`, group });
      });
      
      setGraphData({ nodes, links });
      setGraphInfo({ nodes: nodes.length, links: links.length });
      setError(null);
    } catch (err) {
      setError('Error rendering event graph');
    } finally {
      setLoading(false);
    }
  };

  const groupColors = {
    root: 'rgba(26, 35, 126, 0.8)', // Transparent dark blue
    event: 'rgba(25, 118, 210, 0.8)', // Transparent blue
    location: 'rgba(46, 125, 50, 0.8)', // Transparent green
    summary: 'rgba(245, 124, 0, 0.8)', // Transparent orange
    people: 'rgba(211, 47, 47, 0.8)', // Transparent red
    infra: 'rgba(2, 136, 209, 0.8)', // Transparent light blue
    meta: 'rgba(123, 31, 162, 0.8)', // Transparent purple
    default: 'rgba(97, 97, 97, 0.8)', // Transparent gray
  };

  const edgeColors = {
    'event-location': 'rgba(76, 175, 80, 0.6)', // Transparent green
    summary: 'rgba(255, 152, 0, 0.6)', // Transparent orange
    people: 'rgba(244, 67, 54, 0.6)', // Transparent red
    infra: 'rgba(33, 150, 243, 0.6)', // Transparent blue
    location: 'rgba(76, 175, 80, 0.6)', // Transparent green
    meta: 'rgba(156, 39, 176, 0.6)', // Transparent purple
    default: 'rgba(158, 158, 158, 0.6)', // Transparent gray
  };

  const getTitle = () => {
    if (viewMode === 'global') return 'Global Event Network';
    if (selectedEvent) return `${selectedEvent.event_type} - Event Details`;
    return 'Select an event to view its graph';
  };

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(1.3, 1000);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(0.5, 1000);
    }
  };

  const handleRefresh = () => {
    if (graphRef.current) {
      // Always fit the graph to the component with padding and center it
      graphRef.current.zoomToFit(50, 50);
      // Center the graph view at the center of the component
      setTimeout(() => {
        if (graphRef.current && graphData.nodes.length > 0) {
          // Calculate the center of all nodes
          const xCoords = graphData.nodes.map(n => n.x);
          const yCoords = graphData.nodes.map(n => n.y);
          const centerX = (Math.min(...xCoords) + Math.max(...xCoords)) / 2;
          const centerY = (Math.min(...yCoords) + Math.max(...yCoords)) / 2;
          // Center the view on the graph content, significantly to the left
          graphRef.current.centerAt(centerX + 1200, centerY, 1000);
        }
      }, 100);
    }
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleNodeClick = (node) => {
    if (node.eventData && onEventClick) {
      onEventClick(node.eventData);
    }
  };

    // Handle container resize to refit graph
  useEffect(() => {
    const handleResize = () => {
      if (graphRef.current) {
        setTimeout(() => {
          graphRef.current.zoomToFit(50, 50);
          // Center the graph view after resize
          setTimeout(() => {
            if (graphRef.current && graphData.nodes.length > 0) {
              // Calculate the center of all nodes
              const xCoords = graphData.nodes.map(n => n.x);
              const yCoords = graphData.nodes.map(n => n.y);
              const centerX = (Math.min(...xCoords) + Math.max(...xCoords)) / 2;
              const centerY = (Math.min(...yCoords) + Math.max(...yCoords)) / 2;
              // Center the view on the graph content, significantly to the left
              graphRef.current.centerAt(centerX + 1200, centerY, 1000);
            }
          }, 100);
        }, 100);
      }
    };

    // Listen to window resize
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [graphData]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {getTitle()}
          </Typography>
          {graphInfo.nodes > 0 && (
            <Chip 
              label={`${graphInfo.nodes} nodes, ${graphInfo.links} links`} 
              size="small" 
              variant="outlined"
              icon={<InfoIcon />}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            sx={{ mr: 1 }}
          >
            <ToggleButton value="global" sx={{ textTransform: 'none' }}>
              <GlobalIcon sx={{ mr: 0.5 }} />
              Global
            </ToggleButton>
            <ToggleButton value="selected" sx={{ textTransform: 'none' }}>
              <EventIcon sx={{ mr: 0.5 }} />
              Selected
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Graph Controls */}
          <Tooltip title="Zoom In">
            <IconButton size="small" onClick={handleZoomIn}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton size="small" onClick={handleZoomOut}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fit to View">
            <IconButton size="small" onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Graph Container */}
      <Box 
        ref={(el) => {
          if (el) {
            // Store container reference for sizing
            window.graphContainer = el;
          }
        }}
        sx={{ 
          flex: 1, 
          position: 'relative', 
          bgcolor: 'background.default', 
          borderRadius: 1, 
          overflow: 'hidden',
          width: '100%',
          height: '100%'
        }}
      >
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: 2
          }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Generating graph...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <Alert severity="error" sx={{ maxWidth: 400 }}>
              {error}
            </Alert>
          </Box>
        ) : graphData.nodes.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: 2
          }}>
            <Typography variant="h6" color="text.secondary">
              {viewMode === 'global' ? 'No events available' : 'Select an event to view graph'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {viewMode === 'global' ? 'Events will appear here once added' : 'Choose an event from the left panel'}
            </Typography>
          </Box>
        ) : (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            linkColor={link => edgeColors[link.group] || 'rgba(158, 158, 158, 0.6)'}
            linkDirectionalArrowLength={12}
            linkDirectionalArrowRelPos={1}
            linkWidth={2}
            width={undefined}
            height={undefined}
            enableZoomPanInteraction
            enablePointerInteraction
            nodeCanvasObject={(node, ctx, globalScale) => {
              const fontSize = Math.max(14, 18 / globalScale);
              const text = node.label || node.id;
              const displayText = text.length > 18 ? text.slice(0, 18) + '…' : text;
              const padding = 20;
              const textWidth = displayText.length * (fontSize * 0.6);
              const ellipseWidth = textWidth + padding * 2;
              const ellipseHeight = fontSize * 2.2;
              
              // Draw node background with shadow
              ctx.shadowColor = 'rgba(0,0,0,0.2)';
              ctx.shadowBlur = 8;
              ctx.shadowOffsetX = 1;
              ctx.shadowOffsetY = 1;
              
              ctx.beginPath();
              ctx.ellipse(node.x, node.y, ellipseWidth / 2, ellipseHeight / 2, 0, 0, Math.PI * 2);
              ctx.fillStyle = groupColors[node.group] || 'rgba(97, 97, 97, 0.8)';
              ctx.fill();
              
              // Reset shadow for text
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
              
              // Draw border
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.lineWidth = 2;
              ctx.stroke();
              
              // Draw text
              ctx.font = `bold ${fontSize}px Inter, sans-serif`;
              ctx.fillStyle = '#fff';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(displayText, node.x, node.y);
            }}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, 35, 0, 2 * Math.PI, false);
              ctx.fill();
            }}
            onNodeClick={handleNodeClick}
            onLinkClick={(link) => {
              console.log('Clicked link:', link);
            }}
            cooldownTicks={50}
            linkCurvature={0.05}
            d3AlphaDecay={0.01}
            d3VelocityDecay={0.1}
            onEngineStop={() => {
              if (graphRef.current) {
                // Always fit the graph to the component with padding and center it
                graphRef.current.zoomToFit(50, 50);
                // Center the graph view at the center of the component
                setTimeout(() => {
                  if (graphRef.current && graphData.nodes.length > 0) {
                    // Calculate the center of all nodes
                    const xCoords = graphData.nodes.map(n => n.x);
                    const yCoords = graphData.nodes.map(n => n.y);
                    const centerX = (Math.min(...xCoords) + Math.max(...xCoords)) / 2;
                    const centerY = (Math.min(...yCoords) + Math.max(...yCoords)) / 2;
                    // Center the view on the graph content, significantly to the left
                    graphRef.current.centerAt(centerX + 1200, centerY, 1000);
                  }
                }, 100);
              }
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default GraphPanel;

