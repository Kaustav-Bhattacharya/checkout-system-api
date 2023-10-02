const express = require("express");
const {
  getProducts,
  addProducts,
  deleteProducts,
} = require("./controller/productController");
const { cartTotal } = require("./controller/cartController");

const router = express.Router();

//product api's
router.post("/products", addProducts);
router.get("/products", getProducts);
router.delete("/products/:id", deleteProducts);

//cart api's
router.post("/cart-total", cartTotal);

module.exports = router;
