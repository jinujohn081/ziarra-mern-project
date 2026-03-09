const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
//connect to mongodb database
connectDB();

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Welcome to ziarra api");
});

//API Routes

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Srver is running on http://localhost:${PORT}`);
});
//password=5V6epYzva1BmLCci
