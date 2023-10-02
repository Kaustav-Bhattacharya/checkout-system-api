const express = require("express");
const {
  getProducts,
  addProducts,
  deleteProducts,
} = require("./controller/productController");

const router = express.Router();

//product api's
router.post("/products", addProducts);
router.get("/products", getProducts);
router.delete("/products/:id", deleteProducts);

module.exports = router;
