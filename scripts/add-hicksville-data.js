#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function addHicksvilleData() {
  console.log('🌱 Adding Hicksville participants...');
  
  const DATABASE_URL = "postgresql://maharaja_raffle_entries_user:TY1VikldPkat1pTFPlwlAnKk5FFv2oYE@dpg-d3t72hu3jp1c738injq0-a.virginia-postgres.render.com/maharaja_raffle_entries?sslmode=require";
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL
      }
    }
  });

  // Hicksville participants
  const hicksvilleEntries = [
    { firstName: 'AMIT', lastName: 'SHARMA', phone: '5161234567' },
    { firstName: 'PRIYA', lastName: 'PATEL', phone: '5162345678' },
    { firstName: 'RAJESH', lastName: 'KUMAR', phone: '5163456789' },
    { firstName: 'SUNITA', lastName: 'SINGH', phone: '5164567890' },
    { firstName: 'VIJAY', lastName: 'GUPTA', phone: '5165678901' },
    { firstName: 'NEHA', lastName: 'AGARWAL', phone: '5166789012' },
    { firstName: 'ROHIT', lastName: 'VERMA', phone: '5167890123' },
    { firstName: 'KAVITA', lastName: 'JOSHI', phone: '5168901234' },
    { firstName: 'DEEPAK', lastName: 'MEHTA', phone: '5169012345' },
    { firstName: 'SONIA', lastName: 'SHAH', phone: '5160123456' },
    { firstName: 'RAMESH', lastName: 'ARORA', phone: '5161234560' },
    { firstName: 'POOJA', lastName: 'MALHOTRA', phone: '5162345601' },
    { firstName: 'SURESH', lastName: 'CHOPRA', phone: '5163456012' },
    { firstName: 'REETA', lastName: 'BHATT', phone: '5164560123' },
    { firstName: 'AJAY', lastName: 'SOOD', phone: '5165601234' },
    { firstName: 'MEERA', lastName: 'KAPOOR', phone: '5166012345' },
    { firstName: 'VINOD', lastName: 'SETHI', phone: '5160123457' },
    { firstName: 'GEETA', lastName: 'RANA', phone: '5161234578' },
    { firstName: 'MANOJ', lastName: 'BHATIA', phone: '5162345789' },
    { firstName: 'SHILPA', lastName: 'KHANNA', phone: '5163457890' },
    { firstName: 'RAVI', lastName: 'TIWARI', phone: '5164578901' },
    { firstName: 'ANITA', lastName: 'BAJAJ', phone: '5165789012' },
    { firstName: 'SANDEEP', lastName: 'GOEL', phone: '5166890123' },
    { firstName: 'RITU', lastName: 'BANSAL', phone: '5167901234' },
    { firstName: 'ASHOK', lastName: 'SINHA', phone: '5168012345' }
  ];

  try {
    // Delete existing Hicksville entries
    await prisma.$executeRaw`DELETE FROM "Entry" WHERE "store" = 'hicksville'`;
    
    // Add Hicksville entries
    for (const entry of hicksvilleEntries) {
      await prisma.$executeRaw`
        INSERT INTO "Entry" ("id", "firstName", "lastName", "phone", "store", "createdAt", "hasWon")
        VALUES (gen_random_uuid(), ${entry.firstName}, ${entry.lastName}, ${entry.phone}, 'hicksville', NOW(), false)
      `;
    }

    // Count entries
    const totalResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Entry"`;
    const belleroseResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Entry" WHERE "store" = 'bellerose'`;
    const hicksvilleResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Entry" WHERE "store" = 'hicksville'`;
    
    const totalCount = Number(totalResult[0].count);
    const belleroseCount = Number(belleroseResult[0].count);
    const hicksvilleCount = Number(hicksvilleResult[0].count);
    
    console.log(`✅ Hicksville data added!`);
    console.log(`   Total entries: ${totalCount}`);
    console.log(`   Bellerose entries: ${belleroseCount}`);
    console.log(`   Hicksville entries: ${hicksvilleCount}`);
    
  } catch (error) {
    console.error('❌ Failed to add Hicksville data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addHicksvilleData();