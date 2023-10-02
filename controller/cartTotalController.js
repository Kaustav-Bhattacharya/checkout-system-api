const knex = require("knex");
const knexConfig = require("../knexfile");

// Initializing Knex with the configuration
const db = knex(knexConfig.development);

//to get the total amount
const cartTotal = async (req, res) => {
  try {
    // Fetching the products from the cart table
    const cartItems = await db("cart").select("product_id", "quantity");

    // Fetch the prices for the products from the 'products' table
    const productIds = cartItems.map((item) => item.product_id);
    const productData = await db("products")
      .whereIn("id", productIds)
      .select("id", "price", "name");

    // Calculating the total amount for individual products
    const productTotals = [];
    for (const cartItem of cartItems) {
      const matchedProduct = productData.find(
        (p) => p.id === parseInt(cartItem.product_id)
      );
      if (matchedProduct) {
        const productTotal = {
          productId: matchedProduct.id,
          productName: matchedProduct.name,
          price: matchedProduct.price,
          quantity: cartItem.quantity,
          total: matchedProduct.price * cartItem.quantity,
        };
        productTotals.push(productTotal);
      }
    }

    // Applying promotions
    const itemAPromotionCount = cartItems
      .filter((item) => item.product_id === "A")
      .reduce((total, item) => total + item.quantity, 0);

    const itemBPromotionCount = cartItems
      .filter((item) => item.product_id === "B")
      .reduce((total, item) => total + item.quantity, 0);

    for (const productTotal of productTotals) {
      if (productTotal.productId === "A" && itemAPromotionCount >= 3) {
        const itemADiscount = Math.floor(itemAPromotionCount / 3) * 15; // Rs 15 discount for every 3 items
        productTotal.total -= itemADiscount;
      }

      if (productTotal.productId === "B" && itemBPromotionCount >= 2) {
        const itemBDiscount = Math.floor(itemBPromotionCount / 2) * 10; // Rs 10 discount for every 2 items
        productTotal.total -= itemBDiscount;
      }
    }

    // Calculating the total cart amount after promotions
    let totalAmount = 0;
    for (const productTotal of productTotals) {
      totalAmount += productTotal.total;
    }

    res.json({ productTotals, totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { cartTotal };
