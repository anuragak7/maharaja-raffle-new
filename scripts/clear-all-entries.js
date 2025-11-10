#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function clearAllEntries() {
  console.log('🧹 Clearing ALL entries from both stores...');
  
  const DATABASE_URL = "postgresql://maharaja_raffle_entries_user:TY1VikldPkat1pTFPlwlAnKk5FFv2oYE@dpg-d3t72hu3jp1c738injq0-a.virginia-postgres.render.com/maharaja_raffle_entries?sslmode=require";
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL
      }
    }
  });

  try {
    console.log('🗑️  Deleting all winners...');
    await prisma.$executeRaw`DELETE FROM "Winner"`;
    
    console.log('🗑️  Deleting all entries...');
    await prisma.$executeRaw`DELETE FROM "Entry"`;
    
    console.log('✅ Successfully cleared all entries from both stores!');
    console.log('📊 Current state:');
    
    // Verify deletion
    const belleroseCount = await prisma.entry.count({ where: { store: 'bellerose' } });
    const hicksvilleCount = await prisma.entry.count({ where: { store: 'hicksville' } });
    
    console.log(`   Bellerose entries: ${belleroseCount}`);
    console.log(`   Hicksville entries: ${hicksvilleCount}`);
    console.log(`   Total entries: ${belleroseCount + hicksvilleCount}`);
    
  } catch (error) {
    console.error('❌ Error clearing entries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllEntries();