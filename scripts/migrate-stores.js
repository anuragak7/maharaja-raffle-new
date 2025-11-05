#!/usr/bin/env node

const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

async function migrateDatabase() {
  console.log('🔧 Migrating database to add store field...');
  
  const DATABASE_URL = "postgresql://maharaja_raffle_entries_user:TY1VikldPkat1pTFPlwlAnKk5FFv2oYE@dpg-d3t72hu3jp1c738injq0-a.virginia-postgres.render.com/maharaja_raffle_entries?sslmode=require";
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL
      }
    }
  });

  try {
    console.log('📊 Step 1: Adding store column...');
    
    // Add store column with default value
    await prisma.$executeRaw`ALTER TABLE "Entry" ADD COLUMN IF NOT EXISTS "store" TEXT NOT NULL DEFAULT 'bellerose'`;
    
    console.log('📊 Step 2: Updating existing entries to bellerose...');
    
    // Update all existing entries to have store = 'bellerose'
    const updateResult = await prisma.$executeRaw`UPDATE "Entry" SET "store" = 'bellerose' WHERE "store" IS NULL OR "store" = ''`;
    
    console.log('📊 Step 3: Dropping old unique constraint...');
    
    // Drop the old unique constraint on phone
    try {
      await prisma.$executeRaw`ALTER TABLE "Entry" DROP CONSTRAINT IF EXISTS "Entry_phone_key"`;
    } catch (e) {
      console.log('Old constraint already removed or didn\'t exist');
    }
    
    console.log('📊 Step 4: Adding new compound unique constraint...');
    
    // Add new compound unique constraint
    try {
      await prisma.$executeRaw`ALTER TABLE "Entry" ADD CONSTRAINT "Entry_phone_store_key" UNIQUE ("phone", "store")`;
    } catch (e) {
      console.log('Compound constraint already exists');
    }
    
    console.log('📊 Step 5: Counting existing entries...');
    
    // Count existing entries using raw SQL
    const totalResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Entry"`;
    const belleroseResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Entry" WHERE "store" = 'bellerose'`;
    
    const totalCount = Number(totalResult[0].count);
    const belleroseCount = Number(belleroseResult[0].count);
    
    console.log(`✅ Migration complete!`);
    console.log(`   Total entries: ${totalCount}`);
    console.log(`   Bellerose entries: ${belleroseCount}`);
    console.log(`   Database is ready for store-based filtering!`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateDatabase();