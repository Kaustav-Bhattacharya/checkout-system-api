require("dotenv").config();

const { 
  DB_USER, 
  DB_HOST, 
  DB_DATABASE, 
  DB_PASSWORD, 
  DB_PORT } = process.env;

// knexfile.js
module.exports = {
  development: {
    client: "pg",
    connection: {
      user: DB_USER,
      host: DB_HOST,
      database: DB_DATABASE,
      password: DB_PASSWORD,
      port: DB_PORT,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
