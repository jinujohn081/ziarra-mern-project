const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

// @route GET/api//users
// @desc Get all users (Admin only)
// @access Private/Admin

router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST/api/admin/users
// @desc Add a new user(admin only)
// @access Private/Admin

router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/admin/users/:id
// @desc Update user info (admin-only)-Name,email and role

// @access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
    }
    const updatedUser = await user.save();
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/admin/users/:id
// @desc Delete a user
// @access PRivate /Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
// {
//     "user": {
//         "_id": "69d795e43a00a5efb01ff9f4",
//         "name": "honey",
//         "email": "honey@gmail.com",
//         "role": "customer"
//     },
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjlkNzk1ZTQzYTAwYTVlZmIwMWZmOWY0In0sInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc3NTczNjI5MiwiZXhwIjoxNzc4MzI4MjkyfQ.5RrktDti4aLSGu91JlyKsOENJTFYgGrzLGiwvPlyUR0"
// }
//----------------------for admin-----------------

// {
//     "user": {
//         "_id": "69d7ac033416418027a14684",
//         "name": "admin3",
//         "email": "admin3@gmail.com",
//         "role": "admin"
//     },
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjlkN2FjMDMzNDE2NDE4MDI3YTE0Njg0In0sInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTc0MTk1NSwiZXhwIjoxNzc4MzMzOTU1fQ.S5mgwI4CdFe-NZ1kN9fViunxC1Ga6FL7OLgVfTyY4hk"
// }
