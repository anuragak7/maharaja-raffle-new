#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function initializeDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Initializing database tables...');
    
    // First, try to connect and check if tables exist
    try {
      const count = await prisma.entry.count();
      console.log('✅ Database tables already exist. Current entries:', count);
      return;
    } catch (error) {
      console.log('📝 Tables don\'t exist, creating them...');
    }
    
    // Create tables using raw SQL
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Entry" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "phone" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "hasWon" BOOLEAN NOT NULL DEFAULT false
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Winner" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "entryId" TEXT NOT NULL UNIQUE,
        "wonAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `;
    
    console.log('✅ Database tables created successfully!');
    
    // Test database connection
    const count = await prisma.entry.count();
    console.log(`📊 Current entries: ${count}`);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    
    // Fallback: try prisma db push
    try {
      console.log('🔄 Trying Prisma db push as fallback...');
      const { execSync } = require('child_process');
      execSync('npx prisma db push --force-reset --accept-data-loss', { stdio: 'inherit' });
      console.log('✅ Fallback successful!');
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError.message);
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };