#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function resetAllEntries() {
  console.log('🔄 Resetting all entries and adding fresh data...');
  
  const DATABASE_URL = "postgresql://maharaja_raffle_entries_user:TY1VikldPkat1pTFPlwlAnKk5FFv2oYE@dpg-d3t72hu3jp1c738injq0-a.virginia-postgres.render.com/maharaja_raffle_entries?sslmode=require";
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL
      }
    }
  });

  try {
    console.log('🗑️  Step 1: Clearing all existing data...');
    
    // Delete all winners first (due to foreign key constraints)
    await prisma.$executeRaw`DELETE FROM "Winner"`;
    
    // Delete all entries
    await prisma.$executeRaw`DELETE FROM "Entry"`;
    
    console.log('✅ All old data cleared!');
    
    console.log('🌱 Step 2: Adding fresh Bellerose participants...');
    
    // Fresh Bellerose participants
    const belleroseEntries = [
      { firstName: 'RAJESH', lastName: 'SHARMA', phone: '5168881234' },
      { firstName: 'PRIYA', lastName: 'SINGH', phone: '5168882345' },
      { firstName: 'AMIT', lastName: 'PATEL', phone: '5168883456' },
      { firstName: 'SUNITA', lastName: 'GUPTA', phone: '5168884567' },
      { firstName: 'VIJAY', lastName: 'KUMAR', phone: '5168885678' },
      { firstName: 'KAVITA', lastName: 'AGARWAL', phone: '5168886789' },
      { firstName: 'ROHIT', lastName: 'VERMA', phone: '5168887890' },
      { firstName: 'NEHA', lastName: 'JOSHI', phone: '5168888901' },
      { firstName: 'DEEPAK', lastName: 'MEHTA', phone: '5168889012' },
      { firstName: 'SONIA', lastName: 'SHAH', phone: '5168880123' },
      { firstName: 'RAMESH', lastName: 'ARORA', phone: '5168881230' },
      { firstName: 'POOJA', lastName: 'MALHOTRA', phone: '5168882301' },
      { firstName: 'SURESH', lastName: 'CHOPRA', phone: '5168883012' },
      { firstName: 'REETA', lastName: 'BHATT', phone: '5168884123' },
      { firstName: 'AJAY', lastName: 'SOOD', phone: '5168885234' },
      { firstName: 'MEERA', lastName: 'KAPOOR', phone: '5168886345' },
      { firstName: 'VINOD', lastName: 'SETHI', phone: '5168887456' },
      { firstName: 'GEETA', lastName: 'RANA', phone: '5168888567' },
      { firstName: 'MANOJ', lastName: 'BHATIA', phone: '5168889678' },
      { firstName: 'SHILPA', lastName: 'KHANNA', phone: '5168880789' },
      { firstName: 'RAVI', lastName: 'TIWARI', phone: '5168881789' },
      { firstName: 'ANITA', lastName: 'BAJAJ', phone: '5168882890' },
      { firstName: 'SANDEEP', lastName: 'GOEL', phone: '5168883901' },
      { firstName: 'RITU', lastName: 'BANSAL', phone: '5168884012' },
      { firstName: 'ASHOK', lastName: 'SINHA', phone: '5168885123' }
    ];

    // Add Bellerose entries
    for (const entry of belleroseEntries) {
      await prisma.$executeRaw`
        INSERT INTO "Entry" ("id", "firstName", "lastName", "phone", "store", "createdAt", "hasWon")
        VALUES (gen_random_uuid(), ${entry.firstName}, ${entry.lastName}, ${entry.phone}, 'bellerose', NOW(), false)
      `;
    }

    console.log(`✅ Added ${belleroseEntries.length} Bellerose participants`);
    
    console.log('🌱 Step 3: Adding fresh Hicksville participants...');
    
    // Fresh Hicksville participants
    const hicksvilleEntries = [
      { firstName: 'ARJUN', lastName: 'REDDY', phone: '5169991234' },
      { firstName: 'SNEHA', lastName: 'NAIR', phone: '5169992345' },
      { firstName: 'KIRAN', lastName: 'IYER', phone: '5169993456' },
      { firstName: 'RAMAN', lastName: 'PILLAI', phone: '5169994567' },
      { firstName: 'DIVYA', lastName: 'MENON', phone: '5169995678' },
      { firstName: 'SUNIL', lastName: 'RAO', phone: '5169996789' },
      { firstName: 'LAKSHMI', lastName: 'KRISHNAN', phone: '5169997890' },
      { firstName: 'GANESH', lastName: 'MURTHY', phone: '5169998901' },
      { firstName: 'REKHA', lastName: 'BOSE', phone: '5169999012' },
      { firstName: 'PRAKASH', lastName: 'JAIN', phone: '5169990123' },
      { firstName: 'SWATI', lastName: 'DESAI', phone: '5169991230' },
      { firstName: 'VIKRAM', lastName: 'CHOUDHARY', phone: '5169992301' },
      { firstName: 'MADHURI', lastName: 'PANDEY', phone: '5169993012' },
      { firstName: 'HARISH', lastName: 'SAXENA', phone: '5169994123' },
      { firstName: 'ASHA', lastName: 'MISHRA', phone: '5169995234' },
      { firstName: 'NITIN', lastName: 'AGARWAL', phone: '5169996345' },
      { firstName: 'VANDANA', lastName: 'TIWARI', phone: '5169997456' },
      { firstName: 'SACHIN', lastName: 'GUPTA', phone: '5169998567' },
      { firstName: 'NISHA', lastName: 'SHARMA', phone: '5169999678' },
      { firstName: 'ANIL', lastName: 'SINGH', phone: '5169990789' }
    ];

    // Add Hicksville entries
    for (const entry of hicksvilleEntries) {
      await prisma.$executeRaw`
        INSERT INTO "Entry" ("id", "firstName", "lastName", "phone", "store", "createdAt", "hasWon")
        VALUES (gen_random_uuid(), ${entry.firstName}, ${entry.lastName}, ${entry.phone}, 'hicksville', NOW(), false)
      `;
    }

    console.log(`✅ Added ${hicksvilleEntries.length} Hicksville participants`);
    
    // Count final entries
    const totalResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Entry"`;
    const belleroseResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Entry" WHERE "store" = 'bellerose'`;
    const hicksvilleResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Entry" WHERE "store" = 'hicksville'`;
    
    const totalCount = Number(totalResult[0].count);
    const belleroseCount = Number(belleroseResult[0].count);
    const hicksvilleCount = Number(hicksvilleResult[0].count);
    
    console.log('\n🎉 Fresh entries added successfully!');
    console.log(`📊 Final counts:`);
    console.log(`   Total entries: ${totalCount}`);
    console.log(`   Bellerose entries: ${belleroseCount}`);
    console.log(`   Hicksville entries: ${hicksvilleCount}`);
    console.log('\n🎰 Both raffles are ready with fresh participants!');
    
  } catch (error) {
    console.error('❌ Failed to reset entries:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAllEntries();