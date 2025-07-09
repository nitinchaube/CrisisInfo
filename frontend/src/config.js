// Frontend configuration
const config = {
  // API URL - will be set by environment variable in production
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5002',
  
  // App settings
  APP_NAME: 'Event Intelligence Dashboard',
  VERSION: '1.0.0',
  
  // Feature flags
  ENABLE_REAL_TIME: true,
  ENABLE_ADMIN_PANEL: true,
  
  // UI settings
  REFRESH_INTERVAL: 30000,
  MAX_EVENTS_DISPLAY: 50,
  
  // API endpoints
  ENDPOINTS: {
    SUBMIT_TWEET: '/api/submitTweet',
    ALL_EVENTS: '/api/allEvents',
    GRAPH: '/api/graph',
    STATS: '/api/stats',
    ADMIN_EVENTS: '/api/admin/events',
    ADMIN_DELETE: '/api/admin/events',
    ADMIN_MERGE: '/api/admin/events/merge',
    ADMIN_BULK_DELETE: '/api/admin/events/bulk-delete',
  }
};

export default config; 