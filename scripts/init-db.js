#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function initializeDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Initializing database tables...');
    
    // Force push the schema to create tables
    const { execSync } = require('child_process');
    
    console.log('Running prisma db push...');
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
    
    console.log('✅ Database tables created successfully!');
    
    // Test database connection
    const count = await prisma.entry.count();
    console.log(`📊 Current entries: ${count}`);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();