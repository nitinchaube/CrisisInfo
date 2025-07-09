# Render Deployment Guide

## Overview
This guide will help you deploy both the backend and frontend services to Render.

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- OpenAI API key

## Step 1: Prepare Your Repository

### 1.1 Ensure your repository structure is correct:
```
Project/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── Procfile
│   └── ...
├── frontend/
│   ├── package.json
│   ├── src/
│   └── ...
└── render.yaml
```

### 1.2 Push your code to GitHub:
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

## Step 2: Deploy Backend Service

### 2.1 Create Backend Service on Render:
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `event-intelligence-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT`
   - **Root Directory**: `backend/`

### 2.2 Set Environment Variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `FLASK_ENV`: `production`
- `CORS_ORIGINS`: `https://event-intelligence-frontend.onrender.com` (update after frontend deployment)

### 2.3 Deploy:
- Click "Create Web Service"
- Wait for the build to complete
- Note the backend URL (e.g., `https://event-intelligence-backend.onrender.com`)

## Step 3: Deploy Frontend Service

### 3.1 Create Frontend Service on Render:
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `event-intelligence-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Root Directory**: `frontend/`

### 3.2 Set Environment Variables:
- `REACT_APP_API_URL`: Your backend URL from Step 2.3

### 3.3 Deploy:
- Click "Create Static Site"
- Wait for the build to complete
- Note the frontend URL (e.g., `https://event-intelligence-frontend.onrender.com`)

## Step 4: Update CORS Configuration

### 4.1 Update Backend CORS:
1. Go back to your backend service on Render
2. Update the `CORS_ORIGINS` environment variable with your frontend URL
3. Redeploy the backend service

## Step 5: Verify Deployment

### 5.1 Test Backend:
- Visit: `https://your-backend-url.onrender.com/api/allEvents`
- Should return JSON data

### 5.2 Test Frontend:
- Visit your frontend URL
- Should load the React application
- Test the tweet submission functionality

## Alternative: Using render.yaml (Blue-Green Deployment)

If you want to deploy both services at once:

1. Ensure `render.yaml` is in your repository root
2. Go to Render Dashboard
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically create both services based on the configuration

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in requirements.txt
   - Verify file paths in build commands

2. **CORS Errors**:
   - Ensure CORS_ORIGINS includes your frontend URL
   - Check that frontend is using the correct backend URL

3. **Model Loading Issues**:
   - Ensure model files are in the repository
   - Check model paths in your code

4. **Memory Issues**:
   - Render free tier has memory limits
   - Consider upgrading to paid plan for larger models

### Environment Variables Reference:

**Backend:**
- `OPENAI_API_KEY`: Required for GPT integration
- `FLASK_ENV`: Set to `production`
- `CORS_ORIGINS`: Frontend URL
- `PORT`: Automatically set by Render

**Frontend:**
- `REACT_APP_API_URL`: Backend service URL

## Cost Considerations

- **Free Tier**: 
  - 750 hours/month per service
  - Services sleep after 15 minutes of inactivity
  - Limited memory and CPU

- **Paid Plans**: 
  - Always-on services
  - More resources for larger models
  - Better performance

## Next Steps

1. Set up custom domains (optional)
2. Configure SSL certificates (automatic on Render)
3. Set up monitoring and logging
4. Consider database migration if needed 