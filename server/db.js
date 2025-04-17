const pg = require("pg");
const uuid = require("uuid");
require("dotenv");

const client = new pg.Client(
    process.env.DATABASE_URL || "postgresql://postgres:Kortney11@localhost:5432/acme_reservation_db"
);

async function createTables() {
    const SQL = `
        DROP TABLE IF EXISTS reservation;
        DROP TABLE IF EXISTS restaurant;
        DROP TABLE IF EXISTS customer;

        CREATE TABLE customer(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
        );

        CREATE TABLE restaurant(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE reservation(
            id UUID PRIMARY KEY,
            resturant_id UUID REFERENCES restaurant(id) NOT NULL,
            customer_id UUID REFERENCES customer(id) NOT NULL,
            travel_date DATE NOT NULL
        );
    `;

  await client.query(SQL);
}

async function createRestaurant(name) {
    const SQL = `INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *`;
    const dbResponse = await client.query(SQL, [uuid.v4(), name]);
    return dbResponse.rows[0];
  }

  async function fetchRestaurant() {
    const SQL = `SELECT * FROM restaurants;`;
    const dbResponse = await client.query(SQL);
    return dbResponse.rows;
  }

  async function createCustomer(name) {
    const SQL = `INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *`;
    const dbResponse = await client.query(SQL, [uuid.v4(), name]);
    return dbResponse.rows[0];
  }
  
  async function fetchCustomers() {
    const SQL = `SELECT * FROM restaurants;`;
    const dbResponse = await client.query(SQL);
    return dbResponse.rows;
  }

  async function createReservation({ party_count, customer_id, restaurant_id, date }) {
    const SQL = `INSERT INTO reservations(id, customer_id, resturant_id, party_count, date) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const dbResponse = await client.query(SQL, [
      uuid.v4(),
      customer_id,
      restaurant_id,
      party_count,
      date,
    ]);
    return dbResponse.rows[0];
  }
  
  async function fetchReservations() {
    const SQL = `SELECT * FROM reservations;`;
    const dbResponse = await client.query(SQL);
    return dbResponse.rows;
  } 

  async function destroyReservation(id, restaurant_id) {
    const SQL = `DELETE FROM reservations WHERE id=$1 AND user_id=$2`;
    await client.query(SQL, [id, restaurant_id_id]);
  }

  module.exports = {
    client,
    createTables,
    createCustomer,
    fetchCustomers,
    createRestaurant,
    fetchRestaurant,
    createReservation,
    fetchReservations,
    destroyReservation,
  };
