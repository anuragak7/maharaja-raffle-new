#!/bin/bash

echo "🎰 Maharaja Raffle Deployment Script"
echo "Running database migrations..."

# Run Prisma migrations
npx prisma migrate deploy

echo "Seeding database with sample data..."
# Run seeder
npm run seed

echo "✅ Deployment complete!"