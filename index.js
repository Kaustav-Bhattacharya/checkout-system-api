// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const knex = require('knex');
const knexConfig = require('./knexfile');

// Initialize Knex with the configuration
const db = knex(knexConfig.development);

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Product Checkout System!');
});

// Example route to fetch products from the database
app.get('/products', async (req, res) => {
  try {
    const products = await db('products').select('*');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//to add products to the database
app.post('/products', async (req, res) => {
    try {
      const { name, price } = req.body;
  
      // Check if name and price are provided
      if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required for the product.' });
      }
  
      // Check if price is a valid number
      if (isNaN(price) || parseFloat(price) <= 0) {
        return res.status(400).json({ error: 'Price must be a valid positive number.' });
      }
  
      // Insert the new product into the database
      const newProduct = await db('products').insert({ name, price }).returning('*');
  
      res.status(201).json(newProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
  
    try {
      // Check if the product ID is a valid integer
      if (isNaN(productId) || !Number.isInteger(Number(productId)) || Number(productId) <= 0) {
        return res.status(400).json({ error: 'Invalid product ID.' });
      }
  
      // Check if the product with the given ID exists
      const existingProduct = await db('products').where('id', productId).first();
  
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found.' });
      }
  
      // Delete the product from the database
      await db('products').where('id', productId).del();
  
      res.status(204).send(); // 204 No Content response for a successful deletion
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
