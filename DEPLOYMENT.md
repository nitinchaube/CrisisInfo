# Production Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- OpenAI API key (optional, for enhanced event extraction)
- Domain name (for production)

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd <your-repo>
   ```

2. **Configure Environment Variables**
   ```bash
   # Backend configuration
   cp backend/env.example backend/.env
   # Edit backend/.env with your values
   
   # Frontend configuration  
   cp frontend/env.example frontend/.env
   # Edit frontend/.env with your values
   ```

3. **Deploy**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5002
   - Admin Panel: http://localhost:3000 (Admin tab)

## Environment Variables

### Backend (.env)
```bash
# Required
SECRET_KEY=your-super-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here

# Optional (have defaults)
FLASK_ENV=production
PORT=5002
LOG_LEVEL=INFO
```

### Frontend (.env)
```bash
# Required
REACT_APP_API_URL=http://localhost:5002

# Optional
REACT_APP_WS_URL=ws://localhost:5002
REACT_APP_ENABLE_ADMIN_PANEL=true
```

## Production Considerations

### Security
- ✅ Change default SECRET_KEY
- ✅ Use HTTPS in production
- ✅ Configure CORS_ORIGINS properly
- ✅ Set up proper firewall rules
- ✅ Use environment variables for secrets

### Performance
- ✅ Enable gzip compression (nginx)
- ✅ Configure proper caching headers
- ✅ Monitor resource usage
- ✅ Set up logging and monitoring

### Scalability
- ✅ Use external database (PostgreSQL/MySQL)
- ✅ Set up load balancing
- ✅ Configure auto-scaling
- ✅ Use CDN for static assets

## Monitoring

### Health Checks
- Backend: `curl http://localhost:5002/health`
- Frontend: `curl http://localhost:3000`

### Logs
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Check specific service
docker-compose logs backend
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the ports
   lsof -i :5002
   lsof -i :3000
   lsof -i :80
   ```

2. **Docker build failures**
   ```bash
   # Clean and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

3. **Environment variables not loading**
   ```bash
   # Check if .env files exist
   ls -la backend/.env
   ls -la frontend/.env
   ```

4. **ChromaDB issues**
   ```bash
   # Reset ChromaDB
   rm -rf backend/chroma_db/*
   docker-compose restart backend
   ```

### Debug Mode
```bash
# Run in debug mode
FLASK_DEBUG=True docker-compose up
```

## SSL/HTTPS Setup

1. **Generate SSL certificates**
   ```bash
   mkdir ssl
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout ssl/nginx.key -out ssl/nginx.crt
   ```

2. **Update nginx.conf** for SSL
3. **Update docker-compose.yml** to mount SSL certificates
4. **Update frontend config** to use HTTPS

## Backup and Recovery

### Database Backup
```bash
# Backup ChromaDB
tar -czf chroma_backup_$(date +%Y%m%d).tar.gz backend/chroma_db/

# Backup events
cp backend/events.json events_backup_$(date +%Y%m%d).json
```

### Restore
```bash
# Restore ChromaDB
tar -xzf chroma_backup_YYYYMMDD.tar.gz -C backend/

# Restore events
cp events_backup_YYYYMMDD.json backend/events.json
```

## Updates and Maintenance

### Update Application
```bash
git pull origin main
./deploy.sh
```

### Update Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt --upgrade

# Frontend
cd frontend
npm update
```

## Support

For issues and questions:
1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Check health endpoints
4. Review this deployment guide 