const knex = require("knex");
const knexConfig = require("../knexfile");

// Initializing Knex with the configuration
const db = knex(knexConfig.development);

//adding items to the cart
const addCartProducts = async (req, res) => {
  try {
    const products = req.body;

    // Checking if products is an array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error:
          "Invalid input. Please provide an array of products with product ID and quantity.",
      });
    }
    
    // Fetching prices for the products from the 'products' table
    const productIds = products.map((product) => product.product_id);
    const productData = await db("products")
      .whereIn("id", productIds)
      .select("id", "price");

    // Fetching the existing cart items
    const existingCartItems = await db("cart")
      .whereIn("product_id", productIds)
      .select("product_id", "quantity");

    // Creating a mapping of product_id to existing quantity in the cart
    const existingCartQuantityMap = {};
    for (const item of existingCartItems) {
      existingCartQuantityMap[item.product_id] = item.quantity;
    }

    const cartItems = [];

    // Validating each product and build the cart items array
    const validationErrors = [];

    for (const product of products) {
      const { product_id, quantity } = product;

      // Checking if required fields are provided for each product
      if (!product_id) {
        errors.product_id = "Product ID is required.";
      }

      // Checking if quantity is a valid positive integer
      if (
        isNaN(quantity) ||
        !Number.isInteger(Number(quantity)) ||
        quantity <= 0
      ) {
        errors.quantity = "Quantity must be a valid positive integer.";
      }

      const matchedProduct = productData.find((p) => p.id === product_id);

      if (!matchedProduct) {
        validationErrors.push({ product_id, error: "Product not found." });
      } else {
        const existingQuantity = existingCartQuantityMap[product_id] || 0;
        const totalQuantity = existingQuantity + quantity;
        cartItems.push({
          product_id,
          price: matchedProduct.price,
          quantity: totalQuantity, // Updating quantity by adding to the existing quantity
        });
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        error:
          "Validation failed for some products. See details for each product.",
        validationErrors,
      });
    }

    // Removing existing cart items for products being updated
    await db("cart").whereIn("product_id", productIds).del();

    // Inserting the updated products into the cart table
    await db("cart").insert(cartItems);

    res.status(201).json({ message: "Products added to cart successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//to get cart items
const getCart = async (req, res) => {
  try {
    // Fetch all items in the cart from the database
    const cartItems = await db("cart").select("*");

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//to delete all the products
const emptyCart = async (req, res) => {
  try {
    // Delete all products from the 'cart' table
    await db("cart").del();

    res.status(200).json({ message: "Cart emptied successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//to delete some products
const removeProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity } = req.query;

    // Checking if the product_id and quantity are provided
    if (!product_id || !quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        error:
          "Invalid input. Please provide a valid product ID and quantity to remove.",
      });
    }

    // Checking if the product exists in the cart
    const existingProduct = await db("cart")
      .where("product_id", product_id)
      .first();

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found in the cart." });
    }

    // Calculating the remaining quantity after removal
    const remainingQuantity = existingProduct.quantity - parseInt(quantity);

    if (remainingQuantity <= 0) {
      await db("cart").where("product_id", product_id).del();
    } else {
      await db("cart")
        .where("product_id", product_id)
        .update("quantity", remainingQuantity);
    }

    res.status(200).send({ message: "cart item updated" }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addCartProducts,
  getCart,
  emptyCart,
  removeProduct,
};
