# Deployment Guide

This guide covers deploying LaTeX AI Editor to various platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Docker Deployment](#docker-deployment)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [Environment Variables](#environment-variables)

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js v18+ installed locally
- ✅ All dependencies installed (`npm install`)
- ✅ Project builds successfully (`npm run build`)
- ✅ Backend server tested locally
- ✅ API keys for AI providers (optional)

## Build Configuration

### Frontend Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm run preview
```

The build output will be in the `dist/` directory.

### Backend Server

The backend server (`server/server.js`) needs to be deployed separately or alongside the frontend.

```bash
cd server
npm install
```

## Vercel Deployment

### Frontend Deployment

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel CLI**
   ```bash
   vercel
   ```

3. **Or connect GitHub repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

### Backend Deployment (Vercel Serverless)

Create `api/compile.js` in your project root:

```javascript
// This would be a serverless function
export default async function handler(req, res) {
  // Your compilation logic here
  // Forward to LaTeX.Online or implement compilation
}
```

Add to `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

### Environment Variables on Vercel

1. Go to Project Settings → Environment Variables
2. Add your variables:
   - `VITE_GEMINI_API_KEY`
   - `VITE_OPENAI_API_KEY`
   - etc.

## Netlify Deployment

### Via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

### Via GitHub Integration

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your repository
4. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Add your API keys

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-server.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## Docker Deployment

### Dockerfile for Frontend

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://backend:3001

  backend:
    build: ./server
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - CORS_ORIGINS=http://localhost
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Self-Hosted Deployment

### Using PM2 (Node.js Process Manager)

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Serve Frontend with nginx**
   ```bash
   sudo apt install nginx
   sudo cp nginx.conf /etc/nginx/sites-available/latex-editor
   sudo ln -s /etc/nginx/sites-available/latex-editor /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Start Backend with PM2**
   ```bash
   cd server
   pm2 start server.js --name latex-backend
   pm2 save
   pm2 startup
   ```

### nginx Configuration (Self-Hosted)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    root /var/www/latex-editor/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
sudo systemctl restart nginx
```

## Environment Variables

### Frontend (.env)

```bash
VITE_API_BASE_URL=https://your-api-domain.com
VITE_GEMINI_API_KEY=your_key_here
VITE_OPENAI_API_KEY=your_key_here
VITE_ANTHROPIC_API_KEY=your_key_here
```

### Backend (server/.env)

```bash
PORT=3001
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
NODE_ENV=production
```

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API is accessible
- [ ] LaTeX compilation works
- [ ] AI providers connect successfully
- [ ] File upload works (check size limits)
- [ ] localStorage persistence works
- [ ] PDF preview renders
- [ ] All routes work (no 404s)
- [ ] HTTPS enabled (if production)
- [ ] Error logging configured
- [ ] Performance optimized (gzip, caching)
- [ ] SEO meta tags present
- [ ] Favicon and logo load

## Monitoring

### Health Checks

Create health check endpoints:

```javascript
// server/server.js
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

### Logging

Use PM2 or cloud provider logging:

```bash
# PM2 logs
pm2 logs latex-backend

# Save logs
pm2 logs latex-backend --lines 1000 > logs.txt
```

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### API Connection Issues

- Check CORS settings
- Verify API base URL
- Check network/firewall rules
- Verify backend is running

### Performance Issues

- Enable gzip compression
- Add CDN (Cloudflare, etc.)
- Optimize images (already SVG)
- Enable browser caching
- Use production build (not dev)

## Scaling

### Load Balancing

Use nginx or cloud load balancer to distribute traffic:

```nginx
upstream backend {
    server backend1:3001;
    server backend2:3001;
    server backend3:3001;
}

location /api {
    proxy_pass http://backend;
}
```

### Caching

Implement Redis for caching compilation results:

```javascript
// Cache compiled PDFs
const redis = require('redis');
const client = redis.createClient();

// Before compilation
const cached = await client.get(codeHash);
if (cached) return cached;
```

## Support

For deployment issues:
- Check [GitHub Issues](repository-url/issues)
- Read [Documentation](README.md)
- Join community discussions

---

**Pro Tips:**
- Always test production build locally first
- Use environment variables for sensitive data
- Monitor server logs after deployment
- Set up automatic backups if storing user data
- Use CDN for static assets in production
