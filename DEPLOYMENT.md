# Minsah Beauty - Production Deployment Checklist

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Set `NODE_ENV=production`
- [ ] Set `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Generate and set `NEXTAUTH_SECRET` (min 32 characters)
- [ ] Generate and set `JWT_SECRET` (min 32 characters)
- [ ] Generate and set `JWT_REFRESH_SECRET` (min 32 characters)

### 2. Database (PostgreSQL)
- [ ] Set `DATABASE_URL` with production credentials
- [ ] Set `DIRECT_URL` (same as DATABASE_URL for Coolify)
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Seed initial data if needed: `npm run db:seed`
- [ ] Verify database connection via health check

### 3. Redis
- [ ] Set `REDIS_URL` with production credentials
- [ ] Verify Redis connection via health check

### 4. MinIO Object Storage
- [ ] Set `MINIO_ENDPOINT` (internal hostname)
- [ ] Set `MINIO_PORT` (default: 9000)
- [ ] Set `MINIO_ACCESS_KEY`
- [ ] Set `MINIO_SECRET_KEY`
- [ ] Set `MINIO_BUCKET_NAME` (e.g., minsah-products)
- [ ] Set `MINIO_USE_SSL` (true if using HTTPS)
- [ ] Set `NEXT_PUBLIC_MINIO_PUBLIC_URL` for public access
- [ ] Create required buckets:
  - minsah-products
  - minsah-categories
  - minsah-banners
  - minsah-users

### 5. Security
- [ ] All secrets are securely stored (not in code)
- [ ] HTTPS is configured
- [ ] CORS is properly configured (`ALLOWED_ORIGINS`)
- [ ] Rate limiting is enabled
- [ ] CSP headers are configured

### 6. Optional Integrations

#### OAuth Providers
- [ ] Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- [ ] Facebook OAuth: `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`

#### Payment Gateways
- [ ] bKash: Configure all `BKASH_*` variables
- [ ] Nagad: Configure all `NAGAD_*` variables
- [ ] SSLCommerz: Configure all `SSLCOMMERZ_*` variables

#### Analytics
- [ ] Google Analytics: `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- [ ] Facebook Pixel: `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`

#### Email
- [ ] Configure SMTP settings for password reset emails

---

## Deployment Steps (Coolify)

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git status
git add .
git commit -m "Production ready"
git push origin main
```

### Step 2: Configure Coolify
1. Create a new service in Coolify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm start` or use Docker
5. Configure environment variables from `.env.example`

### Step 3: Set Environment Variables
In Coolify's environment section, add all required variables:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://minsahbeauty.cloud
NEXTAUTH_URL=https://minsahbeauty.cloud
NEXTAUTH_SECRET=<generate-secure-secret>
JWT_SECRET=<generate-secure-secret>
JWT_REFRESH_SECRET=<generate-secure-secret>
DATABASE_URL=postgresql://minsah:password@postgres-host:5432/minsah_beauty
REDIS_URL=redis://default:password@redis-host:6379
MINIO_ENDPOINT=minio-host
MINIO_PORT=9000
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET_NAME=minsah-products
```

### Step 4: Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npm run db:seed
```

### Step 5: Deploy
1. Trigger deployment in Coolify
2. Monitor build logs for errors
3. Wait for health check to pass

### Step 6: Verify Deployment
```bash
# Check health endpoint
curl https://minsahbeauty.cloud/api/health

# Expected response:
{
  "status": "healthy",
  "services": {
    "database": { "status": "healthy" },
    "redis": { "status": "healthy" },
    "minio": { "status": "healthy" }
  }
}
```

---

## Post-Deployment Checklist

### Verify Critical Functionality
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Product pages load
- [ ] Images load from MinIO
- [ ] Admin panel accessible (after login)
- [ ] Health check returns healthy

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error alerting
- [ ] Review application logs

### Backup Strategy
- [ ] PostgreSQL automated backups configured
- [ ] MinIO backup strategy in place
- [ ] Test restore procedure

---

## Troubleshooting

### Common Issues

#### Database Connection Failed
```
Error: Can't reach database server
```
- Verify `DATABASE_URL` is correct
- Check if PostgreSQL is running
- Verify network connectivity

#### Redis Connection Failed
```
Error: Redis connection refused
```
- Verify `REDIS_URL` is correct
- Check if Redis is running
- Application will continue with degraded functionality

#### MinIO Connection Failed
```
Error: MinIO bucket not found
```
- Verify MinIO credentials
- Create buckets manually if needed
- Check MinIO console at port 9001

#### JWT Errors
```
Error: JWT_SECRET environment variable is not set
```
- Ensure all JWT secrets are set
- Secrets must be at least 32 characters

---

## Security Reminders

1. **Never commit secrets** to version control
2. **Rotate secrets** periodically
3. **Use HTTPS** in production
4. **Keep dependencies updated** (`npm audit`)
5. **Monitor for security advisories**

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/your-repo/issues
- Email: support@minsahbeauty.cloud
