const { connectDB, createTables, createCustomer, createRestaurant, fetchCustomers, 
  fetchRestaurants, createReservation, fetchReservations, destroyReservation } = require('./db.js');

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
    createCustomer('alfred'),
    createCustomer('brian'),
    createCustomer('charlie'),
    createCustomer('david'),
    createCustomer('eric'),
    createRestaurant('Ember'),
    createRestaurant('Savor'),
    createRestaurant('Drift'),
    createRestaurant('Zest'),
    createRestaurant('Hearth'),
  ]);
  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());

  const [reservation1, reservation2] = await Promise.all([
    createReservation({
      customer_id: alfred.id,
      restaurant_id : Ember.id,
      date: '03/25/2025'
    }),
    createReservation({
      customer_id: charlie.id,
      restaurant_id: Drift.id,
      date: '03/30/2025'
    }),
  ]);
  
  console.log(await fetchReservations());

  await destroyReservation({id: reservation1.id, customer_id: reservation1.id});

  app.listen(port, () => console.log(`listening on port ${port}`));
};

app.get('/api/customers', async(req, res, next)=> {
  try {
    res.send(await fetchCustomers());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/restaurants', async(req, res, next)=> {
  try {
    res.send(await fetchRestaurants());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/reservations', async(req, res, next)=> {
  try {
    res.send(await fetchReservations());
  }
  catch(ex){
    next(ex);
  }
});

init();