const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
// @route POST/api/checkout
// @desc Create a new checkout session
// @access Private

router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;
  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No item in checkout" });
  }
  try {
    // create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });
    console.log(`Checkout created for user:${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error Creating checkOut sessions:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
//@route PUT/api/checkout/:id/pay
// @desc update checkout to mark as paid after successful payment
// @Access Private

router.put("/:id/pay", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    checkout.isPaid = true;
    checkout.paidAt = Date.now();
    checkout.paymentStatus = "Paid";

    await checkout.save();

    res.json({
      success: true,
      message: "Checkout marked as paid",
      data: checkout,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}); //@route POST /api/checkout/:id/finalize
//@desc  Finalize checkout and convert to anorder after payment confirmation
// @access Private

router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id).lean();

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    if (!checkout.isPaid) {
      return res.status(400).json({ message: "Checkout is not paid" });
    }

    if (!checkout.shippingAddress?.address) {
      return res.status(400).json({ message: "Missing shipping address" });
    }

    if (!checkout.paymentMethod) {
      return res.status(400).json({ message: "Missing payment method" });
    }

    if (!checkout.totalPrice) {
      return res.status(400).json({ message: "Missing total price" });
    }

    const finalOrder = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: "Paid",
      paymentDetails: checkout.paymentDetails || null,
    });

    await Checkout.findByIdAndUpdate(req.params.id, {
      isFinalized: true,
      finalizedAt: Date.now(),
    });

    await Cart.findOneAndDelete({ user: checkout.user });

    return res.status(201).json({
      success: true,
      order: finalOrder,
    });
  } catch (error) {
    console.error("Finalize error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
