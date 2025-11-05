# Render Deployment Guide for Maharaja Bellerose Raffle

## Prerequisites
1. Push all code to your GitHub repository
2. Have a Render account

## Deployment Steps

### 1. Connect Repository
- Go to [render.com](https://render.com)
- Click "New +" > "Blueprint"
- Connect your GitHub repository: `maharaja-raffle-new`

### 2. Configure Blueprint
Render will automatically detect the `render.yaml` file and create:
- **Web Service**: `maharaja-bellerose-raffle`
- **PostgreSQL Database**: `maharaja-raffle-db`

### 3. Environment Variables (Auto-configured)
```
NODE_ENV=production
ADMIN_PASSWORD=admin123secure
DATABASE_URL=[Auto-generated from database]
```

### 4. Deployment Process
1. Database will be created first
2. Web service will:
   - Install dependencies: `npm install`
   - Generate Prisma client: `npx prisma generate`
   - Build Next.js: `npm run build`
   - Push database schema: `npx prisma db push`
   - Seed database: `npm run seed`
   - Start application: `npm start`

### 5. Access Your Application
- **Main App**: `https://maharaja-bellerose-raffle.onrender.com`
- **Draw Page**: `https://maharaja-bellerose-raffle.onrender.com/draw`
- **Admin Panel**: `https://maharaja-bellerose-raffle.onrender.com/admin`

### 6. Admin Access
- Username: `admin`
- Password: `admin123secure`

## Important Notes

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- Database has connection limits

### Performance Tips
- Keep the draw page open to prevent cold starts during events
- Consider upgrading to paid tier for events with >50 participants

### Troubleshooting

#### Database Connection Issues
```bash
# Check database status in Render dashboard
# Verify DATABASE_URL environment variable
```

#### Build Failures
```bash
# Common issues:
# - Missing dependencies in package.json
# - TypeScript errors
# - Prisma schema issues
```

#### Seed Data Issues
```bash
# If seed fails, check Render logs:
# - Database permissions
# - Schema sync issues
```

## File Changes Made for Render

### 1. `render.yaml`
- Configured PostgreSQL database
- Set proper build and start commands
- Added environment variables

### 2. `package.json`
- Updated start command for port binding
- Added render-setup script

### 3. `prisma/seed.ts`
- Simplified seed data for testing
- Added proper error handling

## Post-Deployment

### Add Your Real Data
1. Access admin panel: `/admin`
2. Upload your CSV with all 47 entries
3. Test the raffle system

### Monitor Performance
- Check Render dashboard for metrics
- Monitor database connection usage
- Watch for cold start delays

## Support
- Render Documentation: https://render.com/docs
- Prisma on Render: https://render.com/docs/deploy-prisma