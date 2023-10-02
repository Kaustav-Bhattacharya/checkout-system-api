// index.js
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const knex = require("knex");
const knexConfig = require("./knexfile");
const router = require("./route");


// Initialize Knex with the configuration
const db = knex(knexConfig.development);

// Middleware
app.use(express.json());
app.use("/", router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
