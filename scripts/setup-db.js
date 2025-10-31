const { Client } = require('pg');

async function setupDatabase() {
  console.log('🔥 FORCED DATABASE SETUP STARTING...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found!');
    process.exit(1);
  }
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Drop table if exists and recreate
    await client.query('DROP TABLE IF EXISTS "Entry" CASCADE;');
    console.log('🗑️  Dropped existing Entry table');
    
    await client.query('DROP TABLE IF EXISTS "Winner" CASCADE;');
    console.log('🗑️  Dropped existing Winner table');
    
    // Create Entry table
    await client.query(`
      CREATE TABLE "Entry" (
        "id" TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "hasWon" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ Created Entry table');
    
    // Create Winner table
    await client.query(`
      CREATE TABLE "Winner" (
        "id" TEXT NOT NULL,
        "entryId" TEXT NOT NULL,
        "drawnAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "round" INTEGER NOT NULL,
        CONSTRAINT "Winner_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ Created Winner table');
    
    // Create unique constraint on phone
    await client.query(`
      CREATE UNIQUE INDEX "Entry_phone_key" ON "Entry"("phone");
    `);
    console.log('✅ Created unique phone constraint');
    
    // Add foreign key
    await client.query(`
      ALTER TABLE "Winner" ADD CONSTRAINT "Winner_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `);
    console.log('✅ Created foreign key constraint');
    
    // Verify tables exist
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('Entry', 'Winner');
    `);
    
    console.log('📋 Tables in database:', result.rows.map(r => r.table_name));
    
    if (result.rows.length === 2) {
      console.log('🎉 DATABASE SETUP COMPLETE! Both tables created successfully.');
    } else {
      console.error('❌ Table creation failed!');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();