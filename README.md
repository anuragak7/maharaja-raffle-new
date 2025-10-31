# Hicksville Farmers Market – Lucky Draw

Beer-barrel themed raffle app with Next.js + Prisma (PostgreSQL).

## Quick Start

```bash
# 1) Unzip, then
cp .env.example .env
# (optional) edit NEXT_PUBLIC_LOGO_URL and ADMIN_PASSWORD

# 2) Install
npm install

# 3) Setup DB
npx prisma migrate dev --name init
npm run seed  # optional sample data

# 4) Run
npm run dev

# Open http://localhost:3000
# Draw screen: /draw
# Admin: /admin
```

### Admin actions
- Delete entry or Reset winners require a Bearer token:
  - In /admin, put your ADMIN_PASSWORD (from server env) and click **Save**.
  - The UI then sends `Authorization: Bearer <ADMIN_PASSWORD>` for protected actions.

### Import CSV
POST a file to `/api/entries/import` as form-data with key `file`. CSV headers required:
```
first_name,last_name,phone
```

### Fairness
- Server picks uniformly from remaining entries and marks the winner immediately to avoid repeats.

### Deploy
- Works on Vercel/Render/Netlify (Node).
- Set env vars:
  - `DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"`
  - `ADMIN_PASSWORD="..."`
  - `NEXT_PUBLIC_LOGO_URL="..."`

Enjoy!
