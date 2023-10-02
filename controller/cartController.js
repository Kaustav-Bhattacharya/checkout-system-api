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
  
      // Calculate the total amount before applying promotions
      let totalAmount = 0;
      for (const product of products) {
        const matchedProduct = productData.find(
          (p) => p.id === product.productId
        );
        totalAmount += matchedProduct.price * product.quantity;
      }
  
      // Apply promotions
      const itemAPromotionCount = products
        .filter((product) => product.productId === "A")
        .reduce((total, product) => total + product.quantity, 0);
  
      const itemBPromotionCount = products
        .filter((product) => product.productId === "B")
        .reduce((total, product) => total + product.quantity, 0);
  
      if (itemAPromotionCount >= 3) {
        const itemADiscount = Math.floor(itemAPromotionCount / 3) * 15; // Rs 15 discount for every 3 items
        totalAmount -= itemADiscount;
      }
  
      if (itemBPromotionCount >= 2) {
        const itemBDiscount = Math.floor(itemBPromotionCount / 2) * 10; // Rs 10 discount for every 2 items
        totalAmount -= itemBDiscount;
      }
  
      if (totalAmount > 150) {
        totalAmount -= 20; // Rs 20 additional discount for a total basket price over Rs 150
      }
  
      res.json({ totalAmount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

module.exports = { cartTotal };
