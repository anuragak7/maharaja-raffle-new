#!/bin/bash
set -e

echo "🚀 Starting Render Setup..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Create database schema
echo "🗄️  Creating database schema..."
npx prisma db push --force-reset --accept-data-loss

# Verify tables exist
echo "✅ Verifying database setup..."
npx prisma db execute --stdin <<EOF
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
EOF

echo "🎉 Database setup complete!"

# Start the application
echo "🚀 Starting application..."
npm start