#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function importWithRandomPhones() {
  console.log('🚀 Importing CSV with unique random phone numbers...');
  
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
    
    // Get all existing phone numbers across all stores to avoid any conflicts
    const allExistingEntries = await prisma.entry.findMany({ 
      select: { phone: true }
    });
    const existingPhones = new Set(allExistingEntries.map(e => e.phone));
    console.log('📱 Existing phone numbers to avoid:', existingPhones.size);
    
    // Generate unique phone numbers starting from a high number
    function generateUniquePhone(index) {
      let phone;
      let attempts = 0;
      do {
        // Generate a phone starting with 555 (fake area code) + unique number
        const baseNum = 5550000000 + (index * 1000) + Math.floor(Math.random() * 999) + attempts;
        phone = baseNum.toString();
        attempts++;
      } while (existingPhones.has(phone) && attempts < 100);
      
      existingPhones.add(phone);
      return phone;
    }
    
    let imported = 0;
    let errors = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const cols = line.split(',').map(s => s.trim().replace(/['"]/g, ''));
        
        // Assuming CSV format: firstName, lastName, phone
        const firstName = cols[0]?.trim() || '';
        const lastName = cols[1]?.trim() || '';
        
        if (!firstName || !lastName) {
          console.log(`⚠️  Row ${i+2}: Missing name data - ${firstName}, ${lastName}`);
          errors++;
          continue;
        }
        
        // Generate completely unique phone number
        const uniquePhone = generateUniquePhone(i);
        
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
        if (imported % 25 === 0) {
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

importWithRandomPhones();