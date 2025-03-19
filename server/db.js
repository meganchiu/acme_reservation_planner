const { Client } = require('pg');

const client = new Client(
  process.env.DATABASE_URL || 
  'postgres://megan.chiu:password@localhost:5432/acme_reservation_planner'
);

const connectDB = async () => {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database.');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createTables = async () => {
  const SQL = `
      DROP TABLE IF EXISTS reservations;
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS restaurants;

      CREATE TABLE customers(
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL
      );

      CREATE TABLE restaurants(
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL
      );

      CREATE TABLE reservations(
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          date DATE NOT NULL,
          customer_id UUID REFERENCES customers(id) NOT NULL,
          restaurant_id UUID REFERENCES restaurants(id) NOT NULL
      );
  `;

  try {
    await client.query(SQL);
    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

module.exports = {
  client,
  connectDB,
  createTables
};