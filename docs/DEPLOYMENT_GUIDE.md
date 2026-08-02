# Deployment Guide

The Task Automation Platform is designed for flexible deployment across various hosting providers. The primary and recommended deployment strategy is using Docker Compose on a Linux VPS (Ubuntu 24.04 LTS).

## Supported Targets
- Ubuntu VPS (DigitalOcean, AWS EC2, Hetzner, Contabo, etc.)
- Render (Backend)
- Netlify / Vercel (Frontend)

## Option A: Primary Deployment (Docker Compose on VPS)

### 1. Server Provisioning
1. Provision a VPS (e.g., Ubuntu 24.04 LTS) with at least 2GB RAM and 2 vCPUs.
2. Install Docker and Docker Compose:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker $USER
   ```

### 2. Application Setup
1. Clone the repository to the server.
2. Copy the production environment file:
   ```bash
   cp .env.production.example .env
   ```
3. Update the `.env` file with your secure passwords (POSTGRES_PASSWORD, JWT_SECRET, etc.). Ensure `CORS_ORIGIN` matches your public domain.

### 3. Start the Services
1. Run the production compose file:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d --build
   ```
2. Verify services are running:
   ```bash
   docker-compose ps
   ```

### 4. Reverse Proxy & SSL (Nginx)
The included `docker-compose.production.yml` uses Nginx to expose port 80 and 443.
To enable SSL, you can use certbot on the host or inside a separate certbot container.
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Option B: PaaS Deployment (Render / Vercel)

### Backend (Render)
1. Connect your GitHub repository to Render.
2. Create a new "Web Service".
3. Environment: `Node`
4. Build Command: `npm ci && npm run prisma:generate && npm run build:shared && npm run build:backend`
5. Start Command: `npm run start --workspace=apps/backend`
6. Provide environment variables via Render Dashboard.

### Frontend (Vercel or Netlify)
1. Import the repository into Vercel/Netlify.
2. Root Directory: `apps/frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add `VITE_API_BASE_URL` pointing to your deployed backend URL.

## Database & Redis
For PaaS deployments, use managed databases:
- PostgreSQL (e.g., Supabase, Neon, Render Postgres).
- Redis (e.g., Upstash, Redis Cloud).
