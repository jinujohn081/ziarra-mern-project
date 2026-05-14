const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

//@route POST /api/cart
//@desc Add a product to the cart for a guest or logged In user
//@access Public

router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  const qty = Number(quantity); // ✅ FIX

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        // ✅ use numeric addition
        cart.products[productIndex].quantity += qty;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity: qty, // ✅ fix
        });
      }

      const total = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      cart.totalPrice = Number(total.toFixed(2));

      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity: qty, // ✅ fix
          },
        ],
        totalPrice: product.price * qty, // ✅ fix
      });

      return res.status(200).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

//@route PUT /api/cart
//@desc update product quantity in the cart for a guest or loggedin user
//@access public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  const qty = Number(quantity); // ✅ FIX

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (qty > 0) {
      // ✅ Replace quantity (NOT add)
      cart.products[productIndex].quantity = qty;
    } else {
      // ✅ Remove item
      cart.products.splice(productIndex, 1);
    }

    // ✅ Correct total calculation
    const total = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    cart.totalPrice = Number(total.toFixed(2));

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//@route DELETE/api/cart
//@desc Remove a product from the cart
// @access Public

router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "cart not found" });
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(400).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
});
// route  GET/api/cart
//@desc Get logged-in user's or guest user's cart
//@access Public

router.get("/", async (req, res) => {
  const { userId, guestId } = req.query; // ✅ FIX

  try {
    const cart = await getCart(userId, guestId);

    if (cart) {
      return res.json(cart);
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});
//@route POSt/api/cart/merge
//@desc Merge guest cart into user cart on login

//@access Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  try {
    //find the guest cart and user cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });
    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(400).json({ message: "Guest cart is empty" });
      }
      if (userCart) {
        //merge guest cart into user cart
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );
          if (productIndex > -1) {
            //if the items exists in the user cart,update the quantity
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            //otherwise ,add the guest item in the cart
            userCart.products.push(guestItem);
          }
        });
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();

        //Remove the guestcart after merging
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.error("Error deleting guset Cart", error);
        }
        res.status(200).json(userCart);
      } else {
        //if the user has no existing cart,assign the guest
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();
        res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        // Guest cart has already been merged,return user cart
        return res.status(200).json(userCart);
      }
      res.status(404).json({ message: "Guest cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
