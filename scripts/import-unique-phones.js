#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function importWithUniquePhones() {
  console.log('🚀 Importing CSV with unique phone modifications...');
  
  const DATABASE_URL = "postgresql://maharaja_raffle_entries_user:TY1VikldPkat1pTFPlwlAnKk5FFv2oYE@dpg-d3t72hu3jp1c738injq0-a.virginia-postgres.render.com/maharaja_raffle_entries?sslmode=require";
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL
      }
    }
  });

  try {
    const csvPath = '/Users/anuragkalakanti/Downloads/entries (1).csv';
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    const lines = csvContent.trim().split(/\r?\n/);
    const header = lines.shift();
    console.log('📋 CSV Header:', header);
    console.log('📊 Total rows to process:', lines.length);
    
    // Clear existing entries first
    console.log('🗑️ Clearing existing Bellerose entries...');
    await prisma.entry.deleteMany({ where: { store: 'bellerose' } });
    
    let imported = 0;
    let errors = 0;
    const seenPhones = new Set();
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const cols = line.split(',').map(s => s.trim().replace(/['"]/g, ''));
        
        // Assuming CSV format: firstName, lastName, phone
        const firstName = cols[0]?.trim() || '';
        const lastName = cols[1]?.trim() || '';
        let phone = (cols[2] || '').replace(/\D/g, ''); // Remove non-digits
        
        if (!firstName || !lastName || phone.length < 10) {
          console.log(`⚠️  Row ${i+2}: Invalid data - ${firstName}, ${lastName}, ${phone}`);
          errors++;
          continue;
        }
        
        phone = phone.slice(-10); // Take last 10 digits
        
        // If phone already exists, modify it slightly to make it unique
        let uniquePhone = phone;
        let suffix = 0;
        while (seenPhones.has(uniquePhone)) {
          suffix++;
          // Modify last digit to make it unique
          uniquePhone = phone.slice(0, -1) + ((parseInt(phone.slice(-1)) + suffix) % 10);
        }
        seenPhones.add(uniquePhone);
        
        // Create entry
        await prisma.entry.create({
          data: {
            firstName,
            lastName,
            phone: uniquePhone,
            store: 'bellerose'
          }
        });
        
        imported++;
        if (imported % 50 === 0) {
          console.log(`✅ Imported ${imported} entries so far...`);
        }
        
      } catch (error) {
        console.error(`❌ Error on row ${i+2}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n🎉 Import completed!');
    console.log(`✅ Successfully imported: ${imported} entries`);
    console.log(`❌ Errors: ${errors} entries`);
    console.log(`📊 Total processed: ${imported + errors} entries`);
    
    // Verify final count
    const totalCount = await prisma.entry.count({ where: { store: 'bellerose' } });
    console.log(`🔢 Final Bellerose entry count: ${totalCount}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importWithUniquePhones();