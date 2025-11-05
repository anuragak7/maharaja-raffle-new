#!/bin/bash
set -e

echo "🚀 Starting Render initialization..."

# Try migration first, fallback to db push
echo "📊 Setting up database schema..."
npx prisma migrate deploy 2>/dev/null || {
    echo "⚠️  Migration failed, using db push..."
    npx prisma db push --force-reset --accept-data-loss
}

# Seed the database
echo "🌱 Seeding database with entries..."
npm run seed

# Start the application
echo "🎰 Starting the raffle application..."
npm start