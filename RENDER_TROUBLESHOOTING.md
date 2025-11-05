# Render PostgreSQL Troubleshooting Guide

## Issue: Not seeing changes on Render PostgreSQL

### Step 1: Check if you've deployed to Render
- Go to [render.com](https://render.com) 
- Look for services named `maharaja-bellerose-raffle` and `maharaja-raffle-db`
- If you don't see them, you need to deploy first

### Step 2: Deploy to Render (if not done yet)
1. **Create Blueprint Deployment**:
   - Click "New +" → "Blueprint"
   - Connect GitHub repo: `anuragak7/maharaja-raffle-new`
   - Render will auto-detect `render.yaml`

### Step 3: Check Deployment Status
1. **In Render Dashboard**:
   - Check if build succeeded (green checkmark)
   - Look at deployment logs for errors
   - Verify database is connected

### Step 4: Common Issues & Solutions

#### Issue: Build Failed
**Check logs for:**
- `npm install` errors
- `npx prisma generate` errors  
- `npm run build` errors

**Solutions:**
- Verify package.json dependencies
- Check Node.js version compatibility
- Ensure all files are pushed to GitHub

#### Issue: Database Connection Failed
**Check logs for:**
- `DATABASE_URL` environment variable
- PostgreSQL connection errors
- Prisma schema issues

**Solutions:**
- Verify database service is running
- Check database name matches `maharaja-raffle-db`
- Ensure IP allowlist is empty (for Render internal connections)

#### Issue: Seed Failed
**Check logs for:**
- `npx prisma db push` errors
- `npm run seed` errors
- Duplicate entry errors

**Solutions:**
- Database schema conflicts
- Phone number duplicates
- Permissions issues

### Step 5: Force Redeploy
If changes aren't showing:
1. **Manual Redeploy**:
   - Go to your web service in Render
   - Click "Manual Deploy" → "Deploy latest commit"

2. **Environment Variables**:
   - Verify `DATABASE_URL` is set correctly
   - Check `NODE_ENV=production`
   - Confirm `ADMIN_PASSWORD=admin123secure`

### Step 6: Test Your Deployment
Once deployed, test these URLs:
- Main app: `https://maharaja-bellerose-raffle.onrender.com`
- Draw page: `https://maharaja-bellerose-raffle.onrender.com/draw`
- Admin panel: `https://maharaja-bellerose-raffle.onrender.com/admin`
- API test: `https://maharaja-bellerose-raffle.onrender.com/api/entries`

### Step 7: Database Verification
Test the API endpoint to see if your 47 entries are loaded:
```bash
curl https://maharaja-bellerose-raffle.onrender.com/api/entries
```

Should return JSON with all 47 entries.

### Updated Files (just pushed):
- ✅ `prisma/seed.ts` - Now includes all 47 real entries
- ✅ `render.yaml` - Proper PostgreSQL configuration
- ✅ `package.json` - Render-compatible scripts

### Next Steps:
1. **If not deployed yet**: Create Blueprint deployment on Render
2. **If already deployed**: Check deployment logs and manually redeploy
3. **If still issues**: Share the Render deployment logs for further diagnosis

### Quick Test:
After deployment, your PostgreSQL should have:
- 47 entries (John, SARBJIT, SARVASH, etc.)
- Config table with raffle settings
- All entries with `hasWon: false`