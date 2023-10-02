const knex = require("knex");
const knexConfig = require("../knexfile");

// Initializing Knex with the configuration
const db = knex(knexConfig.development);

//to get the total
const cartTotal = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error:
          "Invalid input. Please provide an array of products with product ID and quantity.",
      });
    }

    // Fetch the products from the database based on the provided product IDs
    const productIds = products.map((product) => product.productId);
    const productData = await db("products")
      .whereIn("id", productIds)
      .select("*");

    // Check if all requested products are available
    const unavailableProducts = [];
    for (const product of products) {
      const matchedProduct = productData.find(
        (p) => p.id === product.productId
      );

      if (!matchedProduct) {
        unavailableProducts.push(product.productId);
      }
    }

    if (unavailableProducts.length > 0) {
      return res.status(400).json({
        error: `Products with IDs ${unavailableProducts.join(
          ", "
        )} are not available.`,
      });
    }

    // Calculate the total amount
    let totalAmount = 0;
    for (const product of products) {
      const matchedProduct = productData.find(
        (p) => p.id === product.productId
      );
      totalAmount += matchedProduct.price * product.quantity;
    }

    res.json({ totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { cartTotal };
