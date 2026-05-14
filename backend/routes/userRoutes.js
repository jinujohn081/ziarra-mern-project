const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//@route POST /api/users/register
//@desc Register a new user
//@access Public

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password });
    await user.save();

    //creater JWT  payload
    const payload = { user: { id: user._id }, role: user.role };
    //sign and return the toaken along with user data

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) throw err;
        //send the user and token in response
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
});

// @route POST / api / users / login
//@desc Authenticate user
//@access public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //find out the user by email
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    const payload = { user: { id: user._id }, role: user.role };
    //sign and return the toaken along with user data

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) throw err;
        //send the user and token in response
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

//@route GET /api/users/profile
//@desc GEet logged-in-user profile (protected route)
//@access private

router.get("/profile", protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
