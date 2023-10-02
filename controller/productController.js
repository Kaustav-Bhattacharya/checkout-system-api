const knex = require("knex");
const knexConfig = require("../knexfile");

// Initializing Knex with the configuration
const db = knex(knexConfig.development);

//to get all the products
const getProducts = async (req, res) => {
  try {
    const products = await db("products").select("*");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//to add a product
const addProducts = async (req, res) => {
  try {
    const { name, price } = req.body;

    // Checking if name and price are provided
    if (!name || !price) {
      return res
        .status(400)
        .json({ error: "Name and price are required for the product." });
    }

    // Checking if price is a valid number
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res
        .status(400)
        .json({ error: "Price must be a valid positive number." });
    }

    // Inserting the new product into the database
    const newProduct = await db("products")
      .insert({ name, price })
      .returning("*");

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//to delete a product
const deleteProducts = async (req, res) => {
  const productId = req.params.id;

  try {
    // Checking if the product ID is a valid integer
    if (
      isNaN(productId) ||
      !Number.isInteger(Number(productId)) ||
      Number(productId) <= 0
    ) {
      return res.status(400).json({ error: "Invalid product ID." });
    }

    // Checking if the product with the given ID exists
    const existingProduct = await db("products").where("id", productId).first();

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Deleteing the product from the database
    await db("products").where("id", productId).del();

    // Returning a success message
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { deleteProducts, addProducts, getProducts };
