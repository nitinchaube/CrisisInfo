#!/bin/bash

# Production deployment script
set -e

echo "🚀 Starting production deployment..."

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env file not found!"
    echo "Please copy backend/env.example to backend/.env and configure it."
    exit 1
fi

if [ ! -f "frontend/.env" ]; then
    echo "❌ Error: frontend/.env file not found!"
    echo "Please copy frontend/env.example to frontend/.env and configure it."
    exit 1
fi

echo "✅ Environment files found"

# Build and deploy backend
echo "📦 Building backend..."
cd backend
docker build -t event-intelligence-backend .
cd ..

# Build and deploy frontend
echo "📦 Building frontend..."
cd frontend
docker build -t event-intelligence-frontend .
cd ..

# Deploy with docker-compose
echo " Deploying services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check health
echo "🔍 Checking service health..."
curl -f http://localhost:5002/health || exit 1
curl -f http://localhost:3000 || exit 1

echo "✅ Deployment completed successfully!"
