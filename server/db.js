const { Client } = require('pg');

const uuid = require('uuid');

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

const createCustomer = async(name) => {
  const SQL = `
    INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createRestaurant = async(name) => {
  const SQL = `
    INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const fetchCustomers = async()=> {
  const SQL = `SELECT * FROM customers`;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchRestaurants = async()=> {
  const SQL = `SELECT * FROM restaurants`;
  const response = await client.query(SQL);
  return response.rows;
};

const createReservation = async({ customer_id, restaurant_id, date})=> {
  const SQL = `
    INSERT INTO reservations(id, customer_id, restaurant_id, date) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), customer_id, restaurant_id, date]);
  return response.rows[0];
};

module.exports = {
  client,
  connectDB,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation
};