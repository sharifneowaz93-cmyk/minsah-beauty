# Minsah Beauty - Production Deployment Guide

## Dokploy Deployment on Self-Hosted VPS

This guide covers deploying Minsah Beauty using Dokploy with your existing PostgreSQL, Redis, and MinIO services.

---

## Your Infrastructure Details

### PostgreSQL Database
```
Host: minsahbeauty-postgresql-hnk0lp
Port: 5432
Database: minsah_beauty_production-1
User: minsah
Password: S3Aq2WMiWlPx6ShurLZx
```

### Redis Cache
```
Host: minsahbeauty-redis-8joh2w
Port: 6379
User: default
Password: jysQsU7qbi2AaaFXnu17
```

### MinIO Object Storage
```
Internal Endpoint: minsahbeauty-minio:9000
External API URL: http://93.127.166.227:9000
Console URL: http://93.127.166.227:9001
Access Key: minsah_admin
Secret Key: MinsahBeauty2024SecurePassword123!

Buckets to Create:
- minsah-products
- minsah-categories
- minsah-banners
- minsah-users
```

---

## Pre-Deployment Checklist

### 1. Generate Secure Secrets
Run these commands on your local machine to generate secrets:

```bash
# Generate JWT_SECRET (32+ chars)
openssl rand -base64 32
# Example output: Ks8jF2mN4pQ7rT1uX3wZ5yB8cE0gI2kL4nO6qS9vW1x=

# Generate JWT_REFRESH_SECRET (32+ chars)
openssl rand -base64 32
# Example output: A1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC=

# Generate NEXTAUTH_SECRET (32+ chars)
openssl rand -base64 32
# Example output: X9yZ0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ=
```

### 2. Create MinIO Buckets
Access MinIO Console at `http://93.127.166.227:9001`:
1. Login with `minsah_admin` / `MinsahBeauty2024SecurePassword123!`
2. Navigate to **Buckets** → **Create Bucket**
3. Create these buckets:
   - `minsah-products`
   - `minsah-categories`
   - `minsah-banners`
   - `minsah-users`
4. Set bucket policies to allow public read access for products/categories/banners

---

## Dokploy Configuration

### Step 1: Create New Application in Dokploy

1. Open Dokploy dashboard
2. Click **Add New Application**
3. Select **Docker** or **Git Repository**
4. Configure the source (GitHub/GitLab or Docker image)

### Step 2: Environment Variables

Add these environment variables in Dokploy:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com

# Authentication Secrets (use your generated secrets)
NEXTAUTH_SECRET=your-generated-nextauth-secret
JWT_SECRET=your-generated-jwt-secret
JWT_REFRESH_SECRET=your-generated-jwt-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Database
DATABASE_URL=postgresql://minsah:S3Aq2WMiWlPx6ShurLZx@minsahbeauty-postgresql-hnk0lp:5432/minsah_beauty_production-1
DIRECT_URL=postgresql://minsah:S3Aq2WMiWlPx6ShurLZx@minsahbeauty-postgresql-hnk0lp:5432/minsah_beauty_production-1

# Redis
REDIS_URL=redis://default:jysQsU7qbi2AaaFXnu17@minsahbeauty-redis-8joh2w:6379

# MinIO Storage
MINIO_ENDPOINT=minsahbeauty-minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minsah_admin
MINIO_SECRET_KEY=MinsahBeauty2024SecurePassword123!
MINIO_BUCKET_NAME=minsah-products
MINIO_USE_SSL=false
NEXT_PUBLIC_MINIO_PUBLIC_URL=http://93.127.166.227:9000

# CORS (add your domain)
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Logging
LOG_LEVEL=info
```

### Step 3: Docker Configuration

If using Docker deployment, use this configuration:

**Dockerfile** is already configured. Just ensure Dokploy uses:
- Build Command: (uses Dockerfile)
- Exposed Port: 3000

### Step 4: Network Configuration

Ensure your Dokploy app can reach:
- PostgreSQL on internal network: `minsahbeauty-postgresql-hnk0lp:5432`
- Redis on internal network: `minsahbeauty-redis-8joh2w:6379`
- MinIO on internal network: `minsahbeauty-minio:9000`

In Dokploy, you may need to:
1. Add the app to the same Docker network as your databases
2. Or use the VPS internal IP addresses instead of hostnames

### Step 5: Domain & SSL

1. In Dokploy, go to **Domains**
2. Add your domain (e.g., `minsahbeauty.cloud`)
3. Enable **HTTPS** with Let's Encrypt
4. Set the target port to `3000`

---

## Database Setup

### Run Migrations

After deployment, run database migrations. You can do this via Dokploy's terminal or SSH:

```bash
# Connect to the container
docker exec -it <container-name> sh

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional - creates admin user)
npm run db:seed
```

Or using Dokploy's deployment scripts:
```bash
npx prisma migrate deploy && npm start
```

### Default Admin User (from seed)
After seeding, an admin user is created. Change the password immediately:
- Email: Check seed file
- Password: Set via environment variable `DEFAULT_ADMIN_PASSWORD`

---

## Post-Deployment Verification

### 1. Check Health Endpoint

```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "0.1.0",
  "services": {
    "database": { "status": "healthy", "latency": 5 },
    "redis": { "status": "healthy", "latency": 2 },
    "minio": { "status": "healthy", "latency": 10 }
  }
}
```

### 2. Verify Each Service

| Test | Command | Expected |
|------|---------|----------|
| Homepage | `curl https://your-domain.com` | HTML response |
| API Health | `curl https://your-domain.com/api/health` | `"status": "healthy"` |
| User Registration | Test in browser | Success message |
| Admin Login | `https://your-domain.com/admin/login` | Login form |
| Image Loading | Check product images | Images from MinIO |

### 3. Test Authentication Flow

1. Register a new user at `/register`
2. Check email verification (if configured)
3. Login at `/login`
4. Access account dashboard
5. Logout and verify session cleared

---

## Monitoring & Logs

### View Application Logs

In Dokploy:
1. Go to your application
2. Click **Logs** tab
3. View real-time logs

Or via Docker:
```bash
docker logs -f <container-name>
```

### Log Format

Production logs are in JSON format for easy parsing:
```json
{
  "timestamp": "2024-01-20T12:00:00.000Z",
  "level": "info",
  "message": "User logged in successfully",
  "context": "auth:login",
  "data": { "userId": "abc123" }
}
```

### Set Up Alerts

Configure Dokploy to alert you when:
- Health check fails
- Container restarts
- High CPU/memory usage

---

## Backup Strategy

### PostgreSQL Backup

Set up automated backups in your VPS:

```bash
# Create backup script
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
docker exec minsahbeauty-postgresql-hnk0lp pg_dump -U minsah minsah_beauty_production-1 > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -mtime +7 -delete
```

Add to cron:
```bash
0 2 * * * /path/to/backup-script.sh
```

### MinIO Backup

Use MinIO Client (mc) to sync to another location:
```bash
mc alias set myminio http://93.127.166.227:9000 minsah_admin MinsahBeauty2024SecurePassword123!
mc mirror myminio/minsah-products /backups/minio/products
```

---

## Troubleshooting

### Database Connection Issues

**Error:** `Can't reach database server`

Solutions:
1. Check if PostgreSQL container is running:
   ```bash
   docker ps | grep postgresql
   ```
2. Verify network connectivity:
   ```bash
   docker exec <app-container> ping minsahbeauty-postgresql-hnk0lp
   ```
3. Check DATABASE_URL is correct
4. Ensure app is on same Docker network

### Redis Connection Issues

**Error:** `Redis connection refused`

Solutions:
1. Check Redis container:
   ```bash
   docker ps | grep redis
   ```
2. Test connection:
   ```bash
   redis-cli -h minsahbeauty-redis-8joh2w -p 6379 -a jysQsU7qbi2AaaFXnu17 ping
   ```

### MinIO Issues

**Error:** `Bucket not found`

Solutions:
1. Verify buckets exist in MinIO Console
2. Check credentials are correct
3. Verify network access to MinIO

### Build Failures

**Error:** `Prisma generate failed`

Solutions:
1. Clear Dokploy cache and rebuild
2. Ensure `prisma` is in dependencies (not devDependencies for Docker)
3. Check Dockerfile copies prisma folder correctly

---

## Security Reminders

1. **Change default passwords** after first deployment
2. **Rotate secrets** every 90 days
3. **Enable HTTPS** for all traffic
4. **Restrict MinIO** console access (port 9001) to VPN/internal only
5. **Update regularly**: `npm audit fix`
6. **Monitor failed logins** via logs

---

## Quick Reference

### Important URLs

| Service | URL |
|---------|-----|
| App | https://your-domain.com |
| Admin | https://your-domain.com/admin |
| Health Check | https://your-domain.com/api/health |
| MinIO Console | http://93.127.166.227:9001 |

### Important Commands

```bash
# View logs
docker logs -f <container>

# Run migrations
docker exec <container> npx prisma migrate deploy

# Clear Redis cache
docker exec <redis-container> redis-cli -a jysQsU7qbi2AaaFXnu17 FLUSHALL

# Restart app
docker restart <container>
```

### Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| NODE_ENV | Yes | Set to `production` |
| DATABASE_URL | Yes | PostgreSQL connection string |
| JWT_SECRET | Yes | Auth token signing |
| JWT_REFRESH_SECRET | Yes | Refresh token signing |
| NEXTAUTH_SECRET | Yes | NextAuth.js secret |
| REDIS_URL | Yes | Redis connection string |
| MINIO_ENDPOINT | Yes | MinIO hostname |
| MINIO_ACCESS_KEY | Yes | MinIO credentials |
| MINIO_SECRET_KEY | Yes | MinIO credentials |

---

## Support

For deployment issues:
1. Check Dokploy logs first
2. Verify all environment variables are set
3. Test health endpoint for service status
4. Review this guide's troubleshooting section
