# Minsah Beauty - Coolify Deployment Guide

## Domain: minsahbeauty.cloud

This guide walks you through deploying Minsah Beauty on Coolify with PostgreSQL, Redis, and MinIO.

## Prerequisites

1. Hostinger VPS with Coolify installed
2. Domain `minsahbeauty.cloud` pointed to your VPS IP
3. SSL certificates configured in Coolify

## Step 1: Create Services in Coolify

### 1.1 Create PostgreSQL Database

1. Go to **Resources** > **New** > **Database** > **PostgreSQL**
2. Configure:
   - Name: `minsah-beauty-postgres`
   - Database: `minsah_beauty`
   - User: `minsah`
   - Password: Generate a strong password
   - Port: `5432`
3. Save and start the service

### 1.2 Create Redis Cache

1. Go to **Resources** > **New** > **Database** > **Redis**
2. Configure:
   - Name: `minsah-beauty-redis`
   - Port: `6379`
3. Save and start the service

### 1.3 Create MinIO Storage

1. Go to **Resources** > **New** > **Service** > **MinIO**
2. Configure:
   - Name: `minsah-beauty-minio`
   - Root User: Generate access key
   - Root Password: Generate secret key
   - Ports: `9000` (API), `9001` (Console)
3. Configure domain: `storage.minsahbeauty.cloud`
4. Save and start the service

### 1.4 Create Next.js Application

1. Go to **Resources** > **New** > **Application**
2. Connect your GitHub repository
3. Select branch: `main`
4. Build pack: **Dockerfile**
5. Configure domains:
   - `minsahbeauty.cloud`
   - `www.minsahbeauty.cloud`

## Step 2: Configure Environment Variables

Add these environment variables in your application settings:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://minsahbeauty.cloud
NEXTAUTH_URL=https://minsahbeauty.cloud
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# JWT (Generate with: openssl rand -base64 32)
JWT_SECRET=<your-jwt-secret>
JWT_REFRESH_SECRET=<your-jwt-refresh-secret>

# Database (Use Coolify service URL)
DATABASE_URL=postgresql://minsah:<password>@<postgres-host>:5432/minsah_beauty?schema=public
DIRECT_URL=postgresql://minsah:<password>@<postgres-host>:5432/minsah_beauty?schema=public

# Redis (Use Coolify service URL)
REDIS_URL=redis://<redis-host>:6379

# MinIO
MINIO_ENDPOINT=<minio-host>
MINIO_PORT=9000
MINIO_ACCESS_KEY=<your-access-key>
MINIO_SECRET_KEY=<your-secret-key>
MINIO_BUCKET_NAME=minsah-beauty
MINIO_USE_SSL=false
NEXT_PUBLIC_MINIO_PUBLIC_URL=https://storage.minsahbeauty.cloud

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Facebook OAuth (from Facebook Developers)
FACEBOOK_CLIENT_ID=<your-facebook-app-id>
FACEBOOK_CLIENT_SECRET=<your-facebook-app-secret>

# CORS
ALLOWED_ORIGINS=https://minsahbeauty.cloud,https://www.minsahbeauty.cloud
```

## Step 3: Configure OAuth Providers

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** > **Credentials**
4. Create **OAuth 2.0 Client ID**
5. Configure:
   - Application type: Web application
   - Authorized JavaScript origins:
     - `https://minsahbeauty.cloud`
   - Authorized redirect URIs:
     - `https://minsahbeauty.cloud/api/auth/callback/google`
6. Copy Client ID and Secret to environment variables

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (Consumer type)
3. Add **Facebook Login** product
4. Configure:
   - Valid OAuth Redirect URIs:
     - `https://minsahbeauty.cloud/api/auth/callback/facebook`
5. Copy App ID and Secret to environment variables

## Step 4: Initial Database Setup

After first deployment, run these commands:

```bash
# Connect to your application container
coolify exec <app-container-id> sh

# Run database migrations
npx prisma migrate deploy

# Seed the database with initial data
npm run db:seed
```

## Step 5: Create MinIO Bucket

```bash
# Connect to MinIO container
coolify exec <minio-container-id> sh

# Create bucket using mc client
mc alias set myminio http://localhost:9000 <access-key> <secret-key>
mc mb myminio/minsah-beauty
mc anonymous set download myminio/minsah-beauty/products
mc anonymous set download myminio/minsah-beauty/categories
mc anonymous set download myminio/minsah-beauty/brands
mc anonymous set download myminio/minsah-beauty/avatars
```

## Step 6: Post-Deployment

### Default Admin Login

After seeding the database:
- **Email**: `admin@minsahbeauty.cloud`
- **Password**: `ChangeThisPassword123!`

**IMPORTANT**: Change this password immediately after first login!

### Health Check

Verify deployment at: `https://minsahbeauty.cloud/api/health`

## DNS Configuration

Configure these DNS records:

| Type  | Name      | Value           |
|-------|-----------|-----------------|
| A     | @         | <VPS-IP>        |
| A     | www       | <VPS-IP>        |
| A     | storage   | <VPS-IP>        |

## SSL Configuration

Coolify handles SSL automatically with Let's Encrypt. Ensure:
1. DNS is properly configured
2. Ports 80 and 443 are open
3. SSL is enabled in application settings

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if PostgreSQL service is running
- Ensure network connectivity between services

### OAuth Not Working
- Verify redirect URIs match exactly
- Check if credentials are correct
- Ensure NEXTAUTH_URL matches your domain

### Image Upload Issues
- Verify MinIO credentials
- Check bucket permissions
- Verify MINIO_ENDPOINT is accessible

## Monitoring

### Health Endpoints
- Application: `/api/health`
- Database: Check Coolify PostgreSQL metrics
- Redis: Check Coolify Redis metrics

### Logs
Access logs through Coolify dashboard or:
```bash
coolify logs <container-id> -f
```

## Backup Strategy

### Database Backup
```bash
# Export database
pg_dump -U minsah -h <postgres-host> minsah_beauty > backup.sql
```

### MinIO Backup
```bash
# Sync to backup location
mc mirror myminio/minsah-beauty /backup/minio
```

## Security Checklist

- [ ] Changed default admin password
- [ ] Generated strong JWT secrets
- [ ] Configured CORS properly
- [ ] SSL certificates active
- [ ] Database credentials secured
- [ ] MinIO credentials secured
- [ ] OAuth credentials secured
- [ ] Regular backups configured
