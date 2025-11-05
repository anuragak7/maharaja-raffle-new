# Manual Web Service Configuration for Existing PostgreSQL

## Since you have PostgreSQL but no web service, here are the exact steps:

### Method 1: Blueprint (Easiest)
1. **Render Dashboard** → "New +" → "Blueprint"
2. **Connect repo**: `anuragak7/maharaja-raffle-new`
3. **Render detects render.yaml** → Creates web service automatically
4. **Links to existing database** (if names match)

### Method 2: Manual Web Service
If Blueprint doesn't link to existing database:

1. **Render Dashboard** → "New +" → "Web Service"
2. **Connect GitHub**: `anuragak7/maharaja-raffle-new`
3. **Configure**:
   - **Name**: `maharaja-bellerose-raffle`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma db push && npm run seed && npm start`

4. **Environment Variables**:
   - `NODE_ENV` = `production`
   - `ADMIN_PASSWORD` = `admin123secure`
   - `DATABASE_URL` = [Copy from your existing PostgreSQL service]

### Method 3: Update render.yaml for existing database
If your database has a different name, we need to update the render.yaml

**What's your PostgreSQL database name in Render?**
- Check your Render dashboard
- Look at the PostgreSQL service name
- It might be something like:
  - `maharaja-raffle-db`
  - `postgres-xyz`
  - `database-abc`

### Quick Fix Commands:
```bash
# Update render.yaml with correct database name
# Then commit and push
git add render.yaml
git commit -m "Fix database reference for existing PostgreSQL"
git push origin main
```

## Expected Result:
- Web service connects to existing PostgreSQL
- Database gets populated with 47 entries
- Raffle works at: https://maharaja-bellerose-raffle.onrender.com/draw

## What to do next:
1. Tell me your existing PostgreSQL database name from Render dashboard
2. I'll update the configuration to match it
3. Then create the web service using Blueprint method