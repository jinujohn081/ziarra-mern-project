const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get a cart by  userID or guest ID

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else {
    return await Cart.findOne({ guestId });
  }
  return null;
};

//if the cart exists update  it

if (cart) {
  const productIndex = cart.products.findIndex(
    (p) =>
      p.productId.toString() === productId &&
      p.size === size &&
      p.color === color
  );
}
if (productIndex > -1) {
  // if the product already exists ,update the quantity
  cart.products[productIndex].quantity += quantity;
}

// @route Post /api/cart
// @desc Add a product to the cart for a guest or logged in usee
// @acces Pu=blic

router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    // Determine if the user is logged or a guest

    let cart = await getCart(userId, guestId);
  } catch (error) {}
});
