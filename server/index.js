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
      date: '03/25/2025',
      party_count: 5
    }),
    createReservation({
      customer_id: charlie.id,
      restaurant_id: Drift.id,
      date: '03/30/2025',
      party_count: 8
    }),
  ]);
  
  console.log(await fetchReservations());

  app.listen(port, ()=> {
    console.log(`Listening on PORT ${port}`);
    console.log('CURL commands to test...');
    console.log(`curl localhost:${port}/api/customers`);
    console.log(`curl localhost:${port}/api/restaurants`);
    console.log(`curl localhost:${port}/api/reservations`);
    console.log(`curl -X DELETE localhost:${port}/api/customers/${alfred.id}/reservations/${reservation1.id}`);
    console.log(`curl -X POST localhost:${port}/api/customers/${david.id}/reservations/ -d '{"restaurant_id":"${Zest.id}", "date": "05/15/2025", "party_count": "2"}' -H "Content-Type:application/json"`);
    });
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

app.delete('/api/customers/:customer_id/reservations/:id',  async(req, res, next)=> {
  try {
      await destroyReservation({customer_id: req.params.customer_id, id: req.params.id});
      res.sendStatus(204);
  }
  catch(ex){
      next(ex);
  }
});

app.post('/api/customers/:customer_id/reservations',  async(req, res, next)=> {
  try {
      res.status(201).send(await createReservation({ customer_id: req.params.customer_id, restaurant_id: req.body.restaurant_id, date: req.body.date, party_count: req.body.party_count}));
  }
  catch(ex){
      next(ex);
  }
});
init();