import mysql from 'mysql2/promise';
import 'dotenv/config';

const run = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Adding "category" column to products table...');
    await connection.query(`
      ALTER TABLE products 
      ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'vegetable' 
      AFTER name
    `);
    console.log('Success! Products now have a "category" column.');
  } catch (error) {
    if (error.code === 'ER_DUP_COLUMN_NAME') {
      console.log('Column already exists, skipping.');
    } else {
      console.error('Error adding column:', error);
    }
  } finally {
    await connection.end();
  }
};

run();
