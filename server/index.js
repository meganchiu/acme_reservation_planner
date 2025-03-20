const { connectDB, createTables, createCustomer, createRestaurant, fetchCustomers, fetchRestaurants } = require('./db.js');

/* import express and pg */
const express = require('express');
const pg = require('pg');
const cors = require('cors');
const morgan = require('morgan');

// Initialize application
const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5173', optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const init = async()=> {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Connected to database.');
  await createTables();
  console.log('Created tables.');

  const [alfred, brian, charlie, david, eric, Ember, Savor, Drift, Zest, Hearth ] = await Promise.all([
    createCustomer({ name: 'alfred'}),
    createCustomer({ name: 'brian'}),
    createCustomer({ name: 'charlie'}),
    createCustomer({ name: 'david'}),
    createCustomer({ name: 'eric'}),
    createRestaurant({name: 'Ember'}),
    createRestaurant({name: 'Savor'}),
    createRestaurant({name: 'Drift'}),
    createRestaurant({name: 'Zest'}),
    createRestaurant({name: 'Hearth'}),
  ]);
  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());
};

init();