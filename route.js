const express = require("express");
const {
  getProducts,
  addProducts,
  deleteProducts,
} = require("./controller/productController");
const {
  addCartProducts,
  getCart,
  emptyCart,
  removeProduct
} = require("./controller/cartController");
const { cartTotal } = require("./controller/cartTotalController");

const router = express.Router();

//product api's
router.post("/products", addProducts);
router.get("/products", getProducts);
router.delete("/products/:id", deleteProducts);

//cart api's
router.post("/cart-items", addCartProducts);
router.get("/cart-items", getCart);
router.delete("/cart-items", emptyCart);
router.delete("/cart-items/:product_id", removeProduct);

//cart-total api's
router.get("/cart-items/total", cartTotal);

module.exports = router;
