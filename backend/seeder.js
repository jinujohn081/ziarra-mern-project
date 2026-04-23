// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Product = require("./models/Products");
// const User = require("./models/User");
// const products = require("./data/products");
// dotenv.config();
// // connect to mongodb

// mongoose.connect(process.env.MONGO_URL);

// //function to sed data

// const seedData = async () => {
//   try {
//     //claer existing data
//     await Product.deleteMany();
//     await User.deleteMany();

//     //create a default admin user

//     const createUser = await User.create({
//       name: "Admin User",
//       email: "admin@example.com",
//       password: "123456",
//       role: "admin",
//     });

//     const userID = createUser._id;
//     const sampleProducts = products.map((product) => {
//       return { ...product, user: userID };
//     });

//     // Insert the products into the database
//     await Product.insertMany(sampleProducts);
//     console.log("Product data seeded successfully");
//     process.exit();
//   } catch (error) {
//     console.error("Error seeding the data", error);
//     process.exit(1);
//   }
// };
// seedData();
// More improved version

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Products");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

// 🔹 Seed Function
const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    console.log("Old data cleared");

    // Create default admin user
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    const userID = createdUser._id;

    // Attach user to each product
    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });

    // Insert products
    await Product.insertMany(sampleProducts);

    console.log("Product data seeded successfully ✅");

    // Close connection gracefully
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding the data ❌", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// 🔹 Connect to MongoDB and then run seeder
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected 🚀");
    await seedData();
  } catch (error) {
    console.error("Database connection failed ❌", error);
    process.exit(1);
  }
};

connectDB();
