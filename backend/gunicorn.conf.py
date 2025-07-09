import multiprocessing
import os

# Gunicorn configuration
bind = "0.0.0.0:5002"
workers = 1  # Reduce from default to avoid rate limiting
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', 5002)}"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
worker_connections = 1000
timeout = 30
keepalive = 2

# Restart workers after this many requests, to help prevent memory leaks
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Process naming
proc_name = 'event-intelligence-api'

# Server mechanics
daemon = False
pidfile = '/tmp/gunicorn.pid'
user = None
group = None
tmp_upload_dir = None

# SSL (uncomment for HTTPS)
# keyfile = '/path/to/keyfile'
# certfile = '/path/to/certfile'
