// Creates the PostgreSQL database 'arogya_setu' if it doesn't exist
require('dotenv').config();
const { Client } = require('pg');

async function setup() {
  const client = new Client({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 5432,
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || 'nasa',
    database: 'postgres',   // connect to default db first
  });

  try {
    console.log('🔗 Connecting to PostgreSQL...');
    await client.connect();

    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = 'arogya_setu'`);
    if (res.rowCount > 0) {
      console.log("✅ Database 'arogya_setu' already exists!");
    } else {
      await client.query('CREATE DATABASE arogya_setu');
      console.log("✅ Database 'arogya_setu' created!");
    }
    console.log('\n🚀 Now run: node seed.js\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('\n📋 Make sure PostgreSQL is running and password in .env is correct');
  } finally {
    await client.end();
  }
}

setup();
